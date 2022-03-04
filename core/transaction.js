const Web3 = require('web3');
const web3 = new Web3();

module.exports = async function(nonce, chainId, to, value, gasPrice, gasLimit, privateKey, callback){

  const txObject = {
    nonce: nonce,
    chainId: chainId,
    to: to,
    value: value,
    gasPrice: gasPrice,
    gasLimit: gasLimit
  };

  try{
    const tx = await web3.eth.accounts.signTransaction(txObject, privateKey);
    privateKey = '';
    return callback(null, tx.rawTransaction);
  }catch(error){
    console.log(error);
    privateKey = '';
    return callback(true, null);
  }

}
