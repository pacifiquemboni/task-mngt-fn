import express from "express";
import { register, login } from "../controllers/auth";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task";
import { createTag, getTags, deleteTag } from "../controllers/tag";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/tasks", auth, createTask);
router.get("/tasks", auth, getTasks);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, deleteTask);

router.post("/tags", auth, createTag);
router.get("/tags", auth, getTags);
router.delete("/tags/:id", auth, deleteTag);

export default router;