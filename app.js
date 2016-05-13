
var mongo = require('mongodb').MongoClient;
var url = require('url');
var express = require('express');
var app = express();
var request = require('request');
var regExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

var shortURLPromise,
 short = require('short');
 
short.connect('mongodb://localhost/short');
   short.connection.on('error', function(error){
    throw new Error(error);
});

app.get('/', function(req,res){
    var URL = url.parse(req.url).query;
    if (regExp.exec(URL) != null){
    var URL1 = URL.replace('https://', '').replace('http://', '');
 var shortURLPromise = short.generate({URL : URL1});
 shortURLPromise.then(function(mongodbDoc){
     short.retrieve(mongodbDoc.hash).then(function(result){
        var obj = {
             'original_url': URL1,
             'short_url': result.hash
         };
         
         
         res.send(obj);
     }, function(error){
         if (error) throw new Error(error);
     });
 }, function(error){
     if (error) throw new Error(error);
 });
    } else {
        var err = {
            'error': 'Wrong url format'
        };
        res.send(err);
    }
 });


app.listen(8080);