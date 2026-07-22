const express = require("express");
const router = express.Router({ mergeParams: true });
const tasks = require("../controllers/tasks");
const commentRoutes = require("./comments");
const {
  isLoggedIn,
  isProjectParticipant,
  isTaskEditor,
  validateTask,
  validateTaskStatus,
  isValidAssignee,
} = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  isProjectParticipant,
  validateTask,
  isValidAssignee,
  tasks.createTask,
);

router.get(
  "/:taskId/edit",
  isLoggedIn,
  isProjectParticipant,
  isTaskEditor,
  tasks.renderEditForm,
);

router.patch(
  "/:taskId/status",
  isLoggedIn,
  isProjectParticipant,
  isTaskEditor,
  validateTaskStatus,
  tasks.updateTaskStatus,
);

router.use("/:taskId/comments", commentRoutes);

router
  .route("/:taskId")
  .get(isLoggedIn, isProjectParticipant, tasks.showTask)
  .put(
    isLoggedIn,
    isProjectParticipant,
    isTaskEditor,
    validateTask,
    isValidAssignee,
    tasks.updateTask,
  )
  .delete(isLoggedIn, isProjectParticipant, isTaskEditor, tasks.deleteTask);

module.exports = router;
