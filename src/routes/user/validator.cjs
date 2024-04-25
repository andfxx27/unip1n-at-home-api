const expressValidator = require("express-validator");
const validator = require("validator");

const signUpReqBodyValidator = () => {
  return {
    username: expressValidator
      .body("username")
      .isLength({ min: 1, max: 255 })
      .bail()
      .withMessage("Field 'username' is required, must be between 1 and 255 characters.")
      .isAlphanumeric()
      .bail()
      .withMessage("Field 'username' must be alphanumeric."),
    firstName: expressValidator
      .body("firstName")
      .isLength({ min: 1, max: 255 })
      .bail()
      .withMessage("Field 'firstName' is required, must be between 1 and 255 characters.")
      .isAlpha()
      .bail()
      .withMessage("Field 'firstName' must consists of only alphabet."),
    lastName: expressValidator
      .body("lastName")
      .isLength({ min: 1, max: 255 })
      .bail()
      .withMessage("Field 'lastName' is required, must be between 1 and 255 characters.")
      .isAlpha()
      .bail()
      .withMessage("Field 'lastName' must consists of only alphabet."),
    email: expressValidator
      .body("email")
      .isEmail()
      .bail()
      .withMessage("Field 'email' is required, must be a valid email."),
    phoneNumber: expressValidator
      .body("phoneNumber")
      .isMobilePhone("id-ID")
      .bail()
      .withMessage("Field 'phoneNumber' is required, must be a valid id-ID phone number."),
    password: expressValidator
      .body("password")
      .isStrongPassword()
      .bail()
      .withMessage("Field 'password' is required, must be a strong password."),
    dateOfBirth: expressValidator
      .body("dateOfBirth")
      .isDate({ format: "YYYY-MM-DD" })
      .bail()
      .withMessage("Field 'dateOfBirth' is required, must be in the format of YYYY-MM-DD.")
      .isBefore("2011-01-01")
      .bail()
      .withMessage("Field 'dateOfBirth' must be before 2011-01-01."),
  };
};

const signInReqBodyValidator = () => {
  return {
    identifier: expressValidator
      .body("identifier")
      .custom((value) => {
        const validUsername = validator.isLength(value, { min: 1, max: 255 }) && validator.isAlphanumeric(value);
        const validEmail = validator.isEmail(value);
        const validPhoneNumber = validator.isMobilePhone(value, "id-ID");

        return validUsername || validEmail || validPhoneNumber;
      })
      .bail()
      .withMessage("Field 'identifier' is required, must be either username, email, or phone number."),
    password: expressValidator
      .body("password")
      .isLength({ min: 8, max: 255 })
      .bail()
      .withMessage("Field 'password' is required."),
  };
};

module.exports = {
  signUpReqBodyValidator,
  signInReqBodyValidator,
};
