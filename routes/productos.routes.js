const express = require("express");
const router = express.Router();
path = require("path");

//PRECARGADOS DOS PRODUCTOS PARA PRUEBA
let productos = [
  { title: "yerba", price: 180, thumbmail: "/img/yerba.png", id: 1 },
  { title: "fideos", price: 180, thumbmail: "/img/fideos.png", id: 2 },
];

//RUTAS

router.get("/productos/listar", (req, res) => {
  try {
    if (productos.length !== 0) {
      return res.status(200).json(productos);
    } else {
      return res.status(404).json({ error: "no hay productos cargados" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.get("/productos/listar/:id", (req, res) => {
  try {
    const id = req.params.id;
    const pos = productos.findIndex((p) => p.id === Number(id));
    if (pos !== -1) {
      return res.status(200).json(productos[pos]);
    } else {
      return res.status(404).json({ error: "producto no encontrado" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.post("/productos/guardar/", (req, res) => {
  try {
    const prod = req.body;
    prod.price = Number(prod.price);
    prod.id = productos[productos.length - 1].id + 1;
    productos.push(prod);
    return res.status(200).json(prod);
  } catch (error) {
    return res.status(404).json({ error: "error al ingresar el producto" });
  }
});

router.put("/productos/actualizar/:id", (req, res) => {
  try {
    const id = req.params.id;
    const pos = productos.findIndex((p) => p.id === Number(id));
    if (pos !== -1) {
      productos[pos] = req.body;
      productos[pos].id = id;
      return res.status(200).json(productos[pos]);
    } else {
      return res.status(404).json({ error: "producto no encontrado" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.delete("/productos/borrar/:id", (req, res) => {
  try {
    const id = req.params.id;
    const pos = productos.findIndex((p) => p.id === Number(id));
    if (pos !== -1) {
      const elemB = productos[pos];
      productos.splice(pos, 1);
      return res.status(200).json(elemB);
    } else {
      return res.status(404).json({ error: "producto no encontrado" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
});

module.exports = router;
