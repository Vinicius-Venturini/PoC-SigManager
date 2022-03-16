const express = require('express');
const router = express.Router();
const axios = require('axios');
const sha256 = require('js-sha256').sha256;
const database = require('./../models/database');

router.post('/', async (req, res, next) => {
  if(req.body.txId && req.body.timestamp && req.body.tx.nonce && req.body.tx.chainId && req.body.tx.to && req.body.tx.value && req.body.tx.gasPrice && req.body.tx.from && req.body.tx.gasLimit){

    if(req.body.txId != sha256(req.body.tx.from + req.body.tx.to + req.body.tx.value + req.body.timestamp)){
      res.status(403).send('403: Forbidden');
      return;
    }

    console.log(req.body);
    
    const client = await database();
    const response = await client.query('SELECT * FROM accounts WHERE address = $1', [req.body.tx.from]);
    if(response.rowCount != 1){
      res.status(403).send('403: Forbidden');
      return;
    }else{
      if(global.accounts[req.body.txId]){
        res.status(403).send('403: Forbidden');
        return;
      }else{
        try{
          const mqtt = await axios.post('http://localhost:5000/transaction', {
            ID_Add: req.body.tx.from,
            Signers: response.rows[0].signers,
            ID_Tx: req.body.txId
          });
          await client.query('INSERT INTO generate_key VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [req.body.txId, req.body.tx.from, req.body.tx.nonce, req.body.tx.chainId, req.body.tx.to, req.body.tx.value, req.body.tx.gasPrice, req.body.tx.gasLimit]);
          global.accounts[req.body.txId] = {'address' : req.body.tx.from, 'shares' : []};
          res.status(204).send();
          return;
        }catch (error){
          res.status(500).send('500: Internal Server Error');
          return;
        }
      }
    }
  }else{
    res.status(400).send('400: Bad Request');
    return;
  }
});

module.exports = router;