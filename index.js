const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1wea1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("red-onion");
    const foodCollection = database.collection("foods");
    const orderCollection = database.collection("orders");

    //get all foods
    app.get("/foods", async (req, res) => {
      const cursor = await foodCollection.find({}).toArray();
      res.json(cursor);
    });

    app.post("/orders", async (req, res) => {
      const food = req.body;
      const result = await orderCollection.insertOne(food);
      res.json(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const result = await orderCollection
        .find({ email: req.params.email.toString() })
        .toArray();
      res.json(result);
    });

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Red Onion");
});

app.listen(port, () => {
  console.log(`Find port:${port}`);
});
