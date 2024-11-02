// models/Grade.js
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  type: { type: String, required: true },
  score: { type: Number, required: true }
});

const gradeSchema = new mongoose.Schema({
  class_id: { type: Number, required: true },
  learner_id: { type: Number, required: true },
  scores: [scoreSchema],  // type и score
}, { collection: 'grades' });  // "grades"

const Grade = mongoose.model("Grade", gradeSchema);
export default Grade;
