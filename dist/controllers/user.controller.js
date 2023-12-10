"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const User = models_1.default.user;
const allAccess = (_req, res) => {
  res.status(200).send("Public Content.");
};
const ownerBoard = (_req, res) => {
  res.status(200).send("Owner dashboard for signed in user.");
};
const adminBoard = (_req, res) => {
  res.status(200).send("Admin dashboard for signed in user.");
};
const agentBoard = (_req, res) => {
  res.status(200).send("Agent dashboard for signed in user.");
};
const monitorBoard = (_req, res) => {
  res.status(200).send("Monitor dashboard for signed in user.");
};
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal server error." });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params["id"]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
const getUserRoles = async (req, res) => {
  try {
    const user = await User.findByPk(req.params["id"]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const roles = await user.getRoles();
    if (!roles) {
      return res.status(404).json({ error: "User roles not found" });
    }
    return res.json(roles);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
const userController = {
  allAccess,
  ownerBoard,
  agentBoard,
  monitorBoard,
  adminBoard,
  getUserRoles,
  getUserById,
  getAllUsers,
};
exports.default = userController;
//# sourceMappingURL=user.controller.js.map
