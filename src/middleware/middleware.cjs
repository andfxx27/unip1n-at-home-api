const authMiddleware = require("#root/src/middleware/auth-middleware.cjs");
const multerMiddleware = require("#root/src/middleware/multer-middleware.cjs");

module.exports = {
  authMiddleware,
  multerMiddleware,
};
