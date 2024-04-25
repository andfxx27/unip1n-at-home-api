const userHelper = require("#root/src/routes/user/helper.cjs");

const isAuthenticatedMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    if (authorization == null || authorization == undefined) {
      throw new Error("Auth middleware error, undefined or null authorization header.");
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new Error("Auth middleware error, must provide a valid bearer token.");
    }

    const token = authorization.split(" ")[1];

    const decodedToken = await userHelper.verifyJwt(token);

    req.decodedToken = decodedToken;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuthenticatedMiddleware,
};
