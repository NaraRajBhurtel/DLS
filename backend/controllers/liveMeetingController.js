import dotenv from "dotenv";
dotenv.config();

import Meeting from "../models/Meeting.js";
import { generateZegoToken } from "../utils/zegoTokenGenerator.js";

// Create or schedule a meeting
export const createMeeting = async (req, res) => {
  try {
    const { courseId, zegoRoomId, startTime, meetingType } = req.body;
    
    // Use req.id instead of req.user._id or req.is for instructorId
    const instructorId = req.id;  // This assumes req.id contains the instructor's ID

    const instructorToken = generateZegoToken(
      parseInt(process.env.ZEGOCLOUD_APP_ID),
      process.env.ZEGOCLOUD_APP_SIGN,
      zegoRoomId,
      instructorId.toString()
    );

    const meeting = new Meeting({
      courseId,
      instructorId,
      zegoRoomId,
      startTime,
      meetingType,
      status: meetingType === "now" ? "live" : "scheduled",
      instructorToken,
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
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
  

// Student sends join request
export const requestToJoin = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const studentId = req.id;  // Assuming req.id contains the student ID

    const meeting = await Meeting.findById(meetingId);
    const alreadyRequested = meeting.joinRequests.some(
      (req) => req.studentId.toString() === studentId.toString()
    );

    if (!alreadyRequested) {
      meeting.joinRequests.push({ studentId });
      await meeting.save();
    }

    const studentToken = generateZegoToken(
      parseInt(process.env.ZEGOCLOUD_APP_ID),
      process.env.ZEGOCLOUD_APP_SIGN,
      meeting.zegoRoomId,
      studentId.toString()
    );

    res.status(200).json({
      message: "Join request sent",
      studentToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to send request", error: err.message });
  }
};

// Instructor approves student
export const approveStudent = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { studentId } = req.body;

    const meeting = await Meeting.findById(meetingId);

    const joinRequest = meeting.joinRequests.find(
      (req) => req.studentId.toString() === studentId
    );

    if (joinRequest) {
      joinRequest.status = "approved";

      if (!meeting.approvedStudents.includes(studentId)) {
        meeting.approvedStudents.push(studentId);
      }

      await meeting.save();

      const studentToken = generateZegoToken(
        parseInt(process.env.ZEGOCLOUD_APP_ID),
        process.env.ZEGOCLOUD_APP_SIGN,
        meeting.zegoRoomId,
        studentId.toString()
      );

      res.status(200).json({
        message: "Student approved",
        studentToken,
      });
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to approve student", error: err.message });
  }
};


