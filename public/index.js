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

function enviarPost() {
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
