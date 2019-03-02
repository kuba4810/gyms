const path = require('path');
module.exports = (app) => {

    app.get('/forum/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });
    app.get('/forum', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });
    app.get('/silownie/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });
    app.get('/silownie', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });

    app.get('/trenerzy/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });

    app.get('/trenerzy', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });

    app.get('/uzytkownik/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });
    app.get('/uzytkownik', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../' , 'public', 'index.html'));
    });
};