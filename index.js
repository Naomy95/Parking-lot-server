const express = require('express'); //Import the express dependency
const app = express();  
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
// const admin = require("firebase-admin");
const ObjectId = require('mongodb').ObjectId;            //Instantiate an express app, the main work horse of this server
const port=process.env.PORT || 5000   



app.use(cors());
app.use(express.json());


//Save the port number where your server will be listening

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.send("user");      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});



const uri = `mongodb+srv://parking-lot:zMRSytRoK1wKcGRr@cluster0.kvzsn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err=>{
//     const collection=client.db("demo").collection("demo")
//     console.log('connected')

// })

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
    
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
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
    }
finally {
    // await client.close();
}
}

run().catch(err=>console.log(err));

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});