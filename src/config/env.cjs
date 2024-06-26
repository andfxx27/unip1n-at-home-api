const env = {
  NODE_ENV: process.env.NODE_ENV,

  APPLICATION_NAME: process.env.APPLICATION_NAME,
  APPLICATION_PORT: process.env.APPLICATION_PORT,

  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_MAX_CONNECTION: process.env.DATABASE_MAX_CONNECTION,

  JWT_AUTHENTICATION_SECRET: process.env.JWT_AUTHENTICATION_SECRET,
  JWT_AUTHENTICATION_EXPIRATION_TIME: process.env.JWT_AUTHENTICATION_EXPIRATION_TIME,
};

module.exports = env;
