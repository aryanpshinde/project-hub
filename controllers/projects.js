const Project = require("../models/project");

module.exports.index = async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
};

module.exports.renderNewForm = (req, res) => {
  res.render("projects/new");
};

module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  await project.save();
  res.redirect(`/projects/${project._id}`);
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/show", { project });
};

module.exports.renderEditForm = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/edit", { project });
};

module.exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body.project, {
    new: true,
  });
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.redirect("/projects");
};
