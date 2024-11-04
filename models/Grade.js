// models/Grade.js
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  learner_id: {
    type: String, // Number?
    required: true
  },
  class_id: {
    type: String, // Number?
    required: true
  },
  scores: [
    {
      score: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  ]
});

// Export Grade
const Grade = mongoose.model('Grade', gradeSchema);
export default Grade;
