const generador = require("../generador/generador");

const {
  findAllProduct,
  findOneProductbyID,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
} = require("../store/products.store");

const getVistaTest = (req, res) => {
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
};

const getAllProducts = async (req, res) => {
  try {
    const products = await findAllProduct();
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
};

const getOneProduct = async (req, res) => {
  try {
    const product = await findOneProductbyID(req.params.id);
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
};

const postOneProduct = async (req, res) => {
  try {
    const prod = req.body;
    prod.price = Number(prod.price);
    const product = await createProduct(prod);
    return res.status(200).redirect("http://localhost:5000/");
  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: "Error al ingresar el producto",
      success: false,
      data: null,
    });
  }
};

const putOneProduct = async (req, res) => {
  try {
    const product = await updateOneProduct(
      { _id: req.params.id },
      { ...req.body }
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
};

const delOneProduct = async (req, res) => {
  try {
    const productDelete = await deleteOneProduct({ _id: req.params.id });
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
};

module.exports = {
  getVistaTest,
  getAllProducts,
  getOneProduct,
  postOneProduct,
  putOneProduct,
  delOneProduct,
};
