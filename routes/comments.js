const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateComment,
  isLoggedIn,
  isCommentAuthorOrProjectOwner,
  isProjectParticipant,
} = require("../middleware");
const comments = require("../controllers/comments");

router.post(
  "/",
  isLoggedIn,
  isProjectParticipant,
  validateComment,
  comments.createComment,
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthorOrProjectOwner,
  comments.deleteComment,
);

module.exports = router;
