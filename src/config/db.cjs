const env = require("#root/src/config/env.cjs");
const logger = require("#root/src/config/logger.cjs");

const pgp = require("pg-promise")({
  query: (e) => {
    logger.info(e.query);
  },
});

const cn = {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  max: env.DATABASE_MAX_CONNECTION,
};

const db = pgp(cn);

module.exports = db;
