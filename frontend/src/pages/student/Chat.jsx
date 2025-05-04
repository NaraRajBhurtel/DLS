import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetChatMessagesQuery, useSendMessageMutation } from "../../../features/api/chatApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Chat = ({ onClose }) => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id;

  // Fetch the messages for the course and student with polling enabled (every 3000 ms)
  const { data, isLoading, isError, refetch } = useGetChatMessagesQuery(
    { courseId, studentId: user._id },
    {
      pollingInterval: 3000, // Refetch every 3 seconds
    }
  );
  
  const [sendMessage] = useSendMessageMutation();
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null);

  const [filteredMessages, setFilteredMessages] = useState([]);
  const [instructorName, setInstructorName] = useState("");

  useEffect(() => {
    if (data?.messages?.length > 0 && courseId) {
      console.log("Messages Data:", data);
      console.log("Selected Course ID:", courseId);

      // Step 1: Filter messages that belong to this course
      const courseMessages = data.messages.filter((msg) => {
        const msgCourseId = typeof msg.courseId === "object" ? msg.courseId?._id : msg.courseId;
        return msgCourseId === courseId;
      });

      console.log("Filtered Course Messages:", courseMessages);

      // Step 2: Try getting the instructor ID from first courseMessage that has full data
      const validCourseMsg = courseMessages.find(msg => typeof msg.courseId === "object" && msg.courseId?.creator?._id);
      const instructorId = validCourseMsg?.courseId?.creator?._id || data?.instructorId || null;

      console.log("Instructor ID:", instructorId);

      // Step 3: Try grouping all messages from that instructor
      const groupedMessages = data.messages.filter((msg) => {
        const creatorId = typeof msg.courseId === "object" ? msg.courseId?.creator?._id : null;
        return creatorId === instructorId;
      });

      console.log("Grouped Messages by Instructor:", groupedMessages);

      // Step 4: Use groupedMessages if valid, else fallback to course-specific
      const finalMessages = groupedMessages.length > 0 ? groupedMessages : courseMessages;

      setFilteredMessages(finalMessages);

      const instructorName = validCourseMsg?.courseId?.creator?.name || data?.instructorName || "Instructor";
      console.log("Instructor Name:", instructorName);
      setInstructorName(instructorName);
    } else {
      setFilteredMessages([]);
      setInstructorName("Instructor");
    }
  }, [data, courseId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage({ courseId, content: newMessage, from: "student", studentId });
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  if (isLoading) {
    return (
      <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col">
        <div className="p-3 border-b font-semibold text-gray-800">Loading...</div>
        <div className="flex-1 flex justify-center items-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col">
        <div className="p-3 border-b font-semibold text-gray-800">Error loading messages.</div>
        <div className="flex-1 flex justify-center items-center text-red-500">Error loading messages.</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col">
      <div className="p-3 border-b font-semibold text-gray-800 flex justify-between items-center">
        Chat with {instructorName}
        <Button size="sm" onClick={onClose} variant="ghost">X</Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm" ref={messagesContainerRef}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.from === "student" ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] text-gray-400 mb-1">{msg.senderName}</span>
              <div
                className={`inline-block px-3 py-2 rounded-xl break-words text-sm leading-relaxed max-w-[75%] ${
                  msg.from === "student" ? "bg-black text-white" : "bg-gray-800 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center">No messages yet.</div>
        )}
      </div>

      <div className="flex border-t p-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} className="ml-2">Send</Button>
      </div>
    </div>
  );
};

export default Chat;
