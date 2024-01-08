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
        const portfolioCollection = curlCanvas.collection('portfolio')
        const barbersCollection = curlCanvas.collection('barbers')
        const usersCollection = curlCanvas.collection('users')
        const registeredCollection = curlCanvas.collection('registered')

        // users start
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const axistingUser = await usersCollection.findOne(query);
            if (axistingUser) {
                return res.send({ message: ' user already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })
        // users end
        // services start 
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req?.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })
        app.get('/servicesamount', async (req, res) => {
            const count = await servicesCollection.estimatedDocumentCount()
            res.send({ count })
        })
        // services end

        // feedback start
        app.get('/feedback', async (req, res) => {
            const result = await feedbackCollection.find().toArray();
            res.send(result)
        })
        // feedback end

        //portfolio Start
        app.get('/portfolio', async (req, res) => {
            const result = await portfolioCollection.find().toArray()
            res.send(result)
        })
        //portfolio end

        // barbers start
        app.get('/barbers', async (req, res) => {
            const result = await barbersCollection.find().toArray();
            res.send(result)
        })
        app.get('/barbers/:id', async (req, res) => {
            const query = {_id: new ObjectId(req?.params?.id)}
            const result = await barbersCollection.findOne(query);
            res.send(result)
        })
        // barbers end
        // registeredCollection start
        app.get('/register', async (req, res) => {
            const result = await registeredCollection.find().toArray()
            res.send(result)
        })
        app.post('/register', async (req, res) => {
            const registrationData = req.body;
            const query1 = {_id: new ObjectId(registrationData?.barberId)}
            const query2 = {_id: new ObjectId(registrationData?.serviceId)}
            console.log(registrationData, query1, query2);
            const updatedData1 = {
                $inc: {
                    workCompleted: 1 
                }
            }
            const updatedData2 = {
                $push: {
                    booked: registrationData?.serviceDate 
                }
            }
            const result1 = await  registeredCollection.insertOne(registrationData)
            const result2 = await barbersCollection.updateOne(query1, updatedData1)
            const result3 = await servicesCollection.updateOne(query2, updatedData2)
           
            res.send({result1, result2, result3})
        })
        // registeredCollection end
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