const fs = require("fs");

//TRAEMOS LOS PRODUCTOS GUARDADOS EN JSON
const jsonProducts = fs.readFileSync("products.json", "utf-8");
const products = JSON.parse(jsonProducts);

//PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES O UNO POR SI ID
const getProducts = (req, res) => {
  try {
    const idp = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idp) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: products,
      });
    }

    let productIndex = products.findIndex((p) => p.id === Number(idp));
    if (productIndex !== -1) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: products[productIndex],
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

//PARA INCORPORAR PRODUCTOS AL LISTADO
const postProducts = (req, res) => {
  try {
    const { nombre, descripcion, foto, precio, stock } = req.body;
    if (nombre && descripcion && foto && precio && stock) {
      const newProduct = {
        id: products[products.length - 1].id + 1 || 1,
        timestamp: Date.now(),
        nombre,
        descripcion,
        codigo: Math.floor(Math.random() * (999 - 1)) + 1,
        foto,
        precio,
        stock,
      };
      products.push(newProduct);
      const newJsonProducts = JSON.stringify(products);
      fs.writeFileSync("products.json", newJsonProducts, "utf-8");
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: newProduct,
      });
    } else {
      return res.status(404).json({
        code: "Error",
        message: "Dato faltante",
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

//PARA ACTUALIZAR UN PRODUCTO POR SI ID
//Suponemos que solo podemos modificar la foto, el precio y el stcok
const putProducts = (req, res) => {
  try {
    const idp = req.params.id;
    const { foto, precio, stock } = req.body;
    const updateProductindex = products.findIndex((p) => p.id === Number(idp));
    if (updateProductindex !== -1 && foto && precio && stock) {
      products[updateProductindex].foto = foto;
      products[updateProductindex].precio = precio;
      products[updateProductindex].stock = stock;
      const newJsonProducts = JSON.stringify(products);
      fs.writeFileSync("products.json", newJsonProducts, "utf-8");
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: products[updateProductindex],
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado o dato faltante",
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

//PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
const deleteProducts = (req, res) => {
  try {
    const idp = req.params.id;
    const updateProductindex = products.findIndex((p) => p.id === Number(idp));
    if (updateProductindex !== -1) {
      products.splice(updateProductindex, 1);
      const newJsonProducts = JSON.stringify(products);
      fs.writeFileSync("products.json", newJsonProducts, "utf-8");
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
  getProducts,
  postProducts,
  putProducts,
  deleteProducts,
};
