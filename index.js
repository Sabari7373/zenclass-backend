const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = "mongodb+srv://sabariganesh7373:Sabari-capstone@cluster0.8dkwxcb.mongodb.net/?retryWrites=true&w=majority";
require('./config/db')


const leadsRoute = require('./routes/leadsRoute');// for leads
const { connection } = require("mongoose");
const { db } = require("./models/leads");

// Middleweare
app.use(express.json());

app.use(
  cors({
    orgin:"*",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
  })
)


app.use("api/leads", leadsRoute) // for leads


app.get('/', (req, res) => {
  res.send('hello world')
});

app.post("/login", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db("blog");

    const user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      res.status(200).json({
        message: "Successfully Logged In",
      });
    } else {
      res.status(401).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/service", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db("blog");
    let student = await db.collection("users").find().toArray();

    await connection.close();
    res.send(student);
  } catch (error) {
    console.log(error);
  }
});

// To Resister a new User
app.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");

    console.log(req.body);
    await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({
      message: "Successfully Registered",
    });
  } catch (error) {

    res.status(500).json({
      message: "something error",
    });
  }
});

// Create a new Query
app.post("/queries", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("student");
    await db.collection("queries").insertOne(req.body);

    await connection.close();
    res.json({
      message: "Successfully Request",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
});

app.delete('/servicereq/:id', async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    const deleteLead = await db.collection("request").findOneAndDelete({ _id: new mongodb.ObjectId(req.params.id) })
    await connection.close()
    res.status(200).json(deleteLead)
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
})
// Remove a Query
app.delete('/removequery/:id', async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("student");
    const deleteQuery = await db.collection("queries").findOneAndDelete({ _id: new mongodb.ObjectId(req.params.id) })
    await connection.close()
    res.status(200).json(deleteQuery)
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
})


app.get("/viewSingleRequest/:id", async function (req, res) {
  try {
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("blog")
    const listOfRequests = await db.collection("request").findOne({ _id: new mongodb.ObjectId(req.params.id) })
    await connection.close()
    res.status(200).json(listOfRequests)
  }
  catch (error) {
    res.status(400).json({ error: error.message })

  }
})

app.get("/getqueries", async function (req, res) {
  try {
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("student")
    const listOfQueries = await db.collection("queries").find().toArray()
    await connection.close()
    res.status(200).json(listOfQueries)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// For Getting requirements from Database
app.get("/viewRequirements", async function (req, res) {
  try {
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("student")
    const listOfRequirements = await db.collection("requirements").find().toArray()
    await connection.close()
    res.status(200).json(listOfRequirements)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// For Apply a JOB in Reqirements
app.post("/applyrequirements", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("student");
    await db.collection("requirements").insertOne(req.body);

    await connection.close();
    res.json({
      message: "Successfully Request",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
});


app.put('/editleads/:id', async function (req, res) {
  try {
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("blog")
    const EditLead = await db.collection("request").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: req.body.status })
    await connection.close()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/// just add a white after that must remove

app.put('/editleads/:id', async function (req, res) {
  try {
    const connection = await mongodb.MongoClient.connect(URL)
    const db = connection.db("blog")
    const EditLead = await db.collection("request").updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    await connection.close();
    res.status(200).json({ message: "Lead updated successfully" })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/register/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let student = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
  }
});

// For Post a Capstone Project
app.post('/capstone', async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("projects");
    await db.collection("capstone").insertOne(req.body);
    await connection.close();
    res.json({
      message: "Succesfully Submitted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Occurs"
    })
  }
})

// For Post a Webcode Projects
app.post('/webcode', async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("projects");
    await db.collection("webcode").insertOne(req.body);
    await connection.close();
    res.json({
      message: "Succesfully Submitted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Occurs"
    })
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log(" server running on port  3001");
}
);
