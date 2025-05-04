// routes/chat.route.js
import express from "express";
import { getInstructorMessages, getMessages, sendInstructorMessage, sendMessage } from "../controllers/chat.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

// GET messages for a course
// router.get("/course/:courseId/messages", isAuthenticated, getMessages);
router.get("/course/:courseId/student/:studentId/messages", isAuthenticated, getMessages);

// POST a new message
router.post("/course/:courseId/send-message", isAuthenticated, sendMessage);

router.get("/instructor/messages", isAuthenticated, getInstructorMessages);

// router.post('/course/:courseId/student/:studentId/message', sendInstructorMessage);
// New route - Use req.body instead of URL params
router.post('/send-message', sendInstructorMessage);


export default router;



