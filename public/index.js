const socket = io();
const templateProductos = document.querySelector("#templateProductos");
const templateToRender = document.querySelector("#templateToRender");

socket.on("connect", () => {
  console.log("Usuario conectado: " + socket.id);
});

//RECIBO PRODUCTOS EXISTENTES
socket.on("productosExistentes", (data) => {
  const template = ejs.compile(templateProductos.innerHTML);
  templateToRender.innerHTML = template({
    productExist: true,
    productos: data.value,
  });
  socket.emit("notificacion", { value: data });
});
