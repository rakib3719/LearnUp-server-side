const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use
(cors({

    origin:[
      'https://assinment-11-d0881.web.app', 
      'https://assinment-11-d0881.firebaseapp.com',
    ],
    credentials: true,

    
}))

// middleware



app.use(express.json())
app.use(cookieParser())

// verify Token

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).send({ message: 'unauthorized access' })
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.log(err)
          return res.status(401).send({ message: 'unauthorized access' })
        }
        console.log(decoded)
  
        req.user = decoded
        next()
      })
    }
  }


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ngsjczb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const examineCollection = client.db('learnUp').collection('examineeInfo')



    // jwt


    app.post('/jwt', async (req, res) => {
      const email = req.body;
      // console.log(email);
      const token = jwt.sign(email, process.env.TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' ? true : false,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })

    app.get('/logout', (req, res) => {
      res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 0,
        })
        .send({ success: true })
    })

    // jwt end

// examineeInfo


app.get('/giveMark', async(req, res)=>{


  const id = req.query.id;
  const query = {_id : new ObjectId(id)};
  const result = await examineCollection.findOne(query);
  res.send(result)
})

app.patch('/giveMark', async (req, res)=> {

const id = req.query.id;
const markDetails = req.body;

const filter = {_id : new ObjectId(id)};
const options = { upsert: true };
const updateDoc = {
  $set: {
    feedback: markDetails.feedback,
    obtainedMarks : markDetails.mark,
    status: 'completed.'
  },
};
const result = await examineCollection.updateOne(filter, updateDoc, options)
res.send(result)

})

// myaAttempted assignment

app.get('/myAssignment',verifyToken, async (req, res)=>{
const email = req.query.email;
if(req.user.email !== email){
  res.status(400).send('forbidden access')
  return;

}
const filter = {examineeEmail: email};
const result = await examineCollection.find(filter).toArray();
res.send(result)

})
app.get('/pending', async (req, res)=> {

    const query = {status: 'pending'};
    const result = await examineCollection.find(query).toArray();
    res.send(result)
})

app.post('/assSubmit', verifyToken, async (req, res)=>{

const examineeDetails = req.body;
const email = examineeDetails.examineeEmail;

if(req.user.email !== email ){

    res.status(400).send('forbidden access')
    return;
}

const result = await examineCollection.insertOne(examineeDetails)
res.send(result)

})



    // assinmentCollection

 
    app.get('/assignment', async(req, res)=>{

  
      const Filterlevel = req.query.level;
      let query = {}
      if(Filterlevel){
        query = {level : Filterlevel}
      }
const result = await assinmentCollection.find(query).toArray();
res.send(result)

    })
app.post('/createAss',verifyToken, async(req, res)=>{

const assinmentInfo = req.body;
const result = await assinmentCollection.insertOne(assinmentInfo);
res.send(result)


})


app.get('/details', verifyToken, async(req, res)=>{

    const id = req.query.id;
    const query = {_id : new ObjectId(id)};
    const result = await assinmentCollection.findOne(query);
    res.send(result)
    
    })

app.get('/update', async(req, res)=>{

const id = req.query.id;
const query = {_id : new ObjectId(id)};
const result = await assinmentCollection.findOne(query);
res.send(result)

})
app.put('/update', async(req, res)=>{

const previousData = req.body;
const id =  req.query.id;

const filter = {_id: new ObjectId(id)}
const updatedData = {

  $set:{


    date: previousData.date,
    description: previousData.description,
    level: previousData.level,
    mark: previousData.mark,
    thumb_img: previousData.thumb_img,
    title: previousData.title
  },
}

const result = await assinmentCollection.updateOne(filter, updatedData);
res.send(result)


})
app.delete('/delete', verifyToken, async(req, res)=>{

const id = req.query.id;
const email = req.query.email;
if(req.user.email !== email){
    res.status(400).send('forbidden access')
    return;
}
const query = {_id: new ObjectId(id)};
const result =await assinmentCollection.deleteOne(query);
res.send(result);


})

    // await client.db("admin").command({ ping: 1 });
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