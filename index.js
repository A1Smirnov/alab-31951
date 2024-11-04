// index.js

import express from "express";
import "dotenv/config";
import gradesRoutes from "./routes/grades_agg.js";
import grades from "./routes/grades.js";
import "./db/conn.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Body parser middleware
app.use(express.json());

// Test db connection
// import "./db/conn.js";

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Mount the routes
app.use("/grades", grades);
app.use("/grades", gradesRoutes);



// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
