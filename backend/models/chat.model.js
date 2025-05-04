import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Referencing the Course model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      enum: ["student", "instructor"], // Determines who sent the message
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // To track which user sent the message
      required: true,
    },
    senderName: {
      type: String, // Storing the name of the user
      required: true,
    },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);



