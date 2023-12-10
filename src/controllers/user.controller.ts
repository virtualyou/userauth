/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Request, Response } from "express";
import db from "../models";

const User = db.user;

const allAccess = (_req: Request, res: Response) => {
  res.status(200).send("Public Content.");
};

const ownerBoard = (_req: Request, res: Response) => {
  res.status(200).send("Owner dashboard for signed in user.");
};

const adminBoard = (_req: Request, res: Response) => {
  res.status(200).send("Admin dashboard for signed in user.");
};

const agentBoard = (_req: Request, res: Response) => {
  res.status(200).send("Agent dashboard for signed in user.");
};

const monitorBoard = (_req: Request, res: Response) => {
  res.status(200).send("Monitor dashboard for signed in user.");
};

// ROLE_ADMIN ONLY (needs authorization)
const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal server error." });
  }
};

// ROLE_ANY (still needs authorization in production)
const getUserById = async (req: Request, res: Response) => {
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

// ROLE_ANY (still needs authorization in production)
const getUserRoles = async (req: Request, res: Response) => {
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

  // these are important, the above may go away
  getUserRoles,
  getUserById,
  getAllUsers,
};

export default userController;
