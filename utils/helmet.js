const helmet = require("helmet");

const configureHelmet = () => {
  const imgSrc = [
    "'self'",
    "data:",
    "https://ui-avatars.com",
    "https://ik.imagekit.io",
    "https://res.cloudinary.com",
  ];

  if (process.env.IMAGEKIT_URL_ENDPOINT) {
    imgSrc.push(process.env.IMAGEKIT_URL_ENDPOINT.trim());
  }

  return helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": imgSrc,
        "font-src": ["'self'", "data:"],
        "connect-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        ...(process.env.NODE_ENV === "production" && {
          "upgrade-insecure-requests": [],
        }),
      },
    },
  });
};

module.exports = configureHelmet;
