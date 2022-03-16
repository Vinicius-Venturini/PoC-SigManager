const secret = require('./secrets');
const signTransaction = require('./transaction');
const axios = require('axios');
const database = require('./../models/database');

/**
 * Função para a verificar se uma transação já possui todos seus m shares necessários para ser assinada
 * 
 * @param {String} txId Identificador da transação
 * @param {String} address Endereço público da conta
 */
module.exports = async function(txId, address){
    if(global.accounts[txId].shares.length >= 3){
        // Implementar verificador se a transação já foi assinada simultaneamente
        await secret.getKey(global.accounts[txId].shares, async (error, privateKey) => {
            if(privateKey){
                const client = await database();
                let response = await client.query('SELECT * FROM generate_key WHERE transaction_id = $1 AND fromaddress = $2', [txId, address]);
                await signTransaction(response.rows[0].nonce, response.rows[0].chainid, response.rows[0].toaddress, response.rows[0].value, response.rows[0].gasprice, response.rows[0].gaslimit, privateKey, async (error, data) => {
                    if(data){
                        global.transactions[txId] = data;
                        const mqtt = await axios.post('http://localhost:5000/transaction_end', {
                            ID_Tx: txId
                        });
                    }
                });
                privateKey = '';
                delete global.accounts[txId];
                response = '';
                await client.query('DELETE FROM generate_key WHERE transaction_id = $1 AND fromaddress = $2', [txId, address]);
            }
        });
    }
}