import express from "express";
import cors from "cors";
import "dotenv/config";
import { sessionMiddleware } from "./middlewares/sessionMiddleware.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import guardRoutes from "./routes/guardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleWare.js";
import { requireRole } from "./middlewares/roleMiddleware.js";
import { ensureAuth } from "./middlewares/authMiddleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vms-one-navy.vercel.app"],
    credentials: true,
  }),
);

app.use(sessionMiddleware);
app.use(passport.session());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resident", ensureAuth, requireRole("resident"), residentRoutes);
app.use("/api/guard", ensureAuth, requireRole("guard"), guardRoutes);
app.use("/api/admin", ensureAuth, requireRole("admin"), adminRoutes);

app.use(globalErrorHandler);

export default app;
