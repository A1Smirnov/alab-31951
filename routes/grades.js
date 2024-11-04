import express from 'express';
import Grade from '../models/Grade.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const grades = await Grade.find();
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
});

router.get("/student/:id", (req, res) => {
  res.redirect(`../learner/${req.params.id}`);
});

router.get('/learner/:id', async (req, res, next) => {
  try {
    const query = { learner_id: req.params.id };
    if (req.query.class) {
      query.class_id = req.query.class;
    }
    const grades = await Grade.find(query);
    if (!grades) return res.status(404).send("Not Found");
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
});

router.get('/class/:id', async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const grades = await Grade.find({ class_id: classId });
    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found for this class ID' });
    }
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/learner/:id/class/average", async (req, res, next) => {
  try {
    const grades = await Grade.find({ learner_id: req.params.id });
    const averages = grades.reduce((acc, grade) => {
      const sum = grade.scores.reduce((total, score) => total + score.score, 0);
      acc[grade.class_id] = sum / grade.scores.length;
      return acc;
    }, {});
    res.status(200).json(averages);
  } catch (err) {
    next(err);
  }
});

router.get("/learner/:id/average", async (req, res, next) => {
  try {
    const grades = await Grade.find({ learner_id: req.params.id });
    const totalScore = grades.reduce((acc, grade) => {
      return acc + grade.scores.reduce((sum, score) => sum + score.score, 0);
    }, 0);
    const scoreCount = grades.reduce((acc, grade) => acc + grade.scores.length, 0);
    const overallAverage = totalScore / scoreCount;
    res.status(200).send("Overall average: " + overallAverage);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newGrade = new Grade(req.body);
    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/add', async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Not Found");

    const existingScoreIndex = grade.scores.findIndex(score => score.type === req.body.type);
    if (existingScoreIndex >= 0) {
      grade.scores[existingScoreIndex].score = req.body.score;
    } else {
      grade.scores.push(req.body);
    }

    await grade.save();
    res.status(200).json(grade);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/remove', async (req, res, next) => {
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { $pull: { scores: req.body } },
      { new: true }
    );
    if (!updatedGrade) return res.status(404).send("Not Found");
    res.status(200).json(updatedGrade);
  } catch (err) {
    next(err);
  }
});

router.patch("/class/:id", async (req, res, next) => {
  try {
    const result = await Grade.updateMany(
      { class_id: req.params.id },
      { class_id: req.body.class_id }
    );
    if (!result.nModified) return res.status(404).send("Not Found");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    if (!deletedGrade) return res.status(404).send("Not Found");
    res.status(200).json(deletedGrade);
  } catch (err) {
    next(err);
  }
});

router.delete("/learner/:id", async (req, res, next) => {
  try {
    const result = await Grade.deleteMany({ learner_id: req.params.id });
    if (!result.deletedCount) return res.status(404).send("Not Found");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/class/:id", async (req, res, next) => {
  try {
    const result = await Grade.deleteMany({ class_id: req.params.id });
    if (!result.deletedCount) return res.status(404).send("Not Found");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Not Found");
    res.status(200).json(grade);
  } catch (err) {
    next(err);
  }
});

export default router;
