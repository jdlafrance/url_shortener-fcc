var express = require('express');
var app = express();

app.get('/', function(req, res){
    var regExp = /\(([^)]+)\)/;
var obj = {
    "ipaddress": req.headers['x-forwarded-for'],
    "language": req.headers['accept-language'],
    "software": regExp.exec(req.headers['user-agent'])[1]
};
res.send(obj);

});

app.listen(8080);