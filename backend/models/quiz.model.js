import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
});

const quizSchema = new mongoose.Schema(
  {
    quizTitle: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
    correctAnswers: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);