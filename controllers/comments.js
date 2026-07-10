const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
  const { id, taskId } = req.params;
  const { body } = req.body.comment;

  const comment = new Comment({
    body,
    author: req.user._id,
    task: taskId,
  });

  await comment.save();
  req.flash("success", "Comment created successfully!");
  res.redirect(`/projects/${id}/tasks/${taskId}`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, taskId, commentId } = req.params;

  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Comment deleted successfully!");
  res.redirect(`/projects/${id}/tasks/${taskId}`);
};
