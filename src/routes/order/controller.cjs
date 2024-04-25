const expressValidator = require("express-validator");
const httpStatusCodes = require("http-status-codes");
const uuid = require("uuid");

const appConstant = require("#root/src/constant.cjs");
const db = require("#root/src/config/db.cjs");
const httpResponse = require("#root/src/http-response.cjs");
const orderConstant = require("#root/src/routes/order/constant.cjs");

const order = async (req, res, next) => {
  try {
    // Instantiate default response body
    const respBody = httpResponse.createDefaultResponseBody();
    respBody.message = "Success create game voucher order.";

    // Retrieve decoded auth token
    const decodedToken = req.decodedToken;

    // Validate request body
    const validationResult = expressValidator.validationResult(req);
    if (!validationResult.isEmpty()) {
      respBody.status = httpStatusCodes.StatusCodes.BAD_REQUEST;
      respBody.applicationSpecificStatusCode = orderConstant.orderWideSpecificStatusCode.FAILED_ORDER_INVALID_REQ_BODY;
      respBody.message = "Failed create game voucher order, invalid request body.";
      respBody.result = validationResult.array();

      return res.status(respBody.status).json(respBody);
    }

    // Reference request body
    const reqBody = req.body;

    const orderId = uuid.v4();

    // Do order logic
    const orderResult = await db.task("t_order", async (t) => {
      const gameVoucher = await t.oneOrNone("SELECT id FROM public.game_voucher WHERE id = $1", reqBody.gameVoucherId);
      if (gameVoucher == null) {
        return orderConstant.orderWideSpecificStatusCode.FAILED_ORDER_INVALID_GAME_VOUCHER_ID;
      }

      await t.none(
        "INSERT INTO public.order (id, email, in_game_uuid, game_voucher_id, payment_method, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [orderId, reqBody.email, reqBody.inGameUuid, reqBody.gameVoucherId, reqBody.paymentMethod, decodedToken.userId]
      );

      return appConstant.applicationWideSpecificStatusCode.STATUS_OK;
    });

    respBody.applicationSpecificStatusCode = orderResult;

    if (orderResult !== appConstant.applicationWideSpecificStatusCode.STATUS_OK) {
      respBody.message = "Failed create game voucher order, invalid game voucher id.";
    }

    return res.status(respBody.status).json(respBody);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  order,
};
