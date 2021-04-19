const express = require('express');
require('dotenv').config();
const port = 5000;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
// console.log(DB_NAME);
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.migjl.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;


const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Welcome To Travel Solution!!!");
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
    // Current version -> real project
    
    const allServiceCollection = client.db(DB_NAME).collection('All_Services');
    const clientServicesCollection = client.db(DB_NAME).collection("Client_Services");
    const clientReviewsCollection = client.db(DB_NAME).collection("Client_Reviews");
    const adminEmailCollection = client.db(DB_NAME).collection('Admin_Email');
    
    // perform actions on the collection object
    console.log("Mongo Connected");
    // Admin Panel
    app.get('/all-user-services', (req, res) =>{
      clientServicesCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

    app.post('/update-status/:id',(req, res)=>{
        const id = req.params.id;
        const status = req.body.status;
        // console.log(id, " -> " + status);
        
        clientServicesCollection.updateOne({_id: ObjectId(id)}, {
          $set: { status }
        })
        .then(result => {
          // console.log(result.modifiedCount);
          res.send(result);
        })
    })
    
    app.post('/addService', (req, res) =>{
        const serviceData = req.body;
        // console.log(serviceData);
        allServiceCollection.insertOne(serviceData)
        .then(data => res.send(data.ops[0]))
        .catch(err => console.log(err))
    })

    app.get('/services', (req, res) =>{
      // console.log(204)
        allServiceCollection.find({})
        .toArray( (err, documents) =>{
            // console.log(documents)
            res.send(documents);
        })
    })
    
    app.get("/delete-service/:id", (req,res) =>{
      const id = req.params.id;
      // console.log(id);
      allServiceCollection.deleteOne({_id: ObjectId(id)})
      .then(document => {
          // console.log(document);
          res.send(document);
      })
    })

    app.get('/admin-email/:email', (req, res)=>{
      const email = req.params.email;
      adminEmailCollection.insertOne({email})
      .then(data => {
        // console.log(data.ops[0]);
        res.send(data.ops[0]);
      })
      .catch(err => console.log(err))
    })

    app.get('/find-admins', (req, res) =>{
      // console.log(email);
      adminEmailCollection.find({})
      .toArray((err, documents) => {
        // console.log(documents);
        res.send(documents);
      })
    
    })
    // Client performs
    app.post('/review', (req, res) =>{
      const reviewData = req.body;
      // console.log(reviewData);
      clientReviewsCollection.insertOne(reviewData)
      .then(data => {
        // console.log(data.ops[0]);
        res.send(data.ops[0]);
      })
      .catch(err => console.log(err))

    })
    app.get("/all-reviews", (req, res) =>{
      clientReviewsCollection.find({})
      .toArray((err, documents) =>{
        res.send(documents);
      })
    })
    app.get("/client-one-service/:id", (req, res) =>{
      const id = req.params.id;
      // console.log(id);
      allServiceCollection.findOne({_id: ObjectId(id)})
      .then(data => {
          // console.log(data);
          res.send(data);
      })
    })

    app.post('/client-services', (req, res) =>{
      const clientData = req.body;
      // console.log(clientData);
      clientServicesCollection.insertOne(clientData)
      .then(data => {
        // console.log(data.ops[0]);
        res.send(data.ops[0]);
      })
      .catch(err => console.log(err))
    })

    app.get('/client-all-services', (req, res) =>{
      const email = req.query.email;
      // console.log(email);
      clientServicesCollection.find({email})
      .toArray((err, documents) =>{
        // console.log(documents)
        res.send(documents);
      })
    })
  //   client.close();
});


app.listen(process.env.PORT || port)