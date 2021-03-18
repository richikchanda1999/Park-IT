let express = require('express');
let twilio = require('twilio')
let router = express.Router();
let bcrypt = require('bcrypt');
let db = require('./db')
require('dotenv').config();

let countryCode, number, verificationID, service;

router.post('/sign_in', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    let info = await db.getPassword(email);
    if (info == null) res.status(598).send("Email does not exist!\n");
    else {
        let isEqual = await bcrypt.compare(password, info['pass']);

        console.log(isEqual);
        console.log(info);
        if (isEqual) {

            res.status(200).send(JSON.stringify(info));
        } else {
            res.status(599).send("Password incorrect\n");
        }
    }
});

router.post('/sign_up', async function (req, res) {
    let first_name = req.body.firstName;
    let last_name = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let con_pass = req.body.confirmPassword;
    let rating = 5;

    let pass = await bcrypt.hash(req.body.Password, 12);
    let present_earlier = await db.checkEmail(email);

    if (present_earlier === false) {
        if (con_pass === password) {
            console.log(first_name + " " + last_name + " " + email + " " + con_pass + " " + pass);
            let ret = await db.signUp(first_name, last_name, email, pass, '', rating);
            if (ret) res.status(200).send('');
            else res.status(599).send('DB Error');
        }
        else res.status(499).send('Password does not match');
    }
    else res.status(498).send('User already present!');
});

router.post('/otp/send', async function (req, res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    console.log(accountSid);
    console.log(authToken);
    console.log(process.env.OTP_SERVICE_NAME);
    const client = twilio(accountSid, authToken);

    countryCode = req.body.countryCode;
    number = req.body.number;

    console.log(`Country Code: ${countryCode}, Number: ${number}`);

    try {
        // let service = await client.verify.services.create({friendlyName: 'My Verify Service'});
        let services = await client.verify.services.list();
        for(let i = 0 ; i < services.length; ++i) {
            let temp = services[i];
            if (temp.friendlyName === process.env.OTP_SERVICE_NAME) {
                service = temp;
                break;
            }
        }

        if (service === null) service = await createServiceForOTP(client);
        verificationID = await sendOTP(client, service, `${countryCode}${number}`);
        if (verificationID != null) res.status(200).send('');
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

});

router.post('/otp/verify', async function(req, res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    try {
        let check = await client.verify.services(service.sid)
            .verificationChecks
            .create({to: `${countryCode}${number}`, code: req.body.code});
        console.log(check.status);
        if (check.status === "approved") {
            let ret = await db.signUp('', '', '', '', '', 5);
            if (ret) res.status(200).send('Success');
            else res.status(599).send('DB Error');
        }
        else res.status(500).send('');
    } catch(e) {
        console.error(e);
        res.status(500).send(e);
    }
});

async function createServiceForOTP(client) {
    console.log("Creating OTP Service");
    try {
        return await client.verify.services.create({'friendlyName': process.env.OTP_SERVICE_NAME});
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function sendOTP(client, service, to) {
    console.log("Sending OTP");
    if (service != null) {
        console.log(service.sid);
        let verification = await client.verify.services(service.sid).verifications.create({to: to, channel: 'sms'});
        return verification.sid;
    }
    return null;
}

module.exports = router;