const multer = require("multer");

const imageFileWhitelist = ["image/png", "image/jpeg", "image/jpg"];

const userSignUpAvatarFileUploadStorage = multer.memoryStorage();

const userSignUpAvatarFileUploadMiddleware = multer({
  storage: userSignUpAvatarFileUploadStorage,
  fileFilter: (req, file, cb) => {
    if (!imageFileWhitelist.includes(file.mimetype)) {
      return cb(new Error("Client error, file is not allowed."));
    }

    cb(null, true);
  },
});

module.exports = {
  userSignUpAvatarFileUploadMiddleware,
};
