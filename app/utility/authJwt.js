
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

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              req.ownerId = decoded.owner;
              next();
             });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator role!",
    });
  }
};

// New
isOwner = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "owner") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Owner Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Owner role!",
    });
  }
};

// New
isAgent = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "agent") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Agent Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Agent role!",
    });
  }
};

// New
isMonitor = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "monitor") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Monitor Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Monitor role!",
    });
  }
};

isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator or Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isOwner, // New
  isAgent, // New
  isMonitor, // New
  isModerator,
  isModeratorOrAdmin,
};
module.exports = authJwt;
