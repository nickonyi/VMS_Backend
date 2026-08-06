import express from "express";
import cors from "cors";
import "dotenv/config";
import { sessionMiddleware } from "./middlewares/sessionMiddleware.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import passRoutes from "./routes/passRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleWare.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(sessionMiddleware);
app.use(passport.session());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pass", passRoutes);

app.use(globalErrorHandler);

export default app;
