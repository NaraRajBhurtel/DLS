// routes/liveMeetingRoutes.js
import express from "express";
import {
  createMeeting,
  getMeetingByCourse,
  requestToJoin,
  approveStudent,
  deleteMeeting,
} from "../controllers/liveMeetingController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createMeeting);
router.get("/course/:courseId", isAuthenticated, getMeetingByCourse);
router.delete('/meetings/:meetingId', isAuthenticated, deleteMeeting); 
router.post("/:meetingId/join-request", isAuthenticated, requestToJoin);
router.post("/:meetingId/approve", isAuthenticated, approveStudent);

export default router;