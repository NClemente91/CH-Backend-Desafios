const socket = io();

socket.on("connect", () => {
  console.log("Usuario conectado: " + socket.id);
});

//SECCION DE MENSAJES
socket.on("messages", (data) => {
  render(data);
});

function render(data) {
  let html = data
    .map((elem) => {
      return `
      <div>
        <strong class="author">${elem.author}</strong> <em class="hora">${elem.hora}</em>:
        <em class="text">${elem.text}</em>
      </div>    
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function addMessage() {
  const horaM = horaMsj();
  let message = {
    author: document.getElementById("username").value,
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
