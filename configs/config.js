const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "127.0.0.1",
  PORT: process.env.PORT || 8080,
  FORKORCLUSTER: process.env.FORKORCLUSTER || "FORK",
  PERSISTENCIA: process.env.PERSISTENCIA || "MEM",
  MONGO_URL: process.env.MONGO_URL,
  SECRET: process.env.SECRET,
  TOKEN_EXPIRE: process.env.TOKEN_EXPIRE || "1h",
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};
