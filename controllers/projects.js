const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports.index = async (req, res) => {
  const { role, status } = req.query;

  const filter = { $or: [{ owner: req.user._id }, { members: req.user._id }] };

  if (role === "owned") {
    filter.owner = req.user._id;
    delete filter.$or;
  } else if (role === "shared") {
    filter.members = req.user._id;
    delete filter.$or;
  }

  if (status && ["active", "completed", "archived"].includes(status)) {
    filter.status = status;
  }

  const projects = await Project.find(filter)
    .populate("owner")
    .populate("members");

  res.render("projects/index", {
    projects,
    title: "Projects",
    query: req.query,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("projects/new", { title: "Create Project" });
};

module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  project.owner = req.user._id;
  await project.save();
  req.flash("success", "Project created successfully!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner")
    .populate("members");

  const { taskStatus, priority, assignedTo, sort } = req.query;
  const taskFilter = { project: project._id };

  if (taskStatus && ["todo", "in-progress", "done"].includes(taskStatus)) {
    taskFilter.status = taskStatus;
  }

  if (priority && ["low", "medium", "high"].includes(priority)) {
    taskFilter.priority = priority;
  }

  if (assignedTo) {
    if (assignedTo === "unassigned") {
      taskFilter.assignedTo = null;
    } else if (/^[0-9a-fA-F]{24}$/.test(assignedTo)) {
      taskFilter.assignedTo = assignedTo;
    }
  }

  let sortOptions = { createdAt: -1 };
  if (sort === "dueDateAsc") sortOptions = { dueDate: 1 };
  else if (sort === "dueDateDesc") sortOptions = { dueDate: -1 };
  else if (sort === "priority") sortOptions = { priority: -1 };

  const tasks = await Task.find(taskFilter)
    .sort(sortOptions)
    .populate("createdBy")
    .populate("assignedTo");

  res.render("projects/show", {
    project,
    tasks,
    title: project.title,
    query: req.query,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/edit", { project, title: `Edit ${project.title}` });
};

module.exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body.project, {
    new: true,
  });
  req.flash("success", "Project updated successfully!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const tasks = await Task.find({ project: id }, "_id");
  await Comment.deleteMany({ task: { $in: tasks.map((task) => task._id) } });
  await Task.deleteMany({ project: id });
  await Project.findByIdAndDelete(id);
  req.flash(
    "success",
    "Project and all associated tasks deleted successfully!",
  );
  res.redirect("/projects");
};

module.exports.addMember = async (req, res) => {
  const { id } = req.params;
  const { usernameOrEmail } = req.body;
  const project = await Project.findById(id);
  const userToAdd = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!userToAdd) {
    req.flash("error", "User not found!");
    return res.redirect(`/projects/${id}`);
  }
  if (project.owner.equals(userToAdd._id)) {
    req.flash("error", "You cannot add the owner as a member!");
    return res.redirect(`/projects/${id}`);
  }
  if (project.members.some((member) => member.equals(userToAdd._id))) {
    req.flash("error", "User is already a member!");
    return res.redirect(`/projects/${id}`);
  }

  project.members.push(userToAdd._id);
  await project.save();
  req.flash("success", "Member added successfully!");
  res.redirect(`/projects/${id}`);
};

module.exports.removeMember = async (req, res) => {
  const { id, userId } = req.params;
  const project = await Project.findById(id);

  if (project.owner.equals(userId)) {
    req.flash("error", "You cannot remove the owner!");
    return res.redirect(`/projects/${id}`);
  }

  project.members.pull(userId);
  await project.save();

  await Task.updateMany(
    { project: id, assignedTo: userId },
    {
      $set: {
        assignedTo: null,
      },
    },
  );

  req.flash("success", "Member removed successfully!");
  res.redirect(`/projects/${id}`);
};
