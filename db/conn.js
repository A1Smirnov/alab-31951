import "dotenv/config";
import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

mongoose.connect(connectionString, {})
  .then(() => console.log("Connected to MongoDB via Mongoose"))
  .catch((err) => console.error("Couldn't connect to MongoDB: ", err));

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

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

export default mongoose;
