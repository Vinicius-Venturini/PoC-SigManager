const Web3 = require('web3');
const web3 = new Web3();
const secret = require('./secrets');

module.exports = function(){

    var shares = [];
    const account = web3.eth.accounts.create();

    delete account.signTransaction;
    delete account.sign;
    delete account.encrypt;

    secret.getShares(account.privateKey, 5, 3, 1024, (error, data) => {
        if(!error){
            for(var i = 0; i < data.length; i++){
                shares[i] = data[i];
                data[i] = '';
            }
        }
    });

    account.privateKey = '';

    return {address: account.address, shares: shares};
}