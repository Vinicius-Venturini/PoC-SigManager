const express = require('express');
const router = express.Router();
const database = require('../models/database');
const endReg = require('../core/account');

router.get('/', async (req, res, next) => {
  if(req.query.address && req.query.wallet){
    const client = await database();
    const response = await client.query('SELECT share FROM shares WHERE address = $1 AND wallet = $2', [req.query.address, req.query.wallet]);
    if(response.rowCount == 1){
      res.status(200).send({share: response.rows[0].share});
      await client.query('DELETE FROM shares WHERE address = $1 AND wallet = $2', [req.query.address, req.query.wallet]);
      await endReg(req.query.address);
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