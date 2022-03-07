const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  if(req.body.txId){
    if(global.transactions[req.body.txId]){
        res.status(200).send({tx: global.transactions[req.body.txId]});
        delete global.transactions[req.body.txId];
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