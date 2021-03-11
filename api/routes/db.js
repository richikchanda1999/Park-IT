const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://richik:richik@parkit.hmsnp.mongodb.net/park_it?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const haversine = require('haversine');

async function init() {
    await client.connect();
}

async function getPassword(email) {
    let db = client.db();
    let doc = await (await db.collection('users')).findOne({ 'email': email });
    return doc != null ? doc['pass'] : null;
}
async function signUp(first_name, last_name, email, pass, number, rating) {
    let db = client.db();
    let ret = await (await db.collection('users')).insertOne({ firstName: first_name, lastName: last_name, email: email, pass: pass, number: number, rating: rating });
    return ret.insertedCount === 1;
}
async function checkEmail(email) {
    let db = client.db();
    let check = await (await db.collection('users')).findOne({ 'email': email });
    console.log(`User present: ${check != null}`);
    return check != null;
}

async function getNearbyParkingLots(lat, lon, rad) {
    let db = client.db();
    let parkingLotsCursor = await (await db.collection('parking_lots')).find();
    const parkingLots = [];
    await parkingLotsCursor.forEach((parkingLot) => {
        if (haversine({ latitude: lat, longitude: lon },
            { latitude: parkingLot['latitude'], longitude: parkingLot['longitude'] }, { threshold: rad }))
            parkingLots.push(parkingLot);
    });
    // console.log(parkingLots);
    return parkingLots;
}

async function getRealtimeData(place_id) {
    let db = client.db();
    let status = await (await db.collection('parking_curr_data')).findOne({ 'place_id': place_id });
    return { 'CAP': status['CAP'], 'TPS': status['TPS'] };
}

async function getUserHistory(email){
    var db = client.db();
    var userHistory = await (await db.collection('parking_status')).find({ 'email': email });
    const status = [];
    await userHistory.forEach((history) => {
        status.push({'vehicle': history['vehicle'], 'parking_lot' : history['parking_lot'], 'entry_time' : history['entry_time'], 'exit_time' : history['exit_time'], 'cost' : history['cost'], 'rating' : history['rating']})
    });
    return status;
}

module.exports.signUp = signUp;
module.exports.init = init;
module.exports.getPassword = getPassword;
module.exports.checkEmail = checkEmail;
module.exports.getNearbyParkingLots = getNearbyParkingLots;
module.exports.getRealtimeData = getRealtimeData;
module.exports.getUserHistory = getUserHistory;
