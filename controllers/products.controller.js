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

//PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES O UNO POR SI ID
const getProducts = async (req, res) => {
  try {
    const idp = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idp) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: await pers.getAllProducts(),
      });
    }

    //SI SE PASA ID COMO PARÁMETRO
    let product = await pers.getOneProduct(idp);
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

//PARA INCORPORAR PRODUCTOS AL LISTADO
const postProducts = async (req, res) => {
  try {
    const newProduct = await pers.postOneProduct(req.body);
    if (newProduct !== null) {
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
        data: newProduct,
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
const putProducts = async (req, res) => {
  try {
    const idp = req.params.id;
    const productUpdate = await pers.putOneProduct(idp, req.body);
    if (productUpdate !== null) {
      return res.status(200).json({
        code: "OK",
        message: null,
        success: true,
        data: productUpdate,
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado o dato faltante",
        success: false,
        data: productUpdate,
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
const deleteProducts = async (req, res) => {
  try {
    const productDelete = await pers.deleteOneProduct(req.params.id);
    if (productDelete !== null) {
      return res.status(200).json({
        code: "OK",
        message: "Producto borrado",
        success: true,
        data: productDelete,
      });
    } else {
      return res.status(404).json({
        code: "NOT FOUND",
        message: "Producto no encontrado",
        success: false,
        data: productDelete,
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
