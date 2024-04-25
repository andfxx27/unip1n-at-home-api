const orderSubrouter = require("express").Router();

const controller = require("#root/src/routes/order/controller.cjs");
const middleware = require("#root/src/middleware/middleware.cjs");
const validator = require("#root/src/routes/order/validator.cjs");

const orderReqBodyValidator = validator.orderReqBodyValidator();

orderSubrouter.post(
  "/",
  middleware.authMiddleware.isAuthenticatedMiddleware,
  orderReqBodyValidator.email,
  orderReqBodyValidator.inGameUuid,
  orderReqBodyValidator.gameVoucherId,
  orderReqBodyValidator.paymentMethod,
  controller.order
);

module.exports = {
  orderSubrouter,
};
