const norma = normalizr;
const socket = io();
const templateProductos = document.querySelector("#templateProductos");
const templateToRender = document.querySelector("#templateToRender");

socket.on("connect", () => {
  console.log("Usuario conectado: " + socket.id);
});

socket.on("productosExistentes", (data) => {
  const template = ejs.compile(templateProductos.innerHTML);
  templateToRender.innerHTML = template({
    productExist: true,
    productos: data.value,
  });
});

function enviarPost(e) {
  let title = document.getElementById("title");
  let price = document.getElementById("price");
  let thumbnail = document.getElementById("thumbnail");

  const jsonData = {
    title: title.value,
    price: Number(price.value),
    thumbnail: thumbnail.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  };

  const url = "http://localhost:5050/api/productos/guardar/";

  fetch(url, options)
    .then((res) => console.log(res.status))
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      socket.emit("notificacion", true);
    });

  title.value = "";
  price.value = "";
  thumbnail.value = "";

  return false;
}

//SECCION DE MENSAJES
socket.on("messages", (data) => {
  const dataDesnormalizada = desnormalizar(data.value);
  render(dataDesnormalizada, data.compress);
});

function desnormalizar(messages) {
  const authorSchema = new norma.schema.Entity("authors");
  const messageSchema = new norma.schema.Entity("messages", {
    author: authorSchema,
  });
  const messagesSchema = new norma.schema.Array(messageSchema);

  const denormalizedData = norma.denormalize(
    messages.result,
    messagesSchema,
    messages.entities
  );

  return denormalizedData;
}

function render(data, compress) {
  document.getElementById("compress").innerHTML = `
  Central de Mensajes "Compresión ${compress}%"`;
  let html = data
    .map((elem) => {
      return `
      <div>
        <strong class="author">${elem.author.id}</strong> <em class="hora">${elem.hora}</em>:
        <em class="text">${elem.text}</em> <img class="img" src="${elem.author.avatar}" alt="Avatar"/> 
      </div>    
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function addMessage() {
  const horaM = horaMsj();
  let message = {
    author: {
      id: document.getElementById("email").value,
      nombre: document.getElementById("firstname").value,
      apellido: document.getElementById("lastname").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    hora: horaM,
    text: document.getElementById("texto").value,
  };
  document.getElementById("texto").value = "";
  socket.emit("new-message", message);
}

function fill(number, len) {
  return "0".repeat(len - number.toString().length) + number.toString();
}

function horaMsj() {
  const hora = new Date();
  const DD = fill(hora.getDay(), 2);
  const MMe = fill(hora.getMonth(), 2);
  const YYYY = hora.getFullYear();
  const HH = fill(hora.getHours(), 2);
  const MMi = fill(hora.getMinutes(), 2);
  const SS = fill(hora.getSeconds(), 2);
  const horaFormateada = `[${DD}/${MMe}/${YYYY} ${HH}:${MMi}:${SS}]`;
  return horaFormateada;
}
