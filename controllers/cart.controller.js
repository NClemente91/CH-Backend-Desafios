const persFS = require("../persistence/fileSystem/fileSystem");
const persFirebase = require("../persistence/firebase/firebase");
const persMemoria = require("../persistence/memoria/memoria");
const persMongoDBDBaaS = require("../persistence/mongoDBDBaaS/mongoDBDBaaS");
const persMongoDBLocal = require("../persistence/mongoDBLocal/mongoDBLocal");
const persMySQLDBaaS = require("../persistence/mySQLLocal/mySQLLocal");
const persMySQLLocal = require("../persistence/mySQLLocal/mySQLLocal");
const persSQLite3 = require("../persistence/sqLite3/sqLite3");

let pers;

(function Factory(P) {
  switch (P) {
    case "0":
      pers = new persMemoria();
      break;
    case "1":
      pers = new persFS();
      break;
    case "2":
      pers = new persMySQLLocal();
      break;
    case "3":
      pers = new persMySQLDBaaS();
      break;
    case "4":
      pers = new persSQLite3();
      break;
    case "5":
      pers = new persMongoDBLocal();
      break;
    case "6":
      pers = new persMongoDBDBaaS();
      break;
    case "7":
      pers = new persFirebase();
      break;
  }
})(process.env.PERSISTENCIA);

//PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO O UNO POR SI ID GUARDADO EN EL CARRITO
const getProductsCart = async (req, res) => {
  try {
    const idc = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idc) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: await pers.getAllProductsCart(),
      });
    }

    //SI SE PASA ID COMO PARÁMETRO
    let product = await pers.getOneProductCart(idc);
    if (product !== null) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: product,
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado",
        success: false,
        data: product,
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
const postProductsCart = async (req, res) => {
  try {
    const idp = req.params.id_producto;

    const addProduct = await pers.postOneProductCart(idp);

    if (addProduct !== null) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: addProduct,
      });
    } else {
      return res.status(404).json({
        code: "Error",
        message: "Producto para agregar no encontrado",
        success: false,
        data: addProduct,
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
const deleteProductsCart = async (req, res) => {
  try {
    const idp = req.params.id_producto;
    const deleteProductIndex = await pers.deleteOneProductCart(idp);
    if (deleteProductIndex !== null) {
      return res.status(200).json({
        code: "OK",
        message: "Producto borrado",
        success: true,
        data: deleteProductIndex,
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado",
        success: false,
        data: deleteProductIndex,
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
