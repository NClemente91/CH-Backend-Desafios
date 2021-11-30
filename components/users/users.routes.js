const express = require("express");
const passport = require("passport");
const router = express.Router();

//RUTAS
//-----Login
router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) {
    const nombre = req.user.username;
    try {
      res.render("pages/index", { nombre });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.sendFile(process.cwd() + "/public/login.html");
  }
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    let { email } = req.body;
    req.session.nombre = email;
    res.redirect("/login");
  }
);

router.get("/faillogin", (req, res) => {
  res.render("pages/login-error");
});

//-----Register
router.get("/register", (req, res) => {
  res.sendFile(process.cwd() + "/public/register.html");
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.redirect("/login");
  }
);

router.get("/failregister", (req, res) => {
  res.render("pages/register-error");
});

//-----Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.render("pages/logout");
    else res.redirect("/");
  });
});

module.exports = router;
