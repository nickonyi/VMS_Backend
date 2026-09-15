import { Router } from "express";
import {
  getAccessStatus,
  getProperties,
  postPropertyAccessRequest,
} from "../controllers/propertyController.js";

const router = Router();

router.get("/", getProperties);

router.post("/:id/access", postPropertyAccessRequest);
router.get("/access", getAccessStatus);

export default router;
