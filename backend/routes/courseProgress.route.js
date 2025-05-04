import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCourseProgress, getQuizzesByCourseId, markAsCompleted, markAsInCompleted, reviewQuizAttempt, submitQuizAttempt, updateLectureProgress } from "../controllers/courseProgress.controller.js";

const router = express.Router()

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, markAsInCompleted);
router.route("/:courseId/quiz/:quizId/submit").post(isAuthenticated, submitQuizAttempt); // Submit quiz attempt
router.route("/:courseId/quiz/:quizId/review").get(isAuthenticated, reviewQuizAttempt); // Review quiz attempt
router.route("/:courseId/quizzes").get(isAuthenticated, getQuizzesByCourseId); // New route for getting quiz by id


export default router;