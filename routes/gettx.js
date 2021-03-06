const express = require('express');
const router = express.Router();
const database = require('../models/database');

router.get('/', async (req, res, next) => {
  if(req.query.txId){
    const client = await database();
    const response = await client.query('SELECT rawtx FROM signedTransactions WHERE txid = $1', [req.query.txId]);
    if(response.rowCount == 1){
      res.status(200).send({tx: response.rows[0].rawtx});
      await client.query('DELETE FROM signedTransactions WHERE txid = $1', [req.query.txId]);
      return;
    }else{
      res.status(404).send('404: Transaction Not Found');
      return;
    }
  }else{
    res.status(400).send('400: Bad Request');
    return;
  }
});

module.exports = router;