const userSubrouter = require("express").Router();

const controller = require("#root/src/routes/user/controller.cjs");
const middleware = require("#root/src/middleware/middleware.cjs");
const validator = require("#root/src/routes/user/validator.cjs");

const signUpReqBodyValidator = validator.signUpReqBodyValidator();
const signInReqBodyValidator = validator.signInReqBodyValidator();

userSubrouter.post(
  "/sign-up",
  middleware.multerMiddleware.userSignUpAvatarFileUploadMiddleware.single("avatar"),
  signUpReqBodyValidator.username,
  signUpReqBodyValidator.firstName,
  signUpReqBodyValidator.lastName,
  signUpReqBodyValidator.email,
  signUpReqBodyValidator.phoneNumber,
  signUpReqBodyValidator.password,
  signUpReqBodyValidator.dateOfBirth,
  controller.signUp
);

userSubrouter.post("/sign-in", signInReqBodyValidator.identifier, signInReqBodyValidator.password, controller.signIn);

module.exports = {
  userSubrouter,
};
