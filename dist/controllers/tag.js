"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.getTags = exports.createTag = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createTag = async (req, res) => {
    const { name, color } = req.body;
    const tag = await prisma_1.default.tag.create({
        data: {
            name,
            color,
            userId: req.user.id,
        },
    });
    res.json(tag);
};
exports.createTag = createTag;
const getTags = async (req, res) => {
    const tags = await prisma_1.default.tag.findMany({
        where: { userId: req.user.id },
    });
    res.json(tags);
};
exports.getTags = getTags;
const deleteTag = async (req, res) => {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ message: "Invalid tag id" });
    }
    const id = idParam;
    await prisma_1.default.tag.delete({ where: { id, userId: req.user.id } });
    res.json({ message: "Tag deleted" });
};
exports.deleteTag = deleteTag;
