import express from "express";
import "dotenv/config";
import { sessionMiddleware } from "./middlewares/sessionMiddleware.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleWare.js";

const app = express();

app.use(sessionMiddleware);
app.use(passport.session());

app.use(express.json());

app.use("/auth", authRoutes);

app.use(globalErrorHandler);

export default app;
