const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const app = express();



app.use(cors({

    origin:['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
    
}))

app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res)=>{

    res.send('assinment 11 serverside ready to work')
})

app.post('/jwt', (req, res)=>{

const user = req.body;
const token = jwt.sign(user, )

})
app.listen(port, ()=>{

console.log(`this port is ${port}`);

})