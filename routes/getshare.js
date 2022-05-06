const express = require('express');
const router = express.Router();
const database = require('../models/database');
const endReg = require('../core/account');

router.post('/', async (req, res, next) => {
  if(req.body.address && req.body.wallet){
    const client = await database();
    const response = await client.query('SELECT * FROM shares WHERE address = $1 AND wallet = $2', [req.body.address, req.body.wallet]);
    if(response.rowCount == 1){
      res.status(200).send({share: response.rows[0].share});
      await client.query('DELETE FROM shares WHERE address = $1 AND wallet = $2', [req.body.address, req.body.wallet]);
      await endReg(req.body.address);
      return;
    }else{
      res.status(404).send('404: Address Not Found');
      return;
    }
  }else{
    res.status(400).send('400: Bad Request');
    return;
  }
});

module.exports = router;