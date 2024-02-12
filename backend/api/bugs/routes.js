import express from "express";
import {
  addBug,
  getBug,
  getBugs,
  removeBug,
  updateBug,
} from "./Bug.controller.js";

const router = express.Router();

router.get("/", getBugs);
router.get("/:BugId", getBug);
router.delete("/:BugId", removeBug);
router.post("/", addBug);
router.put("/", updateBug);

export const BugRoutes = router;
