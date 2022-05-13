const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 6060;

global.accounts = {}; // Variável global para armazenamento dos shares

app.use(bodyParser.json());

const newAccountRouter = require('./routes/newaccount');
const txRouter = require('./routes/transaction');
const getTxRouter = require('./routes/gettx');
const getShareRouter = require('./routes/getshare');
const shareRouter = require('./routes/share');
app.use('/newaccount', newAccountRouter);
app.use('/transaction', txRouter);
app.use('/gettx', getTxRouter);
app.use('/getshare', getShareRouter);
app.use('/share', shareRouter);

app.use(function(req, res){
  res.status(404).send('404: Not Found');
});

app.use(function(error, req, res, next){
  res.status(500).send('500: Internal Server Error');
});

app.listen(PORT, () => {
  console.log('servidor ouvindo na porta ' + PORT);
});
