const appConstant = require("#root/src/constant.cjs");
const db = require("#root/src/config/db.cjs");
const gameEntityMapper = require("#root/src/routes/game/entity-mapper.cjs");
const httpResponse = require("#root/src/http-response.cjs");

const getGameList = async (req, res, next) => {
  try {
    // Instantiate default response body
    const respBody = httpResponse.createDefaultResponseBody();
    respBody.message = "Success get game list.";

    // Retrieve pagination query param
    const pagination = {
      page: req.query.page,
      limit: req.query.limit,
    };

    if (pagination.page == undefined || pagination.limit == undefined) {
      pagination.page = 1;
      pagination.limit = 5;
    }

    // Do get game list logic
    const getGameListResult = await db.task("t_getGameList", async (t) => {
      const games = await t.manyOrNone("SELECT * FROM public.game ORDER BY created_date DESC LIMIT $1 OFFSET $2", [
        pagination.limit,
        (pagination.page - 1) * pagination.limit,
      ]);

      const mappedGames = gameEntityMapper.mapGameList(games);

      const totalCount = await t.one("SELECT COUNT(id) as count FROM public.game");

      return {
        applicationSpecificStatusCode: appConstant.applicationWideSpecificStatusCode.STATUS_OK,
        mappedGames,
        totalCount,
      };
    });

    respBody.applicationSpecificStatusCode = getGameListResult.applicationSpecificStatusCode;
    respBody.result = {
      games: {
        list: getGameListResult.mappedGames,
        page: pagination.page,
        totalCount: Number(getGameListResult.totalCount.count),
      },
    };

    return res.status(respBody.status).json(respBody);
  } catch (error) {
    return next(error);
  }
};

const getGameVoucherList = async (req, res, next) => {
  try {
    // Instantiate default response body
    const respBody = httpResponse.createDefaultResponseBody();
    respBody.message = "Success get game voucher list.";

    // Retrieve game id path param & pagination query param
    const gameId = req.params.gameId;
    const pagination = {
      page: req.query.page,
      limit: req.query.limit,
    };

    if (pagination.page == undefined || pagination.limit == undefined) {
      pagination.page = 1;
      pagination.limit = 5;
    }

    // Do get game voucher list logic
    const getGameVoucherListResult = await db.task("t_getGameVoucherList", async (t) => {
      const gameVouchers = await t.manyOrNone(
        "SELECT * FROM public.game_voucher WHERE game_id = $1 ORDER BY created_date DESC LIMIT $2 OFFSET $3",
        [gameId, pagination.limit, (pagination.page - 1) * pagination.limit]
      );

      const mappedGameVouchers = gameEntityMapper.mapGameVoucherList(gameVouchers);

      const totalCount = await t.one("SELECT COUNT(id) as count FROM public.game_voucher");

      return {
        applicationSpecificStatusCode: appConstant.applicationWideSpecificStatusCode.STATUS_OK,
        mappedGameVouchers,
        totalCount,
      };
    });

    respBody.applicationSpecificStatusCode = getGameVoucherListResult.applicationSpecificStatusCode;
    respBody.result = {
      gameVouchers: {
        list: getGameVoucherListResult.mappedGameVouchers,
        page: pagination.page,
        totalCount: Number(getGameVoucherListResult.totalCount.count),
      },
    };

    return res.status(respBody.status).json(respBody);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getGameList,
  getGameVoucherList,
};
