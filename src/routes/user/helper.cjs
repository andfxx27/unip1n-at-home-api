const jwt = require("jsonwebtoken");

const env = require("#root/src/config/env.cjs");

const signJwt = async (payload) => {
  const expiresIn = env.JWT_AUTHENTICATION_EXPIRATION_TIME;
  const issuer = env.APPLICATION_NAME;
  const secret = env.JWT_AUTHENTICATION_SECRET;

  return await new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn, issuer }, (err, token) => {
      if (err != null) {
        return reject(err);
      }

      return resolve(token);
    });
  });
};

const verifyJwt = async (token) => {
  const secret = env.JWT_AUTHENTICATION_SECRET;

  return await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err != null) {
        return reject(err);
      }

      return resolve(decoded);
    });
  });
};

module.exports = {
  signJwt,
  verifyJwt,
};
