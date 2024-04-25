const router = require("express").Router();

const gameRouter = require("#root/src/routes/game/route.cjs");
const orderRouter = require("#root/src/routes/order/route.cjs");
const userRouter = require("#root/src/routes/user/route.cjs");

router.use("/api/v1/games", gameRouter.gameSubrouter);
router.use("/api/v1/orders", orderRouter.orderSubrouter);
router.use("/api/v1/users", userRouter.userSubrouter);

module.exports = router;
