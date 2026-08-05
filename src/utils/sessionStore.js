import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pool from "../db/pool";

const PgsessionStore = connectPgSimple(session);

export const createSessionStore = () => {
  return new PgsessionStore({
    pool,
    tableName: "sessions",
    createTableIfMissing: true,
  });
};
