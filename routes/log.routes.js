const express = require("express");
const router = express.Router();
const Producto = require("../models/productos");

const getNombreSession = (req) =>
  req.session.nombre ? req.session.nombre : "";

//RUTAS

router.get("/login", async (req, res) => {
  if (req.session.nombre) {
    const nombre = req.session.nombre;
    try {
      const cant = req.query.cant;
      if (cant === "0") {
        let productExist = false;
        res.render("pages/index", { productExist, nombre });
      } else if (!cant) {
        let productExist = true;
        let productos = await Producto.find();
        res.render("pages/index", { productos, productExist, nombre });
      } else {
        let productExist = true;
        let productos = await Producto.find();
        res.render("pages/index", { productos, productExist, nombre });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.sendFile(process.cwd() + "/public/login.html");
  }
});

router.post("/login", (req, res) => {
  let { nombre } = req.body;
  req.session.nombre = nombre;
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  let nombre = getNombreSession(req);
  if (nombre) {
    req.session.destroy((err) => {
      if (!err) res.render("pages/logout", { nombre });
      else res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
