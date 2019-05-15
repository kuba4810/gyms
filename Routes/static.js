const path = require('path');
module.exports = (app) => {

    app.get('/forum/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client', 'build' , 'index.html'));
    });
    app.get('/forum', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });
    app.get('/silownie/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client', 'build' ,'index.html'));
    });
    app.get('/silownie', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });

    app.get('/trenerzy/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });

    app.get('/trenerzy', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client', 'build' ,'index.html'));
    });

    app.get('/uzytkownik/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });
    app.get('/uzytkownik', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });

    app.get('/nowe-haslo/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });

    app.get('/verify-email/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'client','build' , 'index.html'));
    });


    app.get('/public/images/:name' , (request,response) =>{

        response.sendFile(path.resolve(__dirname, '../' , 'public', 'images' , request.params.name));

    })
};