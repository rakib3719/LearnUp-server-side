const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors({

    origin:['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
    
}))

app.use(express.json())
app.use(cookieParser())




const uri = `mongodb+srv://${process.env.user}:${process.env.PASSWORD}@cluster0.ngsjczb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const assinmentCollection = client.db('learnUp').collection('assignment')

app.post('/createAss', async(req, res)=>{

const assinmentInfo = req.body;
const result = await assinmentCollection.insertOne(assinmentInfo);
res.send(result)


})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{

    res.send('assinment 11 serverside ready to work')
})


app.listen(port, ()=>{

console.log(`this port is ${port}`);

})