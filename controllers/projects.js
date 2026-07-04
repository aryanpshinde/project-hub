const Project = require("../models/project");
const User = require("../models/user")

module.exports.index = async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
};

module.exports.renderNewForm = (req, res) => {
  res.render("projects/new");
};

module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  project.owner = req.user._id;
  await project.save();
  res.redirect(`/projects/${project._id}`);
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('owner').populate('members');
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

module.exports.addMember = async (req, res) => {
  const { id } = req.params
  const { usernameOrEmail } = req.body

  const project = await Project.findById(id)
  const userToAdd = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  })

  if (!userToAdd) {
    req.flash('error', 'User not found!')
    return res.redirect(`/projects/${id}`)
  }

  if (project.owner.equals(userToAdd._id)) {
    req.flash('error', 'You cannot add the owner as a member!')
    return res.redirect(`/projects/${id}`)
  }

  if (project.members.includes(userToAdd._id)) {
    req.flash('error', 'User is already a member!')
    return res.redirect(`/projects/${id}`)
  }

  project.members.push(userToAdd._id)
  await project.save()

  req.flash('success', 'Member added successfully!')
  res.redirect(`/projects/${id}`)
}

module.exports.removeMember = async (req, res) => {
  const { id, userId } = req.params
  const project = await Project.findById(id)

  if (project.owner.equals(userId)) {
    req.flash('error', 'You cannot remove the owner!')
    return res.redirect(`/projects/${id}`)
  }

  project.members.pull(userId)
  await project.save()

  req.flash('success', 'Member removed successfully!')
  res.redirect(`/projects/${id}`)
}