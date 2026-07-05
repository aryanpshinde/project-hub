const Task = require('../models/task')

module.exports.createTask = async (req, res) => {
  const { id } = req.params
  const task = new Task(req.body.task)
  task.project = id
  task.createdBy = req.user._id
  await task.save()
  req.flash('success', 'Task created successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.showTask = async (req, res) => {
  const { taskId } = req.params
  const task = await Task.findById(taskId).populate('createdBy')
  res.render(`tasks/show`, { task })
}

module.exports.renderEditForm = async (req, res) => {
  const { taskId } = req.params
  const task = await Task.findById(taskId).populate('createdBy')
  res.render('tasks/edit', { task })
}

module.exports.updateTask = async (req, res) => {
  const { id, taskId } = req.params
  const task = await Task.findByIdAndUpdate(taskId, req.body.task, { new: true })
  req.flash('success', 'Task updated successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.deleteTask = async (req, res) => {
  const { id, taskId } = req.params
  await Task.findByIdAndDelete(taskId)
  req.flash('success', 'Task deleted successfully!')
  res.redirect(`/projects/${id}`)
}