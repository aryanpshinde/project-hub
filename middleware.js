const Project = require("./models/project");
const {
  projectSchema,
  taskSchema,
  taskStatusSchema,
  commentSchema,
} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Task = require("./models/task");
const Comment = require("./models/comment");

module.exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isProjectOwner = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    req.flash("error", "Project not found!");
    return res.redirect("/projects");
  }

  if (!project.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/projects/${id}`);
  }
  next();
};

module.exports.isProjectParticipant = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    req.flash("error", "Project not found!");
    return res.redirect("/projects");
  }

  const isOwner = project.owner.equals(req.user._id);
  const isMember = project.members.some((memberId) =>
    memberId.equals(req.user._id),
  );

  if (!isOwner && !isMember) {
    req.flash("error", "You don't have permission to view this project!");
    return res.redirect("/projects");
  }

  next();
};

module.exports.isTaskEditor = async (req, res, next) => {
  const { id, taskId } = req.params;

  const task = await Task.findById(taskId);
  const project = await Project.findById(id);

  if (!task || !project) {
    req.flash("error", "Task or project not found!");
    return res.redirect(`/projects/${id}`);
  }

  const isCreator = task.createdBy.equals(req.user._id);
  const isOwner = project.owner.equals(req.user._id);
  const isAssignee = task.assignedTo && task.assignedTo.equals(req.user._id);

  if (!isCreator && !isOwner && !isAssignee) {
    req.flash("error", "You dont have permission to edit or delete this task!");
    return res.redirect(`/projects/${id}`);
  }
  next();
};

module.exports.validateTaskStatus = (req, res, next) => {
  const { error } = taskStatusSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isCommentAuthorOrProjectOwner = async (req, res, next) => {
  const { id, taskId, commentId } = req.params;

  const task = await Task.findById(taskId);
  const project = await Project.findById(id);

  if (!task || !project) {
    req.flash("error", "Task or project not found!");
    return res.redirect(`/projects/${id}`);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    req.flash("error", "Comment not found!");
    return res.redirect(`/projects/${id}`);
  }

  const isCommentAuthor = comment.author.equals(req.user._id);
  const isProjectOwner = project.owner.equals(req.user._id);

  if (!isCommentAuthor && !isProjectOwner) {
    req.flash("error", "You don't have permission to delete this comment!");
    return res.redirect(`/projects/${id}`);
  }

  next();
};
