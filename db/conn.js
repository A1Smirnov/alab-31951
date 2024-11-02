// ./db/conn.js

import "dotenv/config";
// import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// Importing Mongoose in project
// const mongoose = require('mongoose');

// Connect to MongoDB via Mongoose

const connectionString = process.env.ATLAS_URI || "";

// mongoose.connect('mongodb://localhost:3000/myDatabase', {

mongoose.connect(connectionString, {
  // Outdated commands for OLD env versions
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB via Mongoose`))
  .catch((err) => console.error(`Couldn't connect to MongoDB, because of: `, err));



// const client = new MongoClient(connectionString);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// let conn;

// Set validation rules in source code, also validation rules was set in MongoDB to "warn"
async function setValidationRules(db) {
  await db.command({
    collMod: "grades",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["class_id", "learner_id"],
        properties: {
          class_id: {
            bsonType: "int",
            minimum: 0,
            maximum: 300,
          },
          learner_id: {
            bsonType: "int",
            minimum: 0,
          },
        },
      },
    },
    validationAction: "warn",
  });
}

// async function connectDB() {
//   try {
//     conn = await client.connect();
//     console.log("Connected to Mongo");
    
//     const db = client.db("sample_training");
    
//     // Setting validation rules for collection grades
//     await setValidationRules(db);
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//   }
// }

// connectDB();

// const db = client.db("sample_training");

// export default db;

export default mongoose;
