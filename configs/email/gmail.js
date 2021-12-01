const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pruebaDesafioClemente@gmail.com",
    pass: "abcde12345?",
  },
});

const enviarMail = (asunto, mensaje, adjunto, to, cb) => {
  const mailOptions = {
    from: "ServidorEcommerce",
    to: to,
    subject: asunto,
    html: mensaje,
    attachments: [
      {
        path: adjunto,
        filename: "foto.jpg",
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    cb(err, info);
  });
};

module.exports = { enviarMail };
