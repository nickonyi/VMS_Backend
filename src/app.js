import express from "express";
import "dotenv/config";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";
import passport from "./config/passportConfig.js";

const app = express();

app.use(sessionMiddleware);
app.use(passport.session());

app.use(express.json());

export default app;
