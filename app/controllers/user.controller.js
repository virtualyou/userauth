
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

const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.ownerBoard = (req, res) => {
  res.status(200).send("Owner dashboard for signed in user.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin dashboard for signed in user.");
};

exports.agentBoard = (req, res) => {
  res.status(200).send("Agent dashboard for signed in user.");
};

exports.monitorBoard = (req, res) => {
  res.status(200).send("Monitor dashboard for signed in user.");
};

// ROLE_ADMIN ONLY (needs authorization)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ROLE_ANY (still needs authorization in production)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// ROLE_ANY (still needs authorization in production)
exports.getUserRoles = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const roles = await user.getRoles();
    if (!roles) {
      return res.status(404).json({ error: 'User roles not found' });
    }
    return res.json(roles);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

