const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpsgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnSimple").collection("products");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product);
        productsCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    app.get('/products', (req, res) => {
        // console.log('Working');
        productsCollection.find({}).limit(20)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    const ordersCollection = client.db("emaJohnSimple").collection("orders");

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(product);
        ordersCollection.insertOne(order)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })
});


// console.log(process.env.DB_USER);

app.get('/', (req, res) => {
    res.send('Hello World! Jin');
})

app.listen(process.env.PORT || port);