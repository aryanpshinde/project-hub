const Project = require('../models/project')
const Task = require('../models/task')
const Comment = require('../models/comment')
const { commentSchema } = require('../schemas')

module.exports.createTask = async (req, res) => {
  const { id } = req.params
  const taskData = req.body.task

  if (taskData.dueDate === '') taskData.dueDate = null
  if (taskData.assignedTo === '') taskData.assignedTo = null

  const task = new Task(taskData)
  task.project = id
  task.createdBy = req.user._id

  await task.save()
  req.flash('success', 'Task created successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.showTask = async (req, res) => {
  const { id, taskId } = req.params;
  const task = await Task.findById(taskId)
    .populate("createdBy")
    .populate("assignedTo");
  const project = await Project.findById(id)
    .populate("owner")
    .populate("members");
  const comments = await Comment.find({ task: taskId })
    .populate("author")
    .sort({ createdAt: -1 });

  res.render(`tasks/show`, { task, project, comments, title: task.title });
};

module.exports.renderEditForm = async (req, res) => {
  const { id, taskId } = req.params
  const task = await Task.findById(taskId).populate('createdBy').populate('assignedTo')
  const project = await Project.findById(id).populate('owner').populate('members')
  res.render('tasks/edit', { task, project })
}

module.exports.updateTask = async (req, res) => {
  const { id, taskId } = req.params
  const taskData = req.body.task

  if (taskData.dueDate === '') taskData.dueDate = null
  if (taskData.assignedTo === '') taskData.assignedTo = null

  if (taskData.status !== undefined) {
    if (taskData.status === 'done') {
      taskData.completedAt = new Date()
    } else {
      taskData.completedAt = null;
    }
  }

  const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true, runValidators: true })
  req.flash('success', 'Task updated successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.deleteTask = async (req, res) => {
  const { id, taskId } = req.params
  await Comment.deleteMany({ task: taskId })
  await Task.findByIdAndDelete(taskId)
  req.flash('success', 'Task deleted successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.updateTaskStatus = async (req, res) => {
  const { id, taskId } = req.params
  const status = req.body.task.status

  if (!status) {
    req.flash('error', 'Status is required')
    return res.redirect(`/projects/${id}`)
  }

  const updateData = { status }

  if (status === 'done') {
    updateData.completedAt = new Date()
  } else {
    updateData.completedAt = null
  }

  await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true })
  req.flash('success', `Updated the task status to ${status} successfully!`)
  res.redirect(`/projects/${id}`)
}