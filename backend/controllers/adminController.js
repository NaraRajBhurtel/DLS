import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import Meeting from "../models/Meeting.js";
import { CoursePurchase } from "../models/coursePurchase.js";


//  Get all users (students + instructors)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }, "name email role createdAt");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

//  Delete a user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

//  Promote user to instructor
export const promoteToInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = "instructor";
        await user.save();
        res.status(200).json({ message: "User promoted to instructor" });
    } catch (error) {
        res.status(500).json({ message: "Error promoting user" });
    }
};

//  Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("creator", "name email role")
            .populate("enrolledStudents", "name email role");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses" });
    }
};

//  Get enrolled students in a specific course
export const getCourseEnrolledStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate(
            "enrolledStudents",
            "name email role"
        );
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ enrolledStudents: course.enrolledStudents });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving enrolled students" });
    }
};

// GET all meetings
export const getAllMeetings = async (req, res) => {
  try {
    console.log("Admin ID:", req.id); //  using authentication middleware
    console.log("Fetching all meetings...");

    const meetings = await Meeting.find().populate({
    path: 'courseId',
    select: 'courseTitle'  // get courseTitle from Course
  })
  .populate({
    path: 'instructorId',
    select: 'name'         // get instructor's name from Instructor
  });
    
    console.log("Meetings fetched:", meetings.length);

    res.status(200).json(meetings);
  } catch (error) {
    console.error(' Error fetching meetings:', error.message);
    res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
  }
};

// DELETE a meeting
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ message: 'Failed to delete meeting' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};




export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalRevenue = await CoursePurchase.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalMeetings = await Meeting.countDocuments();

    res.status(200).json({
      totalUsers,
      totalCourses,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalMeetings,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard analytics" });
  }
};


