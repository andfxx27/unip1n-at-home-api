const fs = require("fs");

const bcrypt = require("bcrypt");
const expressValidator = require("express-validator");
const httpStatusCodes = require("http-status-codes");
const uuid = require("uuid");

const appConstant = require("#root/src/constant.cjs");
const db = require("#root/src/config/db.cjs");
const httpResponse = require("#root/src/http-response.cjs");
const logger = require("#root/src/config/logger.cjs");
const userHelper = require("#root/src/routes/user/helper.cjs");
const userConstant = require("#root/src/routes/user/constant.cjs");

const signUp = async (req, res, next) => {
  try {
    // Instantiate default response body
    const respBody = httpResponse.createDefaultResponseBody();
    respBody.message = "Success sign up.";

    // Validate request body
    const validationResult = expressValidator.validationResult(req);
    if (!validationResult.isEmpty()) {
      respBody.status = httpStatusCodes.StatusCodes.BAD_REQUEST;
      respBody.applicationSpecificStatusCode = userConstant.userWideSpecificStatusCode.FAILED_SIGN_UP_INVALID_REQ_BODY;
      respBody.message = "Failed sign up, invalid request body.";
      respBody.result = validationResult.array();

      logger.info(validationResult.array());

      return res.status(respBody.status).json(respBody);
    }

    // Reference request body & file
    const reqBody = req.body;
    const avatarFile = req.file;

    const userId = uuid.v4();

    // Create user directory
    const userAvatarPath = `public/user/${userId}/avatar`;
    await fs.promises.mkdir(userAvatarPath, { recursive: true });

    if (avatarFile == undefined) {
      // Assign default avatar url for newly created user if they didn't upload any picture
      reqBody.avatarUrl = "public/default/avatar.jpg";
    } else {
      // Upload the specified file to previous avatar path
      const fileExtension = avatarFile.originalname.split(".")[1];
      const completeUserAvatarPath = `${userAvatarPath}/avatar.${fileExtension}`;
      await fs.promises.writeFile(completeUserAvatarPath, avatarFile.buffer);
      reqBody.avatarUrl = completeUserAvatarPath;
    }

    // Hash user password
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    // Do sign up logic
    const signUpResult = await db.task("t_signUp", async (t) => {
      const user = await t.oneOrNone(
        "SELECT * FROM public.user WHERE username = $1 OR email = $2 OR phone_number = $3",
        [reqBody.username, reqBody.email, reqBody.phoneNumber]
      );
      if (user != null) {
        return userConstant.userWideSpecificStatusCode.FAILED_SIGN_UP_USER_ALREADY_REGISTERED;
      }

      await t.none(
        `
        INSERT INTO 
          public.user 
        (id, username, first_name, last_name, email, phone_number, password, date_of_birth, avatar_url)
          VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          userId,
          reqBody.username,
          reqBody.firstName,
          reqBody.lastName,
          reqBody.email,
          reqBody.phoneNumber,
          hashedPassword,
          reqBody.dateOfBirth,
          reqBody.avatarUrl,
        ]
      );

      return appConstant.applicationWideSpecificStatusCode.STATUS_OK;
    });

    respBody.applicationSpecificStatusCode = signUpResult;

    if (signUpResult !== appConstant.applicationWideSpecificStatusCode.STATUS_OK) {
      if (signUpResult === userConstant.userWideSpecificStatusCode.FAILED_SIGN_UP_USER_ALREADY_REGISTERED) {
        respBody.message = "Failed sign up, user already registered.";

        // Revert user avatar file upload & directory creation
        await fs.promises.rm(`public/user/${userId}`, { force: true, recursive: true });
      }
    }

    return res.status(respBody.status).json(respBody);
  } catch (error) {
    return next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    // Instantiate default response body
    const respBody = httpResponse.createDefaultResponseBody();
    respBody.message = "Success sign in.";

    // Validate request body
    const validationResult = expressValidator.validationResult(req);
    if (!validationResult.isEmpty()) {
      respBody.status = httpStatusCodes.StatusCodes.BAD_REQUEST;
      respBody.applicationSpecificStatusCode = userConstant.userWideSpecificStatusCode.FAILED_SIGN_IN_INVALID_REQ_BODY;
      respBody.message = "Failed sign in, invalid request body.";
      respBody.result = validationResult.array();

      return res.status(respBody.status).json(respBody);
    }

    // Reference request body
    const reqBody = req.body;

    // Do sign in logic
    const signInResult = await db.task("t_signIn", async (t) => {
      const user = await t.oneOrNone(
        "SELECT * FROM public.user WHERE username = $1 OR email = $2 OR phone_number = $3",
        [reqBody.identifier, reqBody.identifier, reqBody.identifier]
      );
      if (user == null) {
        return userConstant.userWideSpecificStatusCode.FAILED_SIGN_IN_USER_NOT_REGISTERED;
      }

      const validPassword = await bcrypt.compare(reqBody.password, user.password);
      if (!validPassword) {
        return userConstant.userWideSpecificStatusCode.FAILED_SIGN_IN_INVALID_PASSWORD;
      }

      const token = await userHelper.signJwt({ userId: user.userid, username: user.username });

      respBody.result = {
        accessToken: token,
      };

      return appConstant.applicationWideSpecificStatusCode.STATUS_OK;
    });

    if (signInResult !== appConstant.applicationWideSpecificStatusCode.STATUS_OK) {
      respBody.applicationSpecificStatusCode = signInResult;

      if (signInResult === userConstant.userWideSpecificStatusCode.FAILED_SIGN_IN_USER_NOT_REGISTERED) {
        respBody.message = "Failed sign up, user is not registered.";
      } else if (signInResult === userConstant.userWideSpecificStatusCode.FAILED_SIGN_IN_INVALID_PASSWORD) {
        respBody.message = "Failed sign up, incorrect credentials.";
      }
    }

    return res.status(respBody.status).json(respBody);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signUp,
  signIn,
};
