const axios = require('axios');
const database = require('./../models/database');

module.exports = async function(address){
    const client = await database();

    const response = await client.query('SELECT * FROM shares WHERE address = $1', [address]);

    if(response.rowCount == 0){
        await axios.post('http://localhost:5000/reg_cliente_end', {
            ID_Add: address
        });

        await client.query('UPDATE accounts SET status = $1 WHERE address = $2', ["Aprovada", address]);
    }
}