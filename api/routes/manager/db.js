const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://richik:richik@parkit.hmsnp.mongodb.net/park_it?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// const haversine = require('haversine');

async function init() {
    await client.connect();
}

async function getPassword(email) {
    let db = client.db();
    let doc = await (await db.collection('managers')).findOne({ 'email': email });
    return doc != null ? doc: null;
}

async function signUp(first_name, last_name, email, pass, number, rating) {
    let db = client.db();
    let ret = await (await db.collection('managers')).insertOne({ firstName: first_name, lastName: last_name, email: email, pass: pass, number: number, rating: rating });
    return ret.insertedCount === 1;
}

async function checkEmail(email) {
    let db = client.db();
    let check = await (await db.collection('managers')).findOne({ 'email': email });
    console.log(`User present: ${check != null}`);
    return check != null;
}

// async function getUserHistory(email){
//     let db = client.db();
//     let userHistory = await (await db.collection('parking_status')).find({ 'email': email });
//     const status = [];
//     await userHistory.forEach((history) => {
//         status.push({'vehicle': history['vehicle'], 'parking_lot' : history['parking_lot'], 'entry_time' : history['entry_time'], 'exit_time' : history['exit_time'], 'cost' : history['cost'], 'rating' : history['rating']})
//     });
//     return status;
// }

// async function booking_complete(email,parking_lot,entry_time,vehicleNum,cost,status)
// {
//     console.log(email, parking_lot, entry_time, vehicleNum, cost, status);
//     let db=client.db();
//     let res=await (await db.collection('parking_status')).insertOne({'email':email,'vehicle':vehicleNum,'parking_lot':parking_lot,'entry_time':entry_time,'cost':cost,'status':status});
//     return res.insertedCount===1;
// }
//
// async function getParkingName(parking_id){
//     var db = client.db();
//     console.log(parking_id);
//     var parking = await (await db.collection('parking_lots')).findOne({ 'place_id': parking_id });
//     console.log(parking);
//     return parking['name'];
// }
//
// async function updateRating(email, entry_time, rating) {
//     let db = client.db();
//     console.log(email, entry_time, rating);
//
//     let ret = await (await db.collection('parking_status')).updateOne({ 'email': email, 'entry_time': entry_time}, { $set: {'rating': rating}});
//     return ret.result.nModified === 1;
// }

module.exports.signUp = signUp;
module.exports.init = init;
module.exports.getPassword = getPassword;
module.exports.checkEmail = checkEmail;
// module.exports.getUserHistory = getUserHistory;
// module.exports.booking_complete = booking_complete;
// module.exports.getParkingName = getParkingName;
// module.exports.updateRating = updateRating;
