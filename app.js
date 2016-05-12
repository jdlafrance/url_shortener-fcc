var express = require('express')
var app = express()
var url = require('url')

var months = {
'0': 'January',
'1': 'February',
'2': 'March',
'3': 'April',
'4': 'May',
'5': 'June',
'6': 'July',
'7': 'August',
'8': 'September',
'9': 'October',
'10': 'November',
'11': 'December'
};

var obj = {
unix: 0,
natural: 0
};

function natural(val){return (months[val.getMonth()] + ' ' + val.getDate() + ', ' + val.getFullYear());
};

app.get('/', function(req, res){
var url_parts = url.parse(req.url, true)                                                                    
var search = url_parts.search;
var str = search.replace('?','0').replace(/%20/g, ' ');


if(new Date(str/1).getDate() > 0){
obj.unix = str;
var naturalDate = new Date(str/1);
obj.natural = natural(naturalDate);
res.send(obj);
} else {
var date = Date.parse(str);

if (date){
var naturalDate = new Date(date);
obj.unix = date;
obj.natural = natural(naturalDate);
res.send(obj);
} else {
obj.unix = null;
obj.natural = null;
res.send(obj);
}}
})

app.listen(8080);