import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  zegoRoomId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  meetingType: {
    type: String,
    enum: ["now", "scheduled"],
    required: true,
  },
  status: {
    type: String,
    enum: ["live", "scheduled", "ended"],
    default: "scheduled",
  },
  instructorToken: {
    type: String,
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
