import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../lib/prisma.js";
import { getUserById, validateUser } from "../services/authService.js";
import { verifyPassword } from "../utils/hash.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await validateUser(email, password, verifyPassword);

        if (!user) {
          return done(null, false, {
            message: "Invalid credentials",
          });

          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);

  try {
    if (!user) {
      return done(false, null);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
