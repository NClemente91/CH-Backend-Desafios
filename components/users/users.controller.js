const jwt = require("jsonwebtoken");
const config = require("../../configs/config");

const renderSignUpForm = (req, res) => {
  res.send("Vista del formulario de registro");
};

const signUp = (req, res) => {
  try {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  } catch (error) {
    res.json({
      message: err,
      user: null,
    });
  }
};

const renderSignInForm = (req, res) => {
  res.send("Vista del formulario de ingreso");
};

const signIn = (req, res, next) => {
  try {
    req.login(req.user, { session: false }, (error) => {
      if (error) return next(error);

      const body = { _id: req.user._id, email: req.user.email };
      const token = jwt.sign({ user: body }, config.SECRET, {
        expiresIn: config.TOKEN_EXPIRE,
      });

      return res.json({ token });
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  res.send("Logout");
};

// //-----Login
// router.get("/login", async (req, res) => {
//   if (req.isAuthenticated()) {
//     const nombre = req.user.username;
//     try {
//       res.render("pages/index", { nombre });
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     res.sendFile(process.cwd() + "/public/login.html");
//   }
// });

// router.post(
//   "/login",
//   passport.authenticate("login", { failureRedirect: "/faillogin" }),
//   (req, res) => {
//     let { email } = req.body;
//     req.session.nombre = email;
//     res.redirect("/login");
//   }
// );

// router.get("/faillogin", (req, res) => {
//   res.render("pages/login-error");
// });

// //-----Register
// router.get("/register", (req, res) => {
//   res.sendFile(process.cwd() + "/public/register.html");
// });

// router.post(
//   "/register",
//   passport.authenticate("register", { failureRedirect: "/failregister" }),
//   (req, res) => {
//     res.redirect("/login");
//   }
// );

// router.get("/failregister", (req, res) => {
//   res.render("pages/register-error");
// });

// //-----Logout
// router.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (!err) res.render("pages/logout");
//     else res.redirect("/");
//   });
// });

module.exports = {
  renderSignUpForm,
  signUp,
  renderSignInForm,
  signIn,
  logout,
};
