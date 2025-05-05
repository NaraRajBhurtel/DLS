import { ChatMessage } from "../models/chat.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


// export const getMessages = async (req, res) => {
//     try {
//       const { studentId } = req.params;
  
//       console.log("Received studentId:", studentId);
  
//       // Validate the studentId
//       if (!mongoose.Types.ObjectId.isValid(studentId)) {
//         return res.status(400).json({ message: "Invalid studentId" });
//       }
  
//       const studentObjectId = new mongoose.Types.ObjectId(studentId); // ✅ Define this
  
//       // Step 1: Find all courses the student is enrolled in
//       const courses = await Course.find({
//         enrolledStudents: studentObjectId,
//       }).populate("creator");
  
//       if (!courses || courses.length === 0) {
//         return res.status(404).json({ message: "No courses found for student" });
//       }
  
//       // Step 2: Filter by instructor — assuming all messages should come from the same instructor
//       const instructorId = courses[0].creator._id;
  
//       const filteredCourses = courses.filter(
//         (course) => course.creator._id.toString() === instructorId.toString()
//       );
  
//       const courseIds = filteredCourses.map((course) => course._id);
  
//       // Step 3: Fetch messages for the student and all these courses
//       const messages = await ChatMessage.find({
//         courseId: { $in: courseIds },
//         userId: studentObjectId,
//       })
//         .sort({ createdAt: 1 })
//         .populate("userId", "name")
//         .populate({
//           path: "courseId",
//           populate: {
//             path: "creator",
//             model: "User",
//             select: "name _id"
//           }
//         })
//         .lean();
//       // Step 4: Send to frontend
//       res.status(200).json({
//         messages,
//         instructorName: courses[0].creator.name,
//         instructorId,
//       });
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       res.status(500).json({ message: error.message });
//     }
//   };
  

// Send a new message

export const getMessages = async (req, res) => {
    try {
      const { studentId, courseId } = req.params;

      // console.log("Received studentId:", studentId);
      // console.log("Received courseId:", courseId);
  
      // Validate ObjectIds
    //   if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
    //     return res.status(400).json({ message: "Invalid studentId or courseId" });
    //   }
  
      // Fetch the course and populate the instructor (creator)
      const course = await Course.findById(courseId).populate("creator");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Check if student is enrolled
      if (!course.enrolledStudents.includes(studentId)) {
        return res.status(403).json({ message: "Student is not enrolled in this course" });
      }
  
      // Fetch only messages for this student and this course
      const messages = await ChatMessage.find({
        courseId: courseId,
        userId: studentId,
      })
        .sort({ createdAt: 1 })
        .populate("userId", "name")
        .populate("courseId", "title")
        .lean();
  
      const instructorName = course.creator?.name || "Instructor";
  
      res.status(200).json({
        messages,
        instructorName,
        instructorId: course.creator._id,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  

export const sendMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { content, from } = req.body;
    const userId = req.id; // Assuming `req.id` contains the authenticated user's ID

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled if sending message as a student
    if (from === "student" && !course.enrolledStudents.includes(userId)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Get sender's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the new chat message
    const newMessage = new ChatMessage({
      courseId,
      content,
      from,
      userId,
      senderName: user.name, // Attach the sender's name
    });

    // Save the message
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInstructorMessages = async (req, res) => {
    try {
      const instructorId = req.id;
  
      //  Get all courses created by this instructor
      const instructorCourses = await Course.find({ creator: instructorId }).select("_id");
  
      const courseIds = instructorCourses.map(course => course._id);
  
      //  Get all chat messages from those courses
      const messages = await ChatMessage.find({ courseId: { $in: courseIds } })
        .sort({ createdAt: 1 })
        .populate("userId", "name")  // Get sender's name
        .populate("courseId", "title")  // Optional: Include course title
        .lean();
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching instructor messages:", error);
      res.status(500).json({ message: "Failed to load messages." });
    }
  };


export const sendInstructorMessage = async (req, res) => {
    try {
      const { studentId, content, courseId } = req.body;
  
      console.log("Received courseId:", courseId);
  
      // Fetch the course
      const course = await Course.findById(courseId).populate("creator");
      if (!course) {
        console.error("Course not found with id:", courseId);
        return res.status(404).json({ message: "Course not found" });
      }
  
      console.log("Course creator (instructor):", course.creator);
  
      // Check if the student is enrolled
      if (!course.enrolledStudents.includes(studentId)) {
        return res.status(403).json({ message: "This student is not enrolled in the course" });
      }
  
      // Use the creator's (instructor's) name
      const instructorName = course.creator.name || "Instructor";
  
      // Create the chat message
      const newMessage = new ChatMessage({
        courseId,
        content,
        from: "instructor",
        userId: studentId,
        senderName: instructorName
      });
      console.log("Student ID:", studentId);
  
      await newMessage.save();
      res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      console.error("Error sending instructor message:", error);
      res.status(500).json({ message: error.message });
    }
  };




