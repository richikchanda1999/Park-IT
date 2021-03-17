require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const shortid = require('shortid');
const cors = require('cors')
const router = express.Router();
const crypto= require('crypto');
let db = require('./db');

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

router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
        console.log(orderCreationId);
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

router.post("/booked",async (req,res)=>{
    console.log(req.body);
    let email = req.body.email;
    let parking_lot = req.body.parking_lot;
    let entry_time = req.body.entry_time;
    let vehicleNum = req.body.vehicle;
    let cost = req.body.cost;
    status=req.body.status;
    let booked= await db.booking_complete(email,parking_lot,entry_time,vehicleNum,cost,status);
    if(booked)
    {
        res.status(200).send('booking_done');
    } else {
        res.status(500).send('booking_not_confirmed');
    }
});

module.exports= router;