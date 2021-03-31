let express = require('express');
let router = express.Router();
let db = require('./db');

router.post('/get_manager', async function (req, res) {
    let result = await db.getManager();
    console.log(result);
    res.status(200).send(JSON.stringify(result));
});

router.post('/get_parking', async function (req, res) {
    let result = await db.getParking();
    //console.log(result);
    res.status(200).send(JSON.stringify(result));
});

router.post('/get_user', async function (req, res) {
    let result = await db.getUser();
    console.log(result);
    res.status(200).send(JSON.stringify(result));
});

module.exports = router;