const express = require("express");
const fs = require("fs");

class Server {
  constructor() {
    this.app = express();
    this.port = 8080;

    //PRECARGADOS DOS PRODUCTOS PARA PRUEBA
    this.productos = [
      { title: "yerba", price: 180, thumbmail: "/img/yerba.png", id: 1 },
      { title: "fideos", price: 180, thumbmail: "/img/fideos.png", id: 2 },
    ];

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.get("/api/productos/listar", (req, res) => {
      try {
        if (this.productos.length !== 0) {
          return res.status(200).json(this.productos);
        } else {
          return res.status(404).json({ error: "no hay productos cargados" });
        }
      } catch (error) {
        return res.status(404).json({ error });
      }
    });

    this.app.get("/api/productos/listar/:id", (req, res) => {
      try {
        const id = req.params.id;
        const pos = this.productos.findIndex((p) => p.id === Number(id));
        if (pos !== -1) {
          return res.status(200).json(this.productos[pos]);
        } else {
          return res.status(404).json({ error: "producto no encontrado" });
        }
      } catch (error) {
        return res.status(404).json({ error });
      }
    });

    this.app.post("/api/productos/guardar/", (req, res) => {
      try {
        const prod = req.body;
        prod.id = this.productos.length + 1;
        this.productos.push(prod);
        return res.status(200).json(prod);
      } catch (error) {
        return res.status(404).json({ error: "error al ingresar el producto" });
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      try {
        console.log(`Servidor conectado en puerto ${this.port}`);
      } catch (error) {
        console.log("Error de conexión", error);
      }
    });
  }
}

const server = new Server();

server.start();
