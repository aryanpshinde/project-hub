const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  }).required(),
});
