const helmet = require("helmet");

const configureHelmet = () => {
  const imgSrc = ["'self'", "https://ui-avatars.com", "data:"];

  if (process.env.IMAGEKIT_URL_ENDPOINT) {
    imgSrc.push(process.env.IMAGEKIT_URL_ENDPOINT);
  }

  return helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'"],
        "img-src": imgSrc,
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
      },
    },
  });
};

module.exports = configureHelmet;
