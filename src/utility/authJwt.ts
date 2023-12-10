
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
 * authJwt.ts
 */

import jwt from 'jsonwebtoken';
import cookieConfig from '../config/auth.config';
import db from '../models';
import { Request, Response, NextFunction } from "express";
import logger from "../middleware/logger";

const User = db.user;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  logger.log('info', 'Request: ' + req);
  logger.log('info', 'Token: ' + req.session.token);


  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
             cookieConfig.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              // @ts-ignore - decoded from jwt
               req.userId = decoded.id;
              // @ts-ignore
               req.ownerId = decoded.owner;
              next();
             });
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
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

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
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

const isAgent = async (req: Request, res: Response, next: NextFunction) => {
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
const isMonitor = async (req: Request, res: Response, next: NextFunction) => {
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


const authJwt = {
  verifyToken,
  isAdmin,
  isOwner,
  isAgent,
  isMonitor
};

export default authJwt;
