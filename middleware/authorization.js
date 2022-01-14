const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const config = require("../configs/config");

const User = require("../components/users/users.model");

//Strategy para el signup de usuario
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const newUser = new User();
        newUser.email = email;
        newUser.password = await newUser.encryptPassword(password);
        newUser.username = req.body.username;
        newUser.address = req.body.address;
        newUser.age = req.body.age;
        newUser.phoneNumber = req.body.phoneNumber;
        newUser.avatar = req.body.avatar;
        const user = await newUser.save();
        return done(null, user, { message: "User created successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Strategy para el signin de usuario
passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Not User found." });
        } else {
          const match = await user.matchPassword(password);
          if (match) {
            return done(null, user, { message: "Signin successfully" });
          } else {
            return done(null, false, { message: "Incorrect Password." });
          }
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "jwt",
  new JWTstrategy(
    {
      secretOrKey: config.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
