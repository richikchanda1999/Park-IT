require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const shortid = require('shortid');
const cors = require('cors')
const router = express.Router();
const crypto= require('crypto');
let db = require('./db');

//this function recives a post request to make a successful order of the payemnt which the user wants to make
router.post("/order", async (req, res) => {
    console.log("Called");
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        console.log(req.body);
        const payment_capture=1;
        const options = {
            amount: req.body.amount*100, // amount in smallest currency unit
            currency: "INR",
            receipt: shortid.generate(),
            payment_capture
        };

        const order = await instance.orders.create(options);
        console.log(order);
        if (!order) return res.status(500).send("Some error occured");

        res.status(200).send(JSON.stringify(order));

    } catch (error) {
        res.status(500).send(error);
    }
});

//this post request verifies whether the order has been successful which the user has done and to verify it
router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            user,
        } = req.body;
        console.log(orderCreationId);
        console.log("In success: userId",user); 
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        console.log(shasum);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        const enter=await db.order_done(user,razorpayPaymentId);
        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//this is the final booking request to cross verify all the details the user and whether the payemnt done by the user is legit or not and if it is then reply the frontend with a successful request

router.post("/booked",async (req,res)=>{
    console.log(req.body);
    let email = req.body.email;
    let id= req.body.id;
    let parking_lot = req.body.parking_lot;
    let entry_time = req.body.entry_time;
    let vehicleNum = req.body.vehicle;
    let cost = req.body.cost;
    let status=req.body.status;
    let payment_id=req.body.payment_id;
    let validate_booking=await db.validate_booking(id,payment_id);
    if(validate_booking)
    {
        let booked= await db.booking_complete(email,parking_lot,entry_time,vehicleNum,cost,status);
        if(booked){
            let update_occupancy =await db.update_occupancy(parking_lot);
            res.status(200).send('booking_done');
        }
        else{
        res.status(500).send('booking_not_confirmed');
        }
    } else {
        res.status(501).send('booking_not_validated');
    }
});

module.exports= router;