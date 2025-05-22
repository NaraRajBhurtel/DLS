import mongoose from "mongoose"

const quizAttemptSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    studentAnswers: [{ type: String }],  // Stores answer index for each question
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  });

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{type:String},
    viewed:{type:Boolean}
});

const courseProgressSchema = new mongoose.Schema({
    userId:{type:String},
    courseId:{type:String},
    completed:{type:Boolean},
    lectureProgress:[lectureProgressSchema],
    quizAttempts: [quizAttemptSchema]
});

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);