const socket = io({ transports: ["websocket"] });

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
      <h4>${elem.email}</h4>
      <h6>${elem.message}</h6>
      </div>
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function addMessage() {
  let messageUser = {
    email: document.getElementById("email").value,
    typeUser: "user",
    message: document.getElementById("texto").value,
  };
  document.getElementById("texto").value = "";
  socket.emit("new-message", messageUser);
}
