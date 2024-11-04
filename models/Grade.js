import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
}, { _id: false }); // Disable _id for subdocuments

const gradeSchema = new mongoose.Schema({
  learner_id: {
    type: Number, // Changed to Number
    required: true
  },
  class_id: {
    type: Number, // Changed to Number
    required: true
  },
  scores: [scoreSchema] // Use the scoreSchema for scores
});

// Export Grade and specify collection
const Grade = mongoose.model('Grade', gradeSchema, 'grades');
export default Grade;
