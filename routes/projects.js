const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");
const {
  validateProject,
  isLoggedIn,
  isProjectOwner,
  isProjectParticipant,
  validateAddMember,
} = require("../middleware");
const taskRoutes = require("./tasks");

router
  .route("/")
  .get(isLoggedIn, projects.index)
  .post(isLoggedIn, validateProject, projects.createProject);

router.route("/new").get(isLoggedIn, projects.renderNewForm);

router
  .route("/:id/edit")
  .get(isLoggedIn, isProjectOwner, projects.renderEditForm);

router.post(
  "/:id/members",
  isLoggedIn,
  isProjectOwner,
  validateAddMember,
  projects.addMember,
);
router.delete(
  "/:id/members/:userId",
  isLoggedIn,
  isProjectOwner,
  projects.removeMember,
);

router.use("/:id/tasks", taskRoutes);

router
  .route("/:id")
  .get(isLoggedIn, isProjectParticipant, projects.showProject)
  .put(isLoggedIn, isProjectOwner, validateProject, projects.updateProject)
  .delete(isLoggedIn, isProjectOwner, projects.deleteProject);

module.exports = router;
