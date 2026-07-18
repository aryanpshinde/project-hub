const sanitizeDeep = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (/^\$/.test(key) || key.includes(".")) {
        delete obj[key];
      } else {
        sanitizeDeep(obj[key]);
      }
    }
  }
  return obj;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeDeep(req.body);
  if (req.params) req.params = sanitizeDeep(req.params);
  next();
};

module.exports = sanitizeInput;
