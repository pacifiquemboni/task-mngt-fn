import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export const createTask = async (req: AuthRequest, res: Response) => {
  const { content, startDate, dueDate, tagId } = req.body;

  if (new Date(dueDate) < new Date()) {
    return res.status(400).json({ message: "Past due date not allowed" });
  }

  const task = await prisma.task.create({
    data: {
      content,
      startDate,
      dueDate,
      tagId,
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
  const { content, startDate, dueDate, tagId } = req.body;

  const task = await prisma.task.update({
    where: { id, userId: req.user!.id },
    data: { content, startDate, dueDate, tagId },
    include: { tag: true },
  });

  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  await prisma.task.delete({ where: { id, userId: req.user!.id } });

  res.json({ message: "Task deleted" });
};