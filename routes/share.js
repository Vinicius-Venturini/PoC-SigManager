const express = require('express');
const router = express.Router();
const database = require('./../models/database');
const share = require('./../core/share');

router.post('/', async (req, res, next) => {
  if(req.body.txId && req.body.address && req.body.share){
    const client = await database();
    const response = await client.query('SELECT * FROM generate_key WHERE transaction_id = $1 AND fromaddress = $2', [req.body.txId, req.body.address]);
    if(response.rowCount != 1){
      res.status(403).send('403: Forbidden');
      return;
    }else{
      if(global.accounts[req.body.txId]){
        if(global.accounts[req.body.txId].address == req.body.address){
          for(let i = 0; i < global.accounts[req.body.txId].shares.length; i++){
            if(global.accounts[req.body.txId].shares[i] == req.body.share){
              res.status(403).send('403: Forbidden');
              return;
            }
          }
          global.accounts[req.body.txId].shares.push(req.body.share);
          res.status(204).send();
          await share(req.body.txId, req.body.address);
          return;
        }
      }
      res.status(403).send('403: Forbidden');
      return;
    }
  }else{
    res.status(400).send('400: Bad Request');
    return;
  }
});

module.exports = router;