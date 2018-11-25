var express = require('express');
var router = express.Router();
const {Pool} = require('pg');

router.get('/api/gyms',(request,response)=>{

    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    let query = 'SELECT * FROM kuba.gyms';

    pool.query(query,(err,res)=>{
        response.json(res.rows);
    });

});

module.exports=router;