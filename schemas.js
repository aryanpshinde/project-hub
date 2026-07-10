const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
  }).required(),
});

module.exports.taskSchema = Joi.object({
  task: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    status: Joi.string().valid("todo", "in-progress", "done").optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    dueDate: Joi.date().allow("").optional(),
    assignedTo: Joi.string().hex().length(24).allow("").optional(),
  }).required(),
});

module.exports.taskStatusSchema = Joi.object({
  task: Joi.object({
    status: Joi.string().valid("todo", "in-progress", "done").required(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});
