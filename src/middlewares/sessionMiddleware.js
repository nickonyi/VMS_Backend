import session from "express-session";
import { createSessionStore } from "../utils/sessionStore";

export const sessionMiddleware = session({
  name: "connect.sid",
  store: createSessionStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
