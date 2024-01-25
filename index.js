require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS);

//quickshipUser

//nw2J9VqXcQ8zWX1N
const uri = `mongodb+srv://quickshipUser:nw2J9VqXcQ8zWX1N@cluster0.dbdkno8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const pricingCollection = client.db("quickship").collection("pricing");

    const calculatorCollection = client.db("quickship").collection("calculator");

    //pricing collection
    // DB_USER=quickshipUser
    // DB_PASS=nw2J9VqXcQ8zWX1N
    app.get("/price-data", async (req, res) => {
      const result = await pricingCollection.find().toArray();
      res.send(result);
      console.log(result);
    });

    //pricing collection id
    app.get("/price-data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pricingCollection.findOne(query);
      res.send(result);
    });



    // Delivery Calculator get here
    app.get("/calculator", async(req, res) =>{
      const result = await calculatorCollection.find().toArray()
      res.send(result)
    })

    // Delivery Calculator post here
    app.post("/calculator", async (req, res) =>{
      const calculator = req.body
      calculator.time = new Date();
      // console.log(calculator);
      const result = await calculatorCollection.insertOne(calculator)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the quick-ship News Server!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
