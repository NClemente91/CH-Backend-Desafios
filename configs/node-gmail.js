const nodemailer = require("nodemailer");
const { loggerInfo, loggerError } = require("./loggers");
const config = require("./config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailRegister = async (user) => {
  const mailOptionsRegister = {
    from: config.MAIL_USER,
    to: config.MAIL_USER,
    subject: `New user registration`,
    html: `<h3>Data stored in the database</h3>

    <p>Email: ${user.email}</p></br>
    <p>Username: ${user.username}</p></br>
    <p>Address: ${user.address}</p></br>
    <p>Phone: ${user.phoneNumber}</p></br>`,
  };

  transporter.sendMail(mailOptionsRegister, function (err, info) {
    if (err) {
      loggerInfo.info(`Error with Nodemailer ${err}`);
      loggerError.error(`Error with Nodemailer ${err}`);
    } else {
      loggerInfo.info("email sent successfully");
    }
  });
};

const emailOrder = async (email, address, state) => {
  const mailOptionsOrder = {
    from: config.MAIL_USER,
    to: config.MAIL_USER,
    subject: `New order generated`,
    html: `<h3>Data stored in the database</h3>

    <p>Email: ${email}</p></br>
    <p>Address: ${address}</p></br>
    <p>State: ${state}</p></br>`,
  };

  transporter.sendMail(mailOptionsOrder, function (err, info) {
    if (err) {
      loggerInfo.info(`Error with Nodemailer ${err}`);
      loggerError.error(`Error with Nodemailer ${err}`);
    } else {
      loggerInfo.info("email sent successfully");
    }
  });
};

module.exports = { emailRegister, emailOrder };
