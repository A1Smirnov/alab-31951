// ./routes/grades.js

import express from 'express';

// !!! TURNING OFF DIRECT CONNECTION TO MONGO-DB

// import db from '../db/conn.js'
// import { ObjectId } from 'mongodb';


// Importing from Mongoose Model for Grade

//!!! Create model !!!!
import Grade from '../models/Grade.js';

const router = express.Router()
// base path: /grades

router.get('/', async (req, res, next) => {
  try {
    // let collection = db.collection("grades"); // Get the grades collection
    // let grades = await collection.find().toArray(); // Fetch all grades

    const grades = await Grade.find(); // Fetch all grades using Mongoose
    

    res.status(200).json(grades); // Send the grades as a JSON response
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Get a single grade entry
router.get('/:id', async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // const query = { _id: new ObjectId(req.params.id) }
    // let result = await collection.findOne(query);
    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Not Found");
    res.status(200).json(grade);
  } catch (err) {
    next(err) // the next function directs the err to the global error handling middleware
  }
});


// Backwards compatibility or students/learners
router.get("/student/:id", (req, res) => {
  res.redirect(`../learner/${req.params.id}`)
});

// Get a student's grade data
router.get('/learner/:id', async (req, res, next) => {
  try {
    // let collection = db.collection("grades")
    // let query = { learner_id: Number(req.params.id) }

    // if (req.query.class) {
    //   query.class_id = Number(req.query.class)
    // }

    // let result = await collection.find(query).toArray()

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const query = { learner_id: req.params.id };
    if (req.query.class) {
      query.class_id = req.query.class;
    }
    const grades = await Grade.find(query);
    if (!grades) return res.status(404).send("Not Found");
    res.status(200).json(grades);

  } catch (err) {
    next(err)
  }
});

// Get a class's grade data
router.get('/class/:id', async (req, res, next) => {
  try {
    // let collection = db.collection("grades")
    // let query = { class_id: Number(req.params.id) }

    // if (req.query.learner) {
    //   query.learner_id = Number(req.query.learner)
    // }

    // let result = await collection.find(query).toArray()

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const query = { class_id: req.params.id };
    if (req.query.learner) {
      query.learner_id = req.query.learner;
    }
    const grades = await Grade.find(query);
    if (!grades) return res.status(404).send("Not Found");
    res.status(200).json(grades);

  } catch (err) {
    next(err)
  }
});

// get learner average for EACH class
router.get("/learner/:id/class/average", async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let query = { learner_id: Number(req.params.id)}
    // let learnerGrades = await collection.find(query).toArray()

    // const averages = learnerGrades.reduce((acc, grade) => {
    //   let sum = 0;
    //   for (let i = 0; i < grade.scores.length; i++) {
    //     if (typeof grade.scores[i].score === 'number') {
    //       sum += grade.scores[i].score        }
    //   }
    //   acc[grade.class_id] = sum / grade.scores.length
    //   return acc
    // }, {})

    // res.send(averages).status(200)

    const grades = await Grade.find({ learner_id: req.params.id });
    const averages = grades.reduce((acc, grade) => {
      const sum = grade.scores.reduce((total, score) => total + score.score, 0);
      acc[grade.class_id] = sum / grade.scores.length;
      return acc;
    }, {});
    res.status(200).json(averages);

  } catch (err) {
    next(err)
  }
});



// to get overall average of a learner
router.get("/learner/:id/average", async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let query = { learner_id: Number(req.params.id)}
    // let learnerGrades = await collection.find(query).toArray()
    // let sum = 0;
    // let scoreCount = 0
    // for (let i = 0; i < learnerGrades.length; i++) {
    //   for (let j = 0; j < learnerGrades[i].scores.length; j++) {
    //     if (typeof learnerGrades[i].scores[j].score === 'number') {
    //       sum += learnerGrades[i].scores[j].score
    //     }
    //     scoreCount++
    //   }
    // }

    // const overallScore = sum / scoreCount

    // res.send("Over average: " + overallScore).status(200)

    const grades = await Grade.find({ learner_id: req.params.id });
    const totalScore = grades.reduce((acc, grade) => {
      return acc + grade.scores.reduce((sum, score) => sum + score.score, 0);
    }, 0);
    const scoreCount = grades.reduce((acc, grade) => acc + grade.scores.length, 0);
    const overallAverage = totalScore / scoreCount;
    res.status(200).send("Overall average: " + overallAverage);

  } catch (err) {
    next(err)
  }
})


