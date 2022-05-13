const express = require('express');
const router = express.Router();
const database = require('../models/database');

router.get('/', async (req, res, next) => {
  if(req.query.address){
    const client = await database();
    const response = await client.query('SELECT status FROM accounts WHERE address = $1', [req.query.address]);
    if(response.rowCount == 1){
      res.status(200).send({status: response.rows[0].status});
      return;
    }else{
      res.status(404).send('404: Account Not Found');
      return;
    }
  }else{
    res.status(400).send('400: Bad Request');
    return;
  }
});

module.exports = router;