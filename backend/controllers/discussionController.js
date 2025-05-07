import {Discussion} from "../models/discussionModel.js";

export const createDiscussion = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const discussion = await Discussion.create({
      title,
      description,
      createdBy: req.id, // Make sure your auth middleware sets req.id
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error("Error creating discussion:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllDiscussions = async (req, res) => {
    try {
      const discussions = await Discussion.find()
        .populate("createdBy", "name")
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json(discussions);
    } catch (err) {
      console.error("Error fetching discussions:", err);
      res.status(500).json({ message: "Failed to fetch discussions" });
    }
  };


export const getDiscussionById = async (req, res) => {
    try {
      const { id } = req.params; // Extract the id from req.params
      console.log("Fetching discussion ID:", id); // Debugging line
  
      const discussion = await Discussion.findById(id)
        .populate("createdBy", "name")
        .populate("comments.commentedBy", "name");
  
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
  
      res.status(200).json(discussion);
    } catch (err) {
      console.error(err); // Log any errors
      res.status(500).json({ message: "Failed to fetch discussion" });
    }
  };
  
  // POST /api/v1/discussions/:id/comments
  export const addCommentToDiscussion = async (req, res) => {
    const { comment } = req.body;
  
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }
  
    try {
      const discussion = await Discussion.findById(req.params.id);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
  
      discussion.comments.push({
        text: comment,
        commentedBy: req.id, // comes from isAuthenticated middleware
        createdAt: new Date(),
      });
  
      await discussion.save();
  
      res.status(200).json({ message: "Comment added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to add comment" });
    }
  };

