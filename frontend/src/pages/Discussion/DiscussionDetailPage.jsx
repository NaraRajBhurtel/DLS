import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDiscussionByIdQuery, useAddCommentMutation } from "../../../features/api/discussionApi";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const DiscussionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For back button navigation
  const { user } = useSelector((state) => state.auth);

  const { data: discussion, isLoading, isError, refetch } = useGetDiscussionByIdQuery(id);
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
  const [newComment, setNewComment] = useState("");

  // Refetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [refetch]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return toast.warning("Comment cannot be empty.");

    try {
      await addComment({ id, comment: newComment }).unwrap();
      toast.success("Comment added!");
      setNewComment("");
      refetch();
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading discussion...</p>;
  if (isError) return <p className="text-center mt-10">Failed to load discussion.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back Button */}
      <Button variant = "outline:default"
        onClick={() => navigate("/discussion")}
        className="mb-6 text-sm text-gray-600 dark:text-gray-300 flex items-center"
      >
        ← Back to Discussions
      </Button>

      <h1 className="text-3xl font-bold">{discussion.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mt-4">{discussion.description}</p>
      <p className="text-sm text-gray-400 mt-2">
        Created by {discussion.createdBy?.name || "Unknown"} on{" "}
        {new Date(discussion.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Discussion Comments</h2>

        <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-inner p-4 max-h-[400px] overflow-y-auto space-y-6 border">
          {discussion.comments?.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            discussion.comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {comment.commentedBy?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* Message bubble */}
                <div className="bg-gray-100 dark:bg-[#1e293b] p-4 rounded-2xl max-w-3xl w-full shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.commentedBy?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Comment */}
      {user && (
        <div className="mt-8">
          <Textarea
            rows={4}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full mb-3"
          />
          <Button onClick={handleCommentSubmit} disabled={isCommenting}>
            {isCommenting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscussionDetailPage;
