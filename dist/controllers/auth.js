"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: { name, email, password: hashed },
    });
    res.json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
};
exports.login = login;