// Create a single grade entry
router.post('/', async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let newDocument = req.body

    // if (newDocument.student_id) {
    //   newDocument.learner_id = newDocument.student_id;
    //   delete newDocument.student_id
    // }

    // let result = await collection.insertOne(newDocument)
    // res.send(result).status(201)

    const newGrade = new Grade(req.body);
    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);

  } catch (err) {
    next(err)
  }
})


// Add a score to a grade entry
router.patch('/:id/add', async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let query = { _id: new ObjectId(req.params.id) };

    // let result = await collection.updateOne(query, {
    //   $push: { scores: req.body }
    // })

    // if (!result) res.status(404).send("Not Found");
    // else res.status(200).send(result);

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { $push: { scores: req.body } },
      { new: true }
    );
    if (!updatedGrade) return res.status(404).send("Not Found");
    res.status(200).json(updatedGrade);

  } catch (err) {
    next(err)
  }
})

// Remove a score from a grade entry
router.patch('/:id/remove', async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let query = { _id: ObjectId.createFromHexString(req.params.id) }

    // let result = await collection.updateOne(query, {
    //   $pull: { scores: req.body }
    // })

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { $pull: { scores: req.body } },
      { new: true }
    );
    if (!updatedGrade) return res.status(404).send("Not Found");
    res.status(200).json(updatedGrade);

  } catch (err) {
    next(err)
  }
})

// Extra Route to combine the two above Add/Remove
// router.patch('/:id/:operation', async (req, res, next) => {
//   try {
//     let collection = db.collection("grades");
//     let query = { _id: ObjectId.createFromHexString(req.params.id) }
//     let update = {};

//     if (req.params.operation === "add") {
//       update["$push"] = { scores: req.body }
//     } else if (req.params.operation === "remove") {
//       update["$pull"] = { scores: req.body }
//     } else {
//       res.status(400).send("Invalid Operation")
//       return
//     }

//     let result = await collection.updateOne(query, update)

//     if (!result) res.send("Not Found").status(404)
//     else res.send(result).status(200)
//   } catch (err) {
//     next(err)
//   }
// // })

router.patch("/class/:id", async (req, res, next) => {
  try {
    // let collection = db.collection("grades")
    // let query = { class_id: Number(req.params.id)}

    // let result = await collection.updateMany(query, {
    //   $set: {class_id: req.body.class_id}
    // })

    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);

    const result = await Grade.updateMany(
      { class_id: req.params.id },
      { class_id: req.body.class_id }
    );
    if (!result.nModified) return res.status(404).send("Not Found");
    res.status(200).json(result);

  } catch (err) {
    next(err)
  }
})




router.delete("/:id", async (req, res, next) => {
  try {
    // let collection = db.collection("grades");
    // let query = { _id: ObjectId.createFromHexString(req.params.id) }
    // let result = await collection.deleteOne(query)

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    if (!deletedGrade) return res.status(404).send("Not Found");
    res.status(200).json(deletedGrade);

  } catch (err) {
    next(err)
  }
})
// Delete ALL learner's grade entries
router.delete("/learner/:id", async (req, res, next) => {
  try {
    // let collection = db.collection("grades")
    // let query = { learner_id: Number(req.params.id)}

    // let result = await collection.deleteMany(query)

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const result = await Grade.deleteMany({ learner_id: req.params.id });
    if (!result.deletedCount) return res.status(404).send("Not Found");
    res.status(200).json(result);

  } catch (err) {
    next(err)
  }
})

// Delete ALL class's grade entries
router.delete("/class/:id", async (req, res, next) => {
  try {
    // let collection = db.collection("grades")
    // let query = { class_id: Number(req.params.id)}

    // let result = await collection.deleteMany(query)

    // if (!result) res.send("Not Found").status(404)
    // else res.send(result).status(200)

    const result = await Grade.deleteMany({ class_id: req.params.id });
    if (!result.deletedCount) return res.status(404).send("Not Found");
    res.status(200).json(result);

  } catch (err) {
    next(err)
  }
})



// TESTING

// router.get('/grades/:id', async (req, res, next) => {
//   const { id } = req.params;
//   console.log("Received ID:", id);  // Выводит значение id в консоль
//   if (!ObjectId.isValid(id)) {
//       return res.status(400).send('Invalid ID format');
//   }

//   try {
//       const grade = await gradesCollection.findOne({ _id: new ObjectId(id) });
//       if (!grade) {
//           return res.status(404).send('Grade not found');
//       }
//       res.json(grade);
//   } catch (error) {
//       next(error);
//   }
// });


export default router