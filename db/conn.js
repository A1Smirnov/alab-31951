// ./db/conn.js

import "dotenv/config";
import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;

async function connectDB() {
  try {
    conn = await client.connect();
    console.log("Connected to Mongo");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectDB();

const db = client.db("sample_training");

export default db;
