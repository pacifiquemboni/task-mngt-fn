import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export const createTag = async (req: AuthRequest, res: Response) => {
  const { name, color } = req.body;

  const tag = await prisma.tag.create({
    data: {
      name,
      color,
      userId: req.user!.id,
    },
  });

  res.json(tag);
};

export const getTags = async (req: AuthRequest, res: Response) => {
  const tags = await prisma.tag.findMany({
    where: { userId: req.user!.id },
  });

  res.json(tags);
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
  const idParam = req.params.id;

  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ message: "Invalid tag id" });
  }

  const id = idParam;

  await prisma.tag.delete({ where: { id, userId: req.user!.id } });

  res.json({ message: "Tag deleted" });
};
