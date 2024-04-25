const gameSubrouter = require("express").Router();

const controller = require("#root/src/routes/game/controller.cjs");

// Standard user
gameSubrouter.get("/", controller.getGameList);
gameSubrouter.get("/:gameId/vouchers", controller.getGameVoucherList);

// Admin user

module.exports = {
  gameSubrouter,
};
