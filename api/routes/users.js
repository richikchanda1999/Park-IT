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

router.post('/update_rating', async function (req, res) {
  let email = req.body.email;
  let entry_time = req.body.entry_time;
  let rating = req.body.rating;

  console.log(email, entry_time, rating);

  let status = await db.updateRating(email, entry_time, rating);
  res.status(200).send(JSON.stringify(status));
});

module.exports = router;
