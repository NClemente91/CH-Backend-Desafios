const express = require("express");
const fs = require("fs");

const app = express();

let visitasItems = 0;
let visitasItemRandom = 0;

app.get("/items", async (req, res) => {
  try {
    if (fs.existsSync("./productos.txt")) {
      let content = await fs.promises.readFile("./productos.txt", "utf-8");
      let contentJ = JSON.parse(content);
      let contentM = { items: contentJ, cantidad: contentJ.length };
      console.log(contentM);
    } else {
      console.log([]);
    }
  } catch (error) {
    console.log("Hubo un error", error);
  }
  visitasItems++;
  return res.end("Proceso terminado");
});

app.get("/item-random", async (req, res) => {
  try {
    if (fs.existsSync("./productos.txt")) {
      let content = await fs.promises.readFile("./productos.txt", "utf-8");
      let contentJ = JSON.parse(content);
      let posP = Math.floor(Math.random() * contentJ.length);
      let contentM = { item: contentJ[posP] };
      console.log(contentM);
    } else {
      console.log([]);
    }
  } catch (error) {
    console.log("Hubo un error", error);
  }
  visitasItemRandom++;
  return res.end("Proceso terminado");
});

app.get("/visitas", (req, res) => {
  console.log(`Se utilizó el endpoint /items ${visitasItems} veces`);
  console.log(`Se utilizó el endpoint /item-random ${visitasItemRandom} veces`);
  return res.end("Proceso terminado");
});

app.listen(8080, () => {
  try {
    console.log("Servidor conectado en puerto 8080");
  } catch (error) {
    console.log("Error de conexión");
  }
});
