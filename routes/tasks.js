const express = require('express')
const router = express.Router({ mergeParams: true })
const tasks = require('../controllers/tasks')
const { isLoggedIn, isProjectParticipant, isTaskEditor, validateTask } = require('../middleware')

router.route('/').post(isLoggedIn, isProjectParticipant, validateTask, tasks.createTask)

router.route('/:taskId/edit').get(isLoggedIn, isProjectParticipant, isTaskEditor, tasks.renderEditForm)

router.route('/:taskId')
  .get(isLoggedIn, isProjectParticipant, tasks.showTask)
  .put(isLoggedIn, isProjectParticipant, isTaskEditor, validateTask, tasks.updateTask)
  .delete(isLoggedIn, isProjectParticipant, isTaskEditor, tasks.deleteTask)

module.exports = router