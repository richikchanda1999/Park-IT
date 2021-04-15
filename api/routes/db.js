const {MongoClient} = require('mongodb');
const client = new MongoClient("mongodb+srv://richik:richik@parkit.hmsnp.mongodb.net/park_it?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const haversine = require('haversine');

async function init() {
    await client.connect();
}

async function getPassword(email) {
    let db = client.db();
    let doc = await (await db.collection('users')).findOne({'email': email});
    return doc != null ? doc : null;
}

async function signUp(name, number, email, pass, rating) {
    let db = client.db();
    let ret = await (await db.collection('users')).insertOne({
        name: name,
        number: number,
        email: email,
        pass: pass,
        rating: rating
    });
    return ret.insertedCount === 1;
}
async function order_done(user_id,razorpayPaymentId)
{
    let db=client.db();
    let ret =await (await db.collection('order_successful')).insertOne({
        user:user_id,
        order_id:razorpayPaymentId
    });
    return true;
}
async function validate_booking(user_id,paymentId)
{
    let db=client.db();
    let ret =await (await db.collection('order_successful')).findOne({user:user_id,order_id:paymentId});
    return ret!=null;
}
async function checkEmail(email) {
    let db = client.db();
    let check = await (await db.collection('users')).findOne({'email': email});
    console.log(`User present: ${check != null}`);
    return check != null;
}
async function update_occupancy(place_id)
{
    let db=client.db();
    await (await db.collection('parking_curr_data')).updateOne({'place_id': place_id}, {$inc: {'CAP': 1}});
    return true;
}
async function getNearbyParkingLots(lat, lon, rad) {
    let db = client.db();
    let parkingLotsCursor = await (await db.collection('parking_lots')).find();
    const parkingLots = [];
    await parkingLotsCursor.forEach((parkingLot) => {
        if (haversine({latitude: lat, longitude: lon},
            {latitude: parkingLot['latitude'], longitude: parkingLot['longitude']}, {threshold: rad}))
            parkingLots.push(parkingLot);
    });
    // console.log(parkingLots);
    return parkingLots;
}

async function getRealtimeData(place_id) {
    let db = client.db();
    let status = await (await db.collection('parking_curr_data')).findOne({'place_id': place_id});
    return {'CAP': status['CAP'], 'TPS': status['TPS']};
}

async function getUserHistory(email) {
    let db = client.db();
    let userHistory = await (await db.collection('parking_status')).find({'email': email});
    const status = [];
    await userHistory.forEach((history) => {
        status.push({
            'vehicle': history['vehicle'],
            'parking_lot': history['parking_lot'],
            'entry_time': history['entry_time'],
            'exit_time': history['exit_time'],
            'cost': history['cost'],
            'rating': history['rating']
        })
    });
    return status;
}

async function updateParkingLotCapacity(place_id) {
    let db = client.db();

    let res = await (await db.collection('parking_curr_data')).findOne({'place_id': place_id});
    if (res != null) {
        let res2 = await (await db.collection('parking_curr_data')).updateOne({'place_id': place_id}, {'$set': {'CAP': res['CAP'] - 1}});
        return res2.modifiedCount;
    }

}

async function booking_complete(email, parking_lot, entry_time, vehicleNum, cost, status) {
    console.log(email, parking_lot, entry_time, vehicleNum, cost, status);
    let db = client.db();
    let res = await (await db.collection('parking_status')).insertOne({
        'email': email,
        'vehicle': vehicleNum,
        'parking_lot': parking_lot,
        'entry_time': entry_time,
        'cost': cost,
        'status': status
    });

    let ret = await updateParkingLotCapacity(parking_lot);

    return res.insertedCount === 1 && ret > 0;
}

async function getParkingName(parking_id) {
    var db = client.db();
    console.log(parking_id);
    var parking = await (await db.collection('parking_lots')).findOne({'place_id': parking_id});
    console.log(parking);
    return parking!=null?parking['name']:"";
}

async function updateRating(email, entry_time, rating) {
    let db = client.db();
    console.log(email, entry_time, rating);

    let ret = await (await db.collection('parking_status')).updateOne({
        'email': email,
        'entry_time': entry_time
    }, {$set: {'rating': rating}});
    return ret.result.nModified === 1;
}

module.exports.signUp = signUp;
module.exports.init = init;
module.exports.getPassword = getPassword;
module.exports.checkEmail = checkEmail;
module.exports.getNearbyParkingLots = getNearbyParkingLots;
module.exports.getRealtimeData = getRealtimeData;
module.exports.getUserHistory = getUserHistory;
module.exports.booking_complete = booking_complete;
module.exports.getParkingName = getParkingName;
module.exports.updateRating = updateRating;
module.exports.order_done=order_done;
module.exports.validate_booking=validate_booking;
module.exports.update_occupancy=update_occupancy;
