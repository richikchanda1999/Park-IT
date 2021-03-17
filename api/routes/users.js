let express = require('express');
let router = express.Router();
let db = require('./db');

router.post('/get_user_history', async function (req, res) {
  let email = req.body.email;
  let status = await db.getUserHistory(email);
  console.log(status);
  for(let i=0; i<status.length; i++){
    status[i]['parking_lot'] = await db.getParkingName(status[i]['parking_lot']);
  }
  res.status(200).send(JSON.stringify(status));
});

module.exports = router;
