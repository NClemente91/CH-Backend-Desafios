const passport = require("passport");
const bCrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const gmail = require("../configs/email/gmail");

const User = require("../components/users/users.model");
const { loggerInfo, loggerWarn, loggerError } = require("./loggers");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          loggerInfo.info(`User Not Found with email ${email}`);
          loggerWarn.warn(`User Not Found with email ${email}`);
          return done(null, false, {
            message: `User Not Found with email ${email}`,
          });
        }
        if (!isValidPassword(user, password)) {
          loggerInfo.info(`Invalid Password`);
          loggerError.error(`Invalid Password`);
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    (req, email, password, done) => {
      const findOrCreateUser = () => {
        User.findOne({ email: email }, (err, user) => {
          if (err) {
            loggerInfo.info(`Error in SignUp ${err}`);
            loggerError.error(`Error in SignUp ${err}`);
            return done(err);
          }
          if (user) {
            loggerInfo.info(`User already exists`);
            loggerWarn.warn(`User already exists`);
            return done(null, false);
          } else {
            const newUser = new User();
            newUser.email = email;
            newUser.password = createHash(password.toString());
            newUser.username = req.body.username;
            newUser.address = req.body.address;
            newUser.age = req.body.age;
            newUser.phoneNumber = req.body.phone;
            newUser.avatar = req.body.avatar;
            newUser.save((err) => {
              if (err) {
                loggerInfo.info(`Error in Saving user ${err}`);
                loggerError.error(`Error in Saving user ${err}`);
                throw err;
              }
              const asunto = "Nuevo Registro";
              const to = process.env.EMAIL_ADMIN;
              let mensaje = `Se registró un nuevo usuario cuyo email es ${
                newUser.email
              } en la fecha ${new Date().toLocaleString()}`;
              let adjunto = "";
              gmail.enviarMail(asunto, mensaje, adjunto, to, (err, info) => {
                if (err) {
                  loggerInfo.info(`Error en nodemailer-gmail ${err}`);
                  loggerError.error(`Error en nodemailer-gmail ${err}`);
                } else {
                  loggerInfo.info(`Email enviado con nodemailer-gmail ${info}`);
                }
              });

              loggerInfo.info(`User Registration succesful`);
              return done(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
