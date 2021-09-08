const fs = require("fs");

//TRAEMOS LOS PRODUCTOS GUARDADOS EN JSON
const jsonProducts = fs.readFileSync("products.json", "utf-8");
const products = JSON.parse(jsonProducts);

//TRAEMOS EL CARRITO GUARDADO EN JSON
const jsonCart = fs.readFileSync("cart.json", "utf-8");
const cart = JSON.parse(jsonCart);

//PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO O UNO POR SI ID GUARDADO EN EL CARRITO
const getProductsCart = (req, res) => {
  try {
    const idc = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idc) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: cart[0].producto,
      });
    }

    let productIndex = cart[0].producto.findIndex((p) => p.id === Number(idc));
    if (productIndex !== -1) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: cart[0].producto[productIndex],
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "ERROR",
      message: error.message,
      success: false,
      data: null,
    });
  }
};

//PARA INCORPORAR PRODUCTOS AL CARRITO POR SU ID
const postProductsCart = (req, res) => {
  try {
    const idp = req.params.id_producto;
    const addProductIndex = products.findIndex((p) => p.id === Number(idp));
    if (addProductIndex !== -1 && cart.length === 0) {
      const newCart = {
        id: 1,
        timestamp: Date.now(),
        producto: [products[addProductIndex]],
      };
      const newJsonCart = JSON.stringify(newCart);
      fs.writeFileSync("cart.json", newJsonCart, "utf-8");
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: newCart,
      });
    } else if (addProductIndex !== -1 && cart.length !== 0) {
      cart[0].producto.push(products[addProductIndex]);
      const newJsonCart = JSON.stringify(cart);
      fs.writeFileSync("cart.json", newJsonCart, "utf-8");
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: cart,
      });
    } else {
      return res.status(404).json({
        code: "Error",
        message: "Producto para agregar no encontrado",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "ERROR",
      message: error.message,
      success: false,
      data: null,
    });
  }
};

//PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
const deleteProductsCart = (req, res) => {
  try {
    const idp = req.params.id_producto;
    const deleteProductIndex = cart[0].producto.findIndex(
      (p) => p.id === Number(idp)
    );
    if (deleteProductIndex !== -1) {
      cart[0].producto.splice(deleteProductIndex, 1);
      const newJsonCart = JSON.stringify(cart);
      fs.writeFileSync("cart.json", newJsonCart, "utf-8");
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: null,
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "ERROR",
      message: error.message,
      success: false,
      data: null,
    });
  }
};

module.exports = {
  getProductsCart,
  postProductsCart,
  deleteProductsCart,
};
