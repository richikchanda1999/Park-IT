let express = require('express');
let router = express.Router();
let db = require('./db');

router.post('/vehicle_enter', async function (req, res) {           // Mark Entry of Vehicle in the dataBase
    let parking_lot = req.body.parking_lot;
    let vehicle = req.body.vehicle;
    let vehicleType = req.body.vehicleType;
    let entry_time = req.body.entry_time;
    let result = await db.vehicleEnter(parking_lot, vehicle, vehicleType, entry_time);
    console.log(result);
    res.status(200).send(JSON.stringify(result));
});

router.post('/vehicle_exit', async function (req, res) {           // Mark Exit of Vehicle in the dataBase
    let parking_lot = req.body.parking_lot;
    let vehicle = req.body.vehicle;
    let exit_time = req.body.exit_time;
    let ratingManager = req.body.ratingManager;
    let result = await db.vehicleExit(parking_lot, vehicle, exit_time, ratingManager);
    console.log(result);
    res.status(200).send(JSON.stringify(result));
});

router.post('/get_current_parking', async function (req, res) {           // Fetch Current Parking Details of the Parking Lot
    let email = req.body.email;
    console.log(email);
    let parkingId = await db.getParkingLotId(email);
    console.log(parkingId);
    let status = await db.getCurrentParking(parkingId);
    res.status(200).send(JSON.stringify(status));
});

module.exports = router;