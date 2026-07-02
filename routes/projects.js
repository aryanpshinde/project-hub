const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");
const {
  validateProject,
  isLoggedIn,
  isProjectOwner,
} = require("../middleware");

router
  .route("/")
  .get(projects.index)
  .post(isLoggedIn, validateProject, projects.createProject);

router.route("/new").get(isLoggedIn, projects.renderNewForm);
router
  .route("/:id/edit")
  .get(isLoggedIn, isProjectOwner, projects.renderEditForm);

router
  .route("/:id")
  .get(projects.showProject)
  .put(isLoggedIn, isProjectOwner, validateProject, projects.updateProject)
  .delete(isLoggedIn, isProjectOwner, projects.deleteProject);

module.exports = router;
