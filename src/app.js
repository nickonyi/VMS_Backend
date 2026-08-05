import express from "express";
import "dotenv/config";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";
import passport from "passport";

const app = express();

app.use(sessionMiddleware);
app.use(passport);

app.use(express.json());

export default app;
