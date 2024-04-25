const expressValidator = require("express-validator");

const orderReqBodyValidator = () => {
  return {
    email: expressValidator
      .body("email")
      .isEmail()
      .bail()
      .withMessage("Field 'email' is required, must be a valid email."),
    inGameUuid: expressValidator
      .body("inGameUuid")
      .isLength({ min: 1, max: 100 })
      .bail()
      .withMessage("Field 'inGameUuid' is required, must be between 1 and 100 characters."),
    gameVoucherId: expressValidator
      .body("gameVoucherId")
      .isUUID("4")
      .bail()
      .withMessage("Field 'gameVoucherId' is required, must be a valid v4 uuid."),
    paymentMethod: expressValidator
      .body("paymentMethod")
      .isLength({ min: 1, max: 255 })
      .bail()
      .withMessage("Field 'inGameUuid' is required, must be between 1 and 255 characters."),
  };
};

module.exports = {
  orderReqBodyValidator,
};
