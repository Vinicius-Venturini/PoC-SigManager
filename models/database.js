const { Pool } = require('pg');

const pool = new Pool({
    user: 'node',
    host: 'localhost',
    database: 'PoC',
    password: 'ykGE|?fF@f@pexpp69||',
    port: 5432,
});

async function dbConnect(){
    try {
        const con = pool.connect();
        global.connection = con;
        return con;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = async function(){
    if (!global.connection)
        return await dbConnect();

    return global.connection;
}
