import passport from "passport";
import jwt from "passport-jwt";
import localStrategy from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { JWT_SECRET } from "../utils/jwtFunctions.js";
import { verifyPassword, createHash } from "../utils/hash.functions.js";

const LocalStrategy = localStrategy.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

function initializePassport() {
  const cookieExtractor = (req, res) => {
    return req && req.cookies ? req.cookies.token : null;
  };

  // JWT Strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,
      },
      async (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });

          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          const isPasswordCorrect = await verifyPassword(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, user);
        } catch (error) {
          return done(`Error: ${error.message}`);
        }
      }
    )
  );
  //Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;

          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false, {
              message: "All fields are required",
            });
          }

          const userExists = await userModel.findOne({ email });

          if (userExists) {
            return done(null, false, { message: "User already exists" });
          }

          const hashPassword = await createHash(password);

          const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            role,
            password: hashPassword,
          });

          return done(null, user);
        } catch (error) {
          return done(null, false, { message: `Error: ${error.message}` });
        }
      }
    )
  );

  //Serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);

      return done(null, user);
    } catch (error) {
      return done(`Error: ${error.message}`);
    }
  });
}

export { initializePassport };
