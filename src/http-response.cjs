const httpStatusCodes = require("http-status-codes");
const appConstant = require("#root/src/constant.cjs");

const createDefaultResponseBody = () => {
  return {
    status: httpStatusCodes.StatusCodes.OK,
    applicationSpecificStatusCode: appConstant.applicationWideSpecificStatusCode.STATUS_OK,
    message: httpStatusCodes.ReasonPhrases.OK,
    result: null,
  };
};

module.exports = {
  createDefaultResponseBody,
};
