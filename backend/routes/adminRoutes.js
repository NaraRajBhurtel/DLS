import express from "express";
import {
    getAllUsers,
    deleteUser,
    promoteToInstructor,
    getAllCourses,
    getCourseEnrolledStudents,
    deleteCourse,
    getAllMeetings,
    deleteMeeting,
    getAdminStats,
    
} from "../controllers/adminController.js";
import  isAuthenticated  from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

//  Apply auth & admin check to all admin routes
router.use(isAuthenticated, isAdmin);

//  User Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/promote", promoteToInstructor);

//  Course Management
router.get("/courses", getAllCourses);
router.get("/courses/:id/enrolled", getCourseEnrolledStudents);
router.delete('/courses/:id', deleteCourse);

//  meetings
router.get('/meetings', getAllMeetings);
router.delete('/meetings/:id', deleteMeeting);

//  Dashboard Stats
router.get("/stats", getAdminStats);



export default router;
