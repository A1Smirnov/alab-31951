import express from "express";
import Grade from "../models/Grade.js";

const router = express.Router();

// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  try {
    const result = await Grade.aggregate([
      { $match: { learner_id: Number(req.params.id) } },
      { $unwind: "$scores" },
      {
        $group: {
          _id: "$class_id",
          quiz: { $push: { $cond: [{ $eq: ["$scores.type", "quiz"] }, "$scores.score", "$$REMOVE"] } },
          exam: { $push: { $cond: [{ $eq: ["$scores.type", "exam"] }, "$scores.score", "$$REMOVE"] } },
          homework: { $push: { $cond: [{ $eq: ["$scores.type", "homework"] }, "$scores.score", "$$REMOVE"] } },
        },
      },
      {
        $project: {
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).send("Not found");
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error retrieving data: " + error.message);
  }
});

// GET average > 70%, and percentage of learners who got this mark and higher
router.get("/stats", async (req, res) => {
  try {
    const stats = await Grade.aggregate([
      { $addFields: { averageScore: { $avg: "$scores.score" } } },
      {
        $facet: {
          totalLearners: [{ $count: "total" }],
          above70Percent: [{ $match: { averageScore: { $gt: 70 } } }, { $count: "above70" }],
        },
      },
      {
        $project: {
          totalLearners: { $arrayElemAt: ["$totalLearners.total", 0] },
          above70Percent: { $arrayElemAt: ["$above70Percent.above70", 0] },
          percentageAbove70: {
            $multiply: [
              { $divide: [{ $arrayElemAt: ["$above70Percent.above70", 0] }, { $arrayElemAt: ["$totalLearners.total", 0] }] },
              100,
            ],
          },
        },
      },
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).send("Error calculating stats: " + error.message);
  }
});

// Route to get stats for a specific class by ID
router.get("/stats/:id", async (req, res) => {
  const classId = parseInt(req.params.id);
  try {
    const stats = await Grade.aggregate([
      { $match: { class_id: classId } },
      { $addFields: { averageScore: { $avg: "$scores.score" } } },
      {
        $facet: {
          totalLearners: [{ $count: "total" }],
          above70Percent: [{ $match: { averageScore: { $gt: 70 } } }, { $count: "above70" }],
        },
      },
      {
        $project: {
          totalLearners: { $arrayElemAt: ["$totalLearners.total", 0] },
          above70Percent: { $arrayElemAt: ["$above70Percent.above70", 0] },
          percentageAbove70: {
            $multiply: [
              { $divide: [{ $arrayElemAt: ["$above70Percent.above70", 0] }, { $arrayElemAt: ["$totalLearners.total", 0] }] },
              100,
            ],
          },
        },
      },
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).send(`Error calculating stats for class ID ${classId}: ${error.message}`);
  }
});

export default router;
