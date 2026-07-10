const Project = require("../models/project");
const Task = require("../models/task");

module.exports.renderDashboard = async (req, res, next) => {
  const userId = req.user._id;
  const ownedProjects = await Project.find({ owner: userId }).populate(
    "members",
  );
  const memberProjects = await Project.find({ members: userId }).populate(
    "owner",
  );
  const assignedTasks = await Task.find({ assignedTo: userId }).populate(
    "project",
  );

  const overdueTasks = await Task.find({
    assignedTo: userId,
    dueDate: { $lt: new Date() },
    status: { $ne: "done" },
  }).populate("project");

  const taskCounts = {
    todo: assignedTasks.filter((t) => t.status === "todo").length,
    inProgress: assignedTasks.filter((t) => t.status === "in-progress").length,
    done: assignedTasks.filter((t) => t.status === "done").length,
  };

  res.render("dashboard/index", {
    ownedProjects,
    memberProjects,
    assignedTasks,
    overdueTasks,
    taskCounts,
    title: "Dashboard",
  });
};
