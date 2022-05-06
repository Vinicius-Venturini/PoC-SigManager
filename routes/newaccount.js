const express = require('express');
const router = express.Router();
const database = require('../models/database');
const newaccount = require('./../core/newaccount');
const axios = require('axios');

/*

CREATE TABLE newAccount (
	address varchar(42) NOT NULL PRIMARY KEY
);

CREATE TABLE shares (
	share varchar(1024) NOT NULL,
	wallet varchar(500) NOT NULL,
	address varchar(42),
	PRIMARY KEY (share),
	FOREIGN KEY (address) REFERENCES newAccount(address)
);

*/

router.post('/', async (req, res, next) => {

    const account = newaccount();
    var walletsUsed = [], wallet;

    while(walletsUsed.length < 5){
        wallet = "wallet_" + Math.floor(Math.random() * 8);
        if(!walletsUsed.find(element => element == wallet))
            walletsUsed.push(wallet);
    }

    try{
        const client = await database();

        let wallets = '{\"';
        for(let i = 0; i < walletsUsed.length; i++){
            wallets += walletsUsed[i] + '\"';
            if(i != (walletsUsed.length - 1))
                wallets += ',\"';
            else
                wallets += '}';
        }

        await client.query('INSERT INTO accounts VALUES ($1, $2)', [account.address, wallets]);
        await client.query('INSERT INTO newAccount VALUES ($1)', [account.address]);
        for(var i = 0; i < account.shares.length; i++){
            await client.query('INSERT INTO shares VALUES ($1, $2, $3)', [account.shares[i], walletsUsed[i], account.address]);
        }

        res.status(204).send();

        await axios.post('http://localhost:5000/reg_cliente', {
            ID_Add: account.address,
            Signers: walletsUsed
        });

        delete account;
        delete walletsUsed;

        return;
    }catch(e){
        res.status(500).send('500: Internal Server Error');
        return;
    }

});

module.exports = router;