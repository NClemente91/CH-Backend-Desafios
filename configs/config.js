const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PERSISTENCIA: process.env.PERSISTENCIA || "MEM",
  HOST: process.env.HOST || "127.0.0.1",
  STORE_SESSION: process.env.STORE_SESSION,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
