const express = require('express')
const router = express.Router({ mergeParams: true })
const tasks = require('../controllers/tasks')
const { isLoggedIn, isProjectParticipant, isTaskEditor, validateTask, validateTaskStatus } = require('../middleware')

router.post('/', isLoggedIn, isProjectParticipant, validateTask, tasks.createTask)
router.get('/:taskId/edit', isLoggedIn, isProjectParticipant, isTaskEditor, tasks.renderEditForm)
router.patch('/:taskId/status', isLoggedIn, isProjectParticipant, isTaskEditor, validateTaskStatus, tasks.updateTaskStatus)

router.route('/:taskId')
  .get(isLoggedIn, isProjectParticipant, tasks.showTask)
  .put(isLoggedIn, isProjectParticipant, isTaskEditor, validateTask, tasks.updateTask)
  .delete(isLoggedIn, isProjectParticipant, isTaskEditor, tasks.deleteTask)

module.exports = router