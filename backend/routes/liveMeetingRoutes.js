import express from "express";
import {
  createMeeting,
  getMeetingByCourse,
  deleteMeeting,
  startMeeting,
  getMeetingForStudent, // updated to handle student's direct joining
} from "../controllers/liveMeetingController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// INSTRUCTOR
router.post("/create", isAuthenticated, createMeeting);
router.get("/course/:courseId", isAuthenticated, getMeetingByCourse);
router.delete("/meetings/:meetingId", isAuthenticated, deleteMeeting);
router.put("/meetings/:meetingId/start", isAuthenticated, startMeeting);

// STUDENT - Retrieve meeting and join directly
router.get("/course/:courseId/meeting", isAuthenticated, getMeetingForStudent);  // updated route for student to get meeting and join directly

export default router;



