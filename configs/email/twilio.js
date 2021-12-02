const accountSid = "AC6a81af7b3f1743abea9bb92cfa1262f8";
const authToken = "07254bcb0c92d5d3aafcb7b9caff4c39";

const twilio = require("twilio");

const client = twilio(accountSid, authToken);

const enviarSMS = async (mensaje, numero) => {
  try {
    let rta = await client.messages.create({
      body: `${mensaje}`,
      mediaUrl: [
        "https://cdn2.iconfinder.com/data/icons/user-interface-vol-2-21/64/Thank_You-256.png",
      ],
      from: `whatsapp:+18023476991`,
      to: `whatsapp:+549${numero}`,
    });
    return rta;
  } catch (error) {
    return error;
  }
};

module.exports = { enviarSMS };
