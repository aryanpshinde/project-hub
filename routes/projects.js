const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");
const { validateProject } = require("../middleware");

router
  .route("/")
  .get(projects.index)
  .post(validateProject, projects.createProject);

router.route("/new").get(projects.renderNewForm);
router.route("/:id/edit").get(projects.renderEditForm);

router
  .route("/:id")
  .get(projects.showProject)
  .put(validateProject, projects.updateProject)
  .delete(projects.deleteProject);

module.exports = router;
