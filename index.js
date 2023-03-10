const express = require('express')
const app = express();  
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
// const redis=require("redis")
// const util=require("util")
// const admin = require("firebase-admin");
const ObjectId = require('mongodb').ObjectId;            //Instantiate an express app, the main work horse of this server
const port=process.env.PORT || 5000   

// const redisURL="redis://127.0.0.1:6379" 
// // const client =redis.createClient(redisURL)
// const client = redis.createClient({
//     legacyMode: true,
//     PORT: 5000
//   })
//   client.connect().catch(console.error)

// client.hSet=util.promisify(client.hSet)

// client.hGet=util.promisify(client.hGet)

app.use(cors());
app.use(express.json());

// client.connect().then(
//     console.log("connected")
// ).catch(err=>console.log(err))
// const Redis = require("ioredis")

// const redis = new Redis({})

// async function main() {
//   // Hash Set
//   const result = await redis.hset("person1-hash", "name", "jane")
//   console.log(result)
//   const result2 = await redis.hget("person1-hash", "name")
// console.log(result2)
// }

// app.get("/user", async (req,res)=>{
//     const{key}=req.body;
//     // const value=await client.get(key)
//     const result = await client.hGet("person1-hash", "name", "age")
//     console.log(result)
//     res.json(value)
   
   
// })

//Save the port number where your server will be listening

//Idiomatic expression in express to route and respond to a client request
// app.get('/', (req, res) => {       
//     res.send("hello");     
                                            
// });
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.send("user");      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});



const uri = `mongodb+srv://parking-lot:zMRSytRoK1wKcGRr@cluster0.kvzsn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err=>{
    const collection=client.db("parking_lot").collection("users")
    console.log('connected')

})

// console.log(client)
// async function verifyToken(req, res, next) {
//     if (req.headers?.authorization?.startsWith('Bearer ')) {
//         const token = req.headers.authorization.split(' ')[1];
//         console.log(token);
//         try {
//             const decodedUser = await admin.auth().verifyIdToken(token);
//             req.decodedEmail = decodedUser.email;
//         }
//         catch {

//         }
//     }
//     next();
// }

async function run() {
    try {
        await client.connect();
        const database = client.db('parking_lot');
        const usersCollection = database.collection('users');
        const locationCollection = database.collection('locations');
    
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email:email };
        const user = await usersCollection.findOne(query);
        res.send(user)
       
    })

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
        console.log(req.body)
    });

    // app.put('/users', async (req, res) => {
    //     const user = req.body;
    //     const filter = { email: user.email };
    //     const options = { upsert: true };
    //     const updateDoc = { $set: user };
    //     const result = await usersCollection.updateOne(filter, updateDoc, options);
    //     res.json(result);
    // })

    app.get('/users', async (req, res) => {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
        console.log(users)
    })
    app.get('/locations', async (req, res) => {
        const cursor = locationCollection.find({});
        const location = await cursor.toArray();
        res.send(location);
        // console.log(users)
    })
    app.get('/locations/:location', async (req, res) => {
       
        const location = req.params.location;
        const query = { location:location };
        const user = await locationCollection.findOne(query);
        res.send(user)
        // console.log(users)
    })
    app.post('/insert/newLocation', async (req, res) => {
        const location = req.body;
        const result = await locationCollection.insertOne(location);
        res.json(result);
        console.log(req.body)
    });
            app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })
    }
finally {
    // await client.close();
}
}

run().catch(err=>console.log(err));

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});