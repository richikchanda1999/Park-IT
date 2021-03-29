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

async function getParkingLotId(email){
    var db = client.db();
    var parking = await (await db.collection('managers')).findOne({ 'email': email });
    return parking['parking_id'];
}

async function getCurrentParking(parkingId){
    var db = client.db();
    var currParking = await (await db.collection('parking_status')).find({ 'parking_lot': parkingId });
    var status = [];
    await currParking.forEach((history) => {
        if(history['exit_time'] == "")
            status.push({'vehicle': history['vehicle'], 'parking_lot' : history['parking_lot'], 'entry_time' : history['entry_time'], 'status': history['status']})
    });
    return status;
}

async function vehicleEnter(parking_lot, vehicle, vehicleType, entry_time){
    var db = client.db();
    var book = await (await db.collection('parking_status')).findOne({'vehicle': vehicle, 'parking_lot': parking_lot, 'status': "booked" });
    var park = await (await db.collection('parking_curr_data')).findOne({'place_id': parking_lot });
    if(park['CAP'] == park['TPS']){
        return -1;
    }
    await (await db.collection('parking_curr_data')).updateOne({'place_id': parking_lot }, { $inc: {'CAP': 1}});
    if(book != null){
        var ret = await (await db.collection('parking_status')).updateOne({'vehicle': vehicle, 'parking_lot': parking_lot, 'status': "booked"}, { $set: {'status': "parked"}});
        console.log(ret);
        return ret.result.nModified === 1;
    }
    else{
        var ret = await (await db.collection('parking_status')).insertOne({'email': "other", 'vehicle': vehicle, 'parking_lot': parking_lot, 'vehicleType': vehicleType, 'entry_time': entry_time, 'status': "parked"});
        return ret.insertedCount === 1;
    }
}


async function vehicleExit(parking_lot, vehicle, exit_time){
    var db = client.db();
    var book = await (await db.collection('parking_status')).findOne({'vehicle': vehicle, 'parking_lot': parking_lot, 'status': "parked" });
    var park = await (await db.collection('parking_curr_data')).findOne({'place_id': parking_lot });
    if(park['CAP'] == 0){
        return -1;
    }
    if(book == null){
        return -1;
    }
    if(book['email'] == 'other'){
        await (await db.collection('parking_curr_data')).updateOne({'place_id': parking_lot }, { $inc: {'CAP': -1}});
        var ret = await (await db.collection('parking_status')).deleteOne({'email': "other", 'vehicle': vehicle, 'parking_lot': parking_lot, 'status': "parked" });
        const dateOneObj = new Date(book['entry_time']);
        console.log(dateOneObj);
        const dateTwoObj = new Date(exit_time);
        console.log(dateTwoObj);
        const milliseconds = Math.abs(dateTwoObj - dateOneObj);
        const hours = milliseconds / 36e5;

        var parking = await (await db.collection('parking_lots')).findOne({'place_id': parking_lot });
        var rate = parking['rate_per_hour'][book['vehicleType']];
        cost = (Math.ceil(hours)) * rate;
        console.log(cost);

        return cost;
    }
    else{
        await (await db.collection('parking_curr_data')).updateOne({'place_id': parking_lot }, { $inc: {'CAP': -1}});
        const dateOneObj = new Date(book['entry_time']);
        console.log(dateOneObj);
        const dateTwoObj = new Date(exit_time);
        console.log(dateTwoObj);
        const milliseconds = Math.abs(dateTwoObj - dateOneObj);
        const hours = milliseconds / 36e5;

        var parking = await (await db.collection('parking_lots')).findOne({'place_id': parking_lot });
        var rate = parking['rate_per_hour'][book['vehicleType']];
        cost = (Math.ceil(hours)-1) * rate;
        console.log(cost);

        var ret = await (await db.collection('parking_status')).updateOne({'vehicle': vehicle, 'parking_lot': parking_lot, 'status': "parked"}, { $set: {'exit_time':exit_time, 'status': "complete", 'cost': (cost+rate)}});

        return cost;
    }
}

module.exports.signUp = signUp;
module.exports.init = init;
module.exports.getPassword = getPassword;
module.exports.checkEmail = checkEmail;
module.exports.vehicleEnter = vehicleEnter;
module.exports.vehicleExit = vehicleExit;
module.exports.getParkingLotId = getParkingLotId;
module.exports.getCurrentParking = getCurrentParking;
