const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const config = require("../configs/config");

const { encryptPassword, matchPassword } = require("../configs/bcrypt");

const {
  findOneUser,
  createOneUser,
} = require("../components/users/users.store");

//Strategy for registering an user
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const newUser = {
          email,
          password: await encryptPassword(password),
          username: req.body.username,
          address: req.body.address,
          age: req.body.age,
          phoneNumber: req.body.phoneNumber,
          avatar: req.body.avatar,
        };
        const user = await createOneUser(newUser);
        return done(null, user, { message: "User created successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Strategy for user login
passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await findOneUser(email);
        if (!user) {
          return done(null, false, { message: "Not User found." });
        } else {
          const match = await matchPassword(user, password);
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

//Strategy for using JWT
passport.use(
  "jwt",
  new JWTstrategy(
    {
      secretOrKey: config.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload.user);
      } catch (error) {
        return done(error);
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
