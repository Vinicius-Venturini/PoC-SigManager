const secrets = require('secrets.js-grempe');

/**
 * Função para a geração de n shares a partir de uma chave privada!
 * 
 * @param {String} privateKey Chave privada que será dividida em shares
 * @param {int} n Quantidade n de shares que será gerada
 * @param {int} m Quantidade m <= n de shares necessária para a reconstrução da chave privada
 * @param {int} padding Tamanho dos shares (128,256 ou 1024)
 * @param {Function} callback Callback com retorno de 2 parâmetros (error, data) sendo data o array de shares gerado
 */
async function getShares (privateKey, n, m, padding, callback) {
    try{
        let pwHex = secrets.str2hex(privateKey);
        let response = secrets.share(pwHex, n , m, padding);
        privateKey = '';
        pwHex = '';
        return callback(null, response);
    }catch(error){
        console.log(error);
        return callback(true, null);
    }
}

/**
 * Função para a reconstrução de uma chave privada a partir de um array de shares!
 * 
 * @param {String[]} shares Array de uma quantidade x >= m de shares para a reconstrução de uma chave privada
 * @param {Function} callback Callback com retorno de 2 parâmetros (error, data) sendo data a chave privada reconstruída
 */
async function getKey (shares, callback) {
    try{
        return callback(null, secrets.hex2str(secrets.combine(shares)));
    }catch(error){
        console.log(error);
        return callback(true, null);
    }
}

module.exports = {
    getShares,
    getKey
};