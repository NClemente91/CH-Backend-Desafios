const express = require("express");
const router = express.Router();
const Producto = require("../models/productos");
const generador = require("../generador/generador");

//RUTAS

//Ruta para desafio clase 22
router.get("/productos/vista-test", (req, res) => {
  try {
    const cant = req.query.cant;
    if (cant === "0") {
      let productExist = false;
      res.render("pages/index", { productExist });
    } else if (!cant) {
      let productExist = true;
      let productos = [];
      for (let i = 0; i < 10; i++) {
        let newProduct = generador.getFaker();
        productos.push(newProduct);
      }
      res.render("pages/index", { productos, productExist });
    } else {
      let productExist = true;
      let productos = [];
      for (let i = 0; i < cant; i++) {
        let newProduct = generador.getFaker();
        productos.push(newProduct);
      }
      res.render("pages/index", { productos, productExist });
    }
  } catch (error) {
    console.log(error);
  }
});

//Ruta para mostrar todos los productos
router.get("/productos/listar", async (req, res) => {
  try {
    const products = await Producto.find();
    return res.status(200).json({
      code: "OK",
      message: null,
      success: true,
      data: { products },
    });
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Internal Server Error",
      success: false,
      data: null,
    });
  }
});

//Ruta para mostrar un producto en particular
router.get("/productos/listar/:id", async (req, res) => {
  try {
    const product = await Producto.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        code: "NOT-FOUND",
        message: "Not Found",
        success: false,
        data: null,
      });
    }
    return res.status(200).json({
      code: "OK",
      message: null,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Internal Server Error",
      success: false,
      data: null,
    });
  }
});

//Ruta para cargar un producto
router.post("/productos/guardar/", async (req, res) => {
  try {
    const prod = req.body;
    prod.price = Number(prod.price);
    const product = await Producto.create(prod);
    return res.status(200).redirect("http://localhost:5050/");
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Error al ingresar el producto",
      success: false,
      data: null,
    });
  }
});

//Ruta para actualizar un producto
router.put("/productos/actualizar/:id", async (req, res) => {
  try {
    const product = await Producto.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        code: "NOT-FOUND",
        message: "Not Found",
        success: false,
        data: null,
      });
    }
    return res.status(200).json({
      code: "OK",
      message: null,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Internal Server Error",
      success: false,
      data: null,
    });
  }
});

//Ruta para borrar un producto
router.delete("/productos/borrar/:id", async (req, res) => {
  try {
    const productDelete = await Producto.deleteOne({ _id: req.params.id });
    if (productDelete.n === 0) {
      return res.status(404).json({
        code: "NOT-FOUND",
        message: "Not Found",
        success: false,
        data: null,
      });
    } else {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Internal Server Error",
      success: false,
      data: null,
    });
  }
});

module.exports = router;
