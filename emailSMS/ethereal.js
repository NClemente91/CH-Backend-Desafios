const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "laverne.borer7@ethereal.email",
    pass: "nrFQcFDMqE3f6Kjrst",
  },
});

const enviarMail = (asunto, mensaje, cb) => {
  const mailOptions = {
    from: "Desafío 35",
    to: "laverne.borer7@ethereal.email",
    subject: asunto,
    html: mensaje,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    cb(err, info);
  });
};

module.exports = { enviarMail };
