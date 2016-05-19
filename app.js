
var mongo = require('mongodb').MongoClient;
var url = require('url');
var express = require('express');
var app = express();
var regExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

var shortURLPromise,
 short = require('short');
var dbdist = process.env.MONGOLAB_URI;
var urlLocal = 'mongodb://localhost:27017/database';
mongo.connect(dbdist, function(err, db){
   if (err) {console.log('unable to connect. Error:', err);
   } else {
       console.log('connection established to', dbdist)
   }
   var collection = db.collection('short');

short.connect(dbdist);
   short.connection.on('error', function(error){
    throw new Error(error);
});

app.get('/', function(req,res, next){
    var URL = url.parse(req.url).query;
    collection.find({short_url: URL}).toArray(function(err, docs){
        if (err) return;
      if (docs[0] != undefined){
          res.redirect('https://' + docs[0].original_url);
          //db.close();
          next();
      } else if (regExp.exec(URL) != null){
    var URL1 = URL.replace('https://', '').replace('http://', '');
 var shortURLPromise = short.generate({URL : URL1});
 shortURLPromise.then(function(mongodbDoc){
     short.retrieve(mongodbDoc.hash).then(function(result){
        var obj = {
             'original_url': URL1,
             'short_url': result.hash
         };

        collection.insert({original_url: URL1, short_url: obj.short_url});
        res.send(obj);
        next();
        
         
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
        next();
    }
 });
});
//db.close();
});

app.listen(process.env.PORT);