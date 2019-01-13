const express = require('express');
const fileUpload = require('express-fileupload');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

var app = express();

// Connection with postgres
const client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect((err)=>{
    if(!err){
        console.log('Połączono z bazą danych !');        
    }    
});

var gymRoute = require('./Routes/gyms');

/* SETTINGS */
/* ------------------------------ */
app.use(express.static('./public'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.get('/forum/*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/silownie/*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/trenerzy/*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/uzytkownik/*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

/* ------------------------------ */

// Routes
require('./Routes/messages')(app,client);
require('./Routes/trainers')(app,client);
require('./Routes/notifications')(app,client);
require('./Routes/user')(app,client);
require('./Routes/questions')(app,client);
app.use(gymRoute);
 

var port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
