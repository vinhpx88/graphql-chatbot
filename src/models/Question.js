import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
