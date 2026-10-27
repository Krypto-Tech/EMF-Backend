const {Pool} = require('pg');
const pool = new Pool({
    user:'admin',
    host:'localhost',
    database:'flutter_auth',
    password:'',
    port:5432,


});
module.exports=pool;