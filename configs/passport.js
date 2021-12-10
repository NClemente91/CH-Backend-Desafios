const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");

const User = require("../persistencia/mongoDBBaaS/models/users");

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("User Not Found with username " + username);
          console.log("message", "User Not found.");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          console.log("Invalid Password");
          console.log("message", "Invalid Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      const findOrCreateUser = () => {
        User.findOne({ username: username }, (err, user) => {
          if (err) {
            console.log("Error in SignUp: " + err);
            return done(err);
          }
          if (user) {
            console.log("User already exists");
            console.log("message", "User Already Exists");
            return done(null, false);
          } else {
            const newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return done(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
