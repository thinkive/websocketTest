var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res){
    res.send('Express');
});
app.listen(3000, () => console.log('Listening on http://localhost:3000'));