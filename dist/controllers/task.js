"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createTask = async (req, res) => {
    const { content, startDate, dueDate, tagId } = req.body;
    if (new Date(dueDate) < new Date()) {
        return res.status(400).json({ message: "Past due date not allowed" });
    }
    const task = await prisma_1.default.task.create({
        data: {
            content,
            startDate,
            dueDate,
            tagId,
            userId: req.user.id,
        },
    });
    res.json(task);
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    const tasks = await prisma_1.default.task.findMany({
        where: { userId: req.user.id },
        include: { tag: true },
        orderBy: { dueDate: "asc" },
    });
    res.json(tasks);
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { content, startDate, dueDate, tagId } = req.body;
    const task = await prisma_1.default.task.update({
        where: { id, userId: req.user.id },
        data: { content, startDate, dueDate, tagId },
        include: { tag: true },
    });
    res.json(task);
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma_1.default.task.delete({ where: { id, userId: req.user.id } });
    res.json({ message: "Task deleted" });
};
exports.deleteTask = deleteTask;
