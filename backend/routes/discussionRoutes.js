import express from "express";
import {
  addCommentToDiscussion,
  createDiscussion,
  getDiscussionById,
  getAllDiscussions,
} from "../controllers/discussionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createDiscussion);
router.get("/all", isAuthenticated, getAllDiscussions); // Updated route
router.get("/:id", isAuthenticated, getDiscussionById);
router.post("/:id/comments", isAuthenticated, addCommentToDiscussion);

export default router;