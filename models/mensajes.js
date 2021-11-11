const { Schema, model } = require("mongoose");

const MensajeSchema = Schema({
  author: {
    type: Object,
    // enum: [id, nombre, apellido, edad, alias, avatar],
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
});

// //METODO PARA NO MOSTRAR CIERTOS DATOS
// MensajeSchema.methods.toJSON = function () {
//   //Convierte el objeto mongoose a un objeto plano
//   const { _id, __v, ...message } = this.toObject();
//   return message;
// };

module.exports = model("Mensajes", MensajeSchema);
