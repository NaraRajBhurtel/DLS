import dotenv from "dotenv";
dotenv.config();
import { Course } from "../models/course.model.js";
import Meeting from "../models/Meeting.js";
import { generateZegoToken } from "../utils/zegoTokenGenerator.js";
import { sendScheduledMeetingEmail} from "../middlewares/Email.js" 


// // Create or schedule a meeting
export const createMeeting = async (req, res) => {
  console.log(" createMeeting controller triggered");

  try {
    const { courseId, zegoRoomId, startTime, meetingType } = req.body;
    const instructorId = req.id;

    console.log(" meetingType received:", meetingType);
    console.log(" courseId:", courseId);

    // Generate ZegoCloud token
    const instructorToken = generateZegoToken(
      parseInt(process.env.ZEGOCLOUD_APP_ID),
      process.env.ZEGOCLOUD_APP_SIGN,
      zegoRoomId,
      instructorId.toString()
    );

    // Create meeting document
    const meeting = new Meeting({
      courseId,
      instructorId,
      zegoRoomId,
      startTime,
      meetingType,
      status: meetingType === "live" ? "live" : "scheduled",
      instructorToken,
    });

    await meeting.save();
    console.log(" Meeting saved to DB:", meeting);

    // Fetch course and populate enrolled students
    const course = await Course.findById(courseId).populate("enrolledStudents", "email name");

    if (!course) {
      console.log(" Course not found with ID:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    console.log(" Course loaded:", course.courseTitle);
    console.log(" Enrolled students count:", course.enrolledStudents.length);

    // If scheduled meeting and there are students, send email
    if (meetingType === "scheduled" && course.enrolledStudents.length > 0) {
      console.log(" Sending scheduled meeting emails...");

      for (const student of course.enrolledStudents) {
        console.log(` Sending email to ${student.email} (${student.name})`);
        await sendScheduledMeetingEmail(
          student.email,
          student.name,
          course.courseTitle,
          startTime
        );
      }

      console.log(" All emails sent successfully.");

    } else {
      console.log(" No emails sent (either not scheduled or no students).");
    }
    
    res.status(201).json(meeting);
  } catch (err) {
    console.error(" Error in createMeeting:", err);
    res.status(500).json({ message: "Failed to create meeting", error: err.message });
  }
};



// Fetch meeting by course ID
export const getMeetingByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const meetings = await Meeting.find({
        courseId,
        status: { $in: ["live", "scheduled"] },
        startTime: { $gte: new Date() },
      }).sort({ startTime: 1 }); // Sort meetings by start time
  
      if (!meetings || meetings.length === 0) {
        return res.status(404).json({ message: "No meetings found" });
      }
  
      res.status(200).json(meetings);
    } catch (err) {
      res.status(500).json({ message: "Failed to get meetings", error: err.message });
    }
  };
  

export const deleteMeeting = async (req, res) => {
    try {
      const { meetingId } = req.params;
      const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);
  
      if (!deletedMeeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
  
      res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete the meeting", error: err.message });
    }
  };
  
  export const startMeeting = async (req, res) => {
    try {
      const { meetingId } = req.params;
  
      // Find the meeting by ID
      const meeting = await Meeting.findById(meetingId);
  
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
  
      // Check if the meeting is scheduled (we don't want to start an already live meeting)
      if (meeting.status === "live") {
        return res.status(400).json({ message: "Meeting is already live" });
      }
  
      // Update the status to 'live'
      meeting.status = "live";
      await meeting.save();
  
      res.status(200).json({ message: "Meeting started successfully", meeting });
    } catch (err) {
      res.status(500).json({ message: "Failed to start meeting", error: err.message });
    }
  };

// Fetch meeting for student with live class token
export const getMeetingForStudent = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the first upcoming or live meeting for the course
    const meetings = await Meeting.findOne({
      courseId,
      status: { $in: ["live", "scheduled"] }, // Include both live and scheduled meetings
      startTime: { $gte: new Date() },  // Ensuring the meeting is scheduled for the future
    }).sort({ startTime: 1 }); // Sort by start time to get the earliest meeting

    if (!meetings) {
      return res.status(404).json({ message: "No meeting found for this course." });
    }

    // Return the meeting details 
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to get the meeting", error: err.message });
  }
};