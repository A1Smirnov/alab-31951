// ./routes/grades_agg.js

import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';

const router = express.Router();


/**
 * This file contains all aggregation routes in one place for educational purposes.
 */

/**
 * Grading Weights by Score Type:
 * - Exams: 50%
 * - Quizzes: 30%
 * - Homework: 20%
 */

// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      { $match: { learner_id: Number(req.params.id) } },
      { $unwind: { path: "$scores" } },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: [
                { $eq: ["$scores.type", "quiz"] },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
          exam: {
            $push: {
              $cond: [
                { $eq: ["$scores.type", "exam"] },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
          homework: {
            $push: {
              $cond: [
                { $eq: ["$scores.type", "homework"] },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
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
    ])
    .toArray();

  if (!result.length) res.status(404).send("Not found");
  else res.status(200).send(result);
});



// GET average > 70%, and percentage of learners who got this mark and higher
router.get("/stats", async (req, res) => {
  try {
    const stats = await db.collection("grades").aggregate([
      {
        $addFields: {
          averageScore: {
            $avg: "$scores.score",
          },
        },
      },
      {
        $facet: {
          totalLearners: [{ $count: "total" }],
          above70Percent: [
            { $match: { averageScore: { $gt: 70 } } },
            { $count: "above70" },
          ],
        },
      },
      {
        $project: {
          totalLearners: { $arrayElemAt: ["$totalLearners.total", 0] },
          above70Percent: { $arrayElemAt: ["$above70Percent.above70", 0] },
          percentageAbove70: {
            $multiply: [
              {
                $divide: [
                  { $arrayElemAt: ["$above70Percent.above70", 0] },
                  { $arrayElemAt: ["$totalLearners.total", 0] },
                ],
              },
              100,
            ],
          },
        },
      },
    ]).toArray();

    res.json(stats[0]);
  } catch (error) {
    res.status(500).send("Error calculating stats: " + error.message);
  }
});

// GET stats for a specific class by ID
router.get("/grades/stats/:id", async (req, res) => {
  const classId = parseInt(req.params.id);
  try {
    const stats = await db.collection("grades").aggregate([
      { $match: { class_id: classId } },
      { $addFields: { averageScore: { $avg: "$scores.score" } } },
      {
        $facet: {
          totalLearners: [{ $count: "total" }],
          above70Percent: [
            { $match: { averageScore: { $gt: 70 } } },
            { $count: "above70" },
          ],
        },
      },
      {
        $project: {
          totalLearners: { $arrayElemAt: ["$totalLearners.total", 0] },
          above70Percent: { $arrayElemAt: ["$above70Percent.above70", 0] },
          percentageAbove70: {
            $multiply: [
              {
                $divide: [
                  { $arrayElemAt: ["$above70Percent.above70", 0] },
                  { $arrayElemAt: ["$totalLearners.total", 0] },
                ],
              },
              100,
            ],
          },
        },
      },
    ]).toArray();

    res.json(stats[0]);
  } catch (error) {
    res.status(500).send(`Error calculating stats for class ID ${classId}: ${error.message}`);
  }
});

export default router;
