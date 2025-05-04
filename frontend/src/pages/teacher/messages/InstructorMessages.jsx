import React, { useState, useEffect, useRef } from "react";
import {
  useGetInstructorMessagesQuery,
  useSendInstructorMessageMutation,
} from "../../../../features/api/chatApi";
import { Button } from "@/components/ui/button";

const InstructorMessages = () => {
  const { data, isLoading, isError, refetch } = useGetInstructorMessagesQuery();
  const [sendInstructorMessage, { isLoading: isSending, isSuccess, isError: sendError }] =
    useSendInstructorMessageMutation();

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // Added state for courseId
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  const messages = data?.messages || [];

  const groupedMessages = {};
  messages.forEach((msg) => {
    const key = msg.userId._id;
    if (!groupedMessages[key]) {
      groupedMessages[key] = {
        studentName: msg.userId.name,
        studentId: msg.userId._id,
        courseId: msg.courseId._id, 
        messages: [],
      };
    }
    groupedMessages[key].messages.push(msg);
  });

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStudentId || !selectedCourseId) return;
  
    console.log("Sending message to courseId:", selectedCourseId);  // Log courseId
  
    try {
        await sendInstructorMessage({
            studentId: selectedStudentId,
            courseId: groupedMessages[selectedStudentId].courseId, // Ensure this is correct
            content: message.trim(),
          }).unwrap();
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      setSelectedCourseId(groupedMessages[selectedStudentId]?.courseId); // Set courseId when a student is selected
    }
  }, [selectedStudentId]);

  // Refetch the messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Trigger the refetch function from the hook
    }, 3000);

    return () => clearInterval(interval); // Clear the interval on cleanup
  }, [refetch]);

  if (isLoading) return <div>Loading messages...</div>;
  if (isError) return <div>Error loading messages.</div>;
  if (messages.length === 0) return <p>No messages yet.</p>;

  return (
    <div className="flex h-[85vh] p-4 border rounded-lg shadow-md bg-white">
      {/* Student List */}
      <div className="w-1/3 pr-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Students</h2>
        <div className="space-y-2">
          {Object.entries(groupedMessages).map(([key, group]) => (
            <div
              key={key}
              onClick={() => setSelectedStudentId(group.studentId)}
              className={`cursor-pointer p-3 rounded-lg shadow-sm border transition ${
                selectedStudentId === group.studentId
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{group.studentName}</div>
              <div className="text-sm text-gray-600 truncate">
                {group.messages[group.messages.length - 1]?.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 pl-4 flex flex-col justify-between">
        {selectedStudentId ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Chat with {groupedMessages[selectedStudentId].studentName}
              </h3>
              <div className="overflow-y-auto max-h-[60vh] pr-2">
                {groupedMessages[selectedStudentId].messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.from === "student" ? "justify-start" : "justify-end"
                    } mb-2`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] shadow ${
                        msg.from === "student"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <div>{msg.content}</div>
                      <div className="text-[10px] mt-1 text-gray-300 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  className="w-full p-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim()}
                  className="rounded-full"
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>

              {isSuccess && (
                <p className="text-green-500 mt-2 text-sm">Message sent!</p>
              )}
              {sendError && (
                <p className="text-red-500 mt-2 text-sm">
                  Error sending message.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a student to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMessages;
