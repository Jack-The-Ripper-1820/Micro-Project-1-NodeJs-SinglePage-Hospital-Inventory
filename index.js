//importing express for major constants
const { query } = require('express');
const express= require('express');
const app=express();

//importing body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//import mongodb, server and middleware
const MongoClient=require('mongodb').MongoClient;
let server = require('./server');
let config = require('./config');
let middleware = require('./middleware');
const response = require('express');

//db connection
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';

let db
MongoClient.connect(url,{useUnifiedTopology : true}, (err,client) =>
{
    if(err)
        return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//get hospital details
app.get('/hospitaldetails', middleware.checkToken, function(req, res)
{
    console.log("Fetching data from Hospital Collection");
    var data = db.collection('hospital').find().toArray().then(result => res.json(result));
});
//get ventilator details
app.get('/ventilatordetails', middleware.checkToken, (req, res) => 
{
    console.log("Ventilators Information");
    var ventilatordetails = db.collection('ventilator').find().toArray().then(result => res.json(result));
});
//search vent by status
app.post('/searchventbystatus',middleware.checkToken, (req, res) =>
{
    var status = req.body.status;
    console.log(status);
    var ventilatordetails = db.collection('ventilator').find({ "status" : status}).toArray().then(result => res.json(result));
});
//search vent by name
app.post('/searchventbyname', middleware.checkToken, (req, res) => 
{
    var name = req.query.name;
    console.log(name);
    var ventilatordetails = db.collection('ventilator').find({'name' : new RegExp(name, 'i')}).toArray().then(result => res.json(result));
});
//update ventilator details
app.put('/updateventilator', middleware.checkToken, (req, res) => 
{
    var ventid = {ventilatorid : req.body.ventilatorid};
    console.log(ventid);
    var newvalues = { $set : {status : req.body.status}};
    db.collection("ventilator").updateOne(ventid, newvalues, function (err, result) 
    {
        res.json('1 document updated');
        if(err)
            throw err;
    });
});

//add new ventilator
app.post('/addventilatorbyuser', middleware.checkToken, (req,res) =>
{
    var hid = req.body.hid;
    var ventilatorid = req.body.ventilatorid;
    var status = req.body.status;
    var name = req.body.name;
    var item = 
    {
        hid : hid, ventilatorid : ventilatorid, status : status, name : name
    }; 
    db.collection('ventilator').insertOne(item, function(err, result) {
        if(err)
            throw err;
        res.json('Item inserted');
    });
}); 

//delete existing ventilator
app.delete('/delete', middleware.checkToken, (req, res) => 
{
    var myquery = req.query.ventilatorid;
    console.log(myquery);

    var myquery1 = {ventilatorid : myquery};
    db.collection('ventilator').deleteOne(myquery1, function(err, obj)
    {
        if(err) 
            throw err;
        res.json("1 document deleted");
    });
});

app.listen(4269);