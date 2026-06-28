const { projectSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
