import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { TaskStatus } from "../generated/prisma";

const VALID_TASK_STATUSES = new Set<string>(Object.values(TaskStatus));

function isValidTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && VALID_TASK_STATUSES.has(value);
}

export const createTask = async (req: AuthRequest, res: Response) => {
  const { content, startDate, dueDate, tagId, status } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "Task content is required" });
  }

  if (!startDate || !dueDate) {
    return res.status(400).json({ message: "Start date and due date are required" });
  }

  if (status !== undefined && !isValidTaskStatus(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  if (new Date(dueDate) < new Date(startDate)) {
    return res.status(400).json({ message: "Past due date not allowed" });
  }

  const task = await prisma.task.create({
    data: {
      content: content.trim(),
      startDate,
      dueDate,
      tagId,
      ...(status !== undefined ? { status } : {}),
      userId: req.user!.id,
    },
  });

  res.json(task);
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user!.id },
    include: { tag: true },
    orderBy: { dueDate: "asc" },
  });

  res.json(tasks);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { content, startDate, dueDate, tagId, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  if (status !== undefined && !isValidTaskStatus(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  if (startDate !== undefined && dueDate !== undefined) {
    if (new Date(dueDate) < new Date(startDate)) {
      return res.status(400).json({ message: "Past due date not allowed" });
    }
  }

  const data: {
    content?: string;
    startDate?: string | Date;
    dueDate?: string | Date;
    tagId?: string | null;
    status?: TaskStatus;
  } = {};

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Task content is required" });
    }
    data.content = content.trim();
  }

  if (startDate !== undefined) data.startDate = startDate;
  if (dueDate !== undefined) data.dueDate = dueDate;
  if (tagId !== undefined) data.tagId = tagId;
  if (status !== undefined) data.status = status;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id },
    data,
    include: { tag: true },
  });

  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });

  res.json({ message: "Task deleted" });
};