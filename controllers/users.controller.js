const { findAllProduct } = require("../store/products.store");

const getlogin = async (req, res) => {
  if (req.isAuthenticated()) {
    const nombre = req.user.username;
    try {
      const cant = req.query.cant;
      if (cant === "0") {
        let productExist = false;
        res.render("pages/index", { productExist, nombre });
      } else if (!cant) {
        let productExist = true;
        let productos = await findAllProduct();
        res.render("pages/index", { productos, productExist, nombre });
      } else {
        let productExist = true;
        let productos = await findAllProduct();
        res.render("pages/index", { productos, productExist, nombre });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.sendFile(process.cwd() + "/public/login.html");
  }
};

const postLogin = (req, res) => {
  let { nombre } = req.body;
  req.session.nombre = nombre;
  res.redirect("/login");
};

const failLogin = (req, res) => {
  res.render("pages/login-error");
};

const getRegister = (req, res) => {
  res.redirect("/login");
};

const failRegister = (req, res) => {
  res.render("pages/register-error");
};

const logout = (req, res) => {
  let nombre = req.user.username;
  if (nombre) {
    req.session.destroy((err) => {
      if (!err) res.render("pages/logout", { nombre });
      else res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
};

module.exports = {
  getlogin,
  postLogin,
  failLogin,
  getRegister,
  failRegister,
  logout,
};
