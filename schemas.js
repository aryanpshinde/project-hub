const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
  }).required(),
});

module.exports.taskSchema = Joi.object({
  task: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
  }).required(),
});