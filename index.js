const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()


const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbi4wg4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const curlCanvas = client.db('curlCanvas')
        const servicesCollection = curlCanvas.collection('services')
        const feedbackCollection = curlCanvas.collection('feedback')
        // services start 
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result)
        })
        app.get('/servicesamount', async (req, res) => {
            const count = await servicesCollection.estimatedDocumentCount()
            res.send({ count })
        })
        // services end

        // feedback start
        app.get('/feedback', async (req, res) => {
            const result  = await feedbackCollection.find().toArray();
            res.send(result)
        })
        // feedback end
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})