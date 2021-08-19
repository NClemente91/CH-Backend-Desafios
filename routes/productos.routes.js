const express = require("express");
const router = express.Router();

//PRECARGADOS DOS PRODUCTOS PARA PRUEBA
let productos = [
  {
    title: "naranja",
    price: 180,
    thumbnail:
      "https://cdn0.iconfinder.com/data/icons/graphorama-fruits-7/128/orange-256.png",
    id: 1,
  },
  {
    title: "kiwi",
    price: 125,
    thumbnail:
      "https://cdn2.iconfinder.com/data/icons/fruit-nut/512/28-kiwi-fruit-food-128.png",
    id: 2,
  },
];

//RUTAS
router.get("/productos/vista", (req, res) => {
  try {
    let productExist;
    productos.length === 0 ? (productExist = false) : (productExist = true);
    res.render("main", { productos, productExist });
  } catch (error) {
    console.log(error);
  }
});

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
    return res.status(200).redirect("http://localhost:8080/");
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
