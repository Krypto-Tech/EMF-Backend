
const pool = require('./database')
async function testConnection(){
    try{
        const result = await pool.query('SELECT NOW()');
        console.log(result.rows[0]);

    }catch(err){
        console.error(err);

    }

}
testConnection();