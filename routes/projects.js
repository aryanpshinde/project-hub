const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");

router.route("/").get(projects.index).post(projects.createProject);

router.route("/new").get(projects.renderNewForm);
router.route("/:id/edit").get(projects.renderEditForm);

router
  .route("/:id")
  .get(projects.showProject)
  .put(projects.updateProject)
  .delete(projects.deleteProject);

module.exports = router;
