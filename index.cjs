require("dotenv").config();

const cors = require("cors");
const express = require("express");
const httpStatusCodes = require("http-status-codes");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(cors());

const appConstant = require("#root/src/constant.cjs");
const env = require("#root/src/config/env.cjs");
const httpResponse = require("#root/src/http-response.cjs");
const logger = require("#root/src/config/logger.cjs");
const router = require("#root/src/routes/routes.cjs");

const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err, req, res, next) => {
  const respBody = httpResponse.createDefaultResponseBody();
  respBody.status = httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
  respBody.applicationSpecificStatusCode = appConstant.applicationWideSpecificStatusCode.STATUS_NOT_OK;
  respBody.message = httpStatusCodes.ReasonPhrases.INTERNAL_SERVER_ERROR;

  logger.error(err.stack);

  if (err.message === "Client error, file is not allowed.") {
    respBody.status = httpStatusCodes.StatusCodes.BAD_REQUEST;
    respBody.message = "Invalid request body.";
    return res.status(respBody.status).json(respBody);
  }

  return res.status(respBody.status).json(respBody);
});

app.listen(env.APPLICATION_PORT, () => logger.info(`Server started on port :${env.APPLICATION_PORT}`));
