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
 * user.routes.ts
 */
import { NextFunction, Request, Response } from "express";
import express from "express";
import userController from "../controllers/user.controller";
import authJwt from "../utility/authJwt";

const userRouter = express();

userRouter.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

userRouter.get("/userauth/v1/all", userController.allAccess);

userRouter.get(
  "/userauth/v1/owner",
  [authJwt.verifyToken, authJwt.isOwner],
  userController.ownerBoard
);

userRouter.get(
  "/userauth/v1/agent",
  [authJwt.verifyToken, authJwt.isAgent],
  userController.agentBoard
);

userRouter.get(
  "/userauth/v1/monitor",
  [authJwt.verifyToken, authJwt.isMonitor],
  userController.monitorBoard
);

userRouter.get(
  "/userauth/v1/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.adminBoard
);

// admin only
userRouter.get(
  "/userauth/v1/users",
  [authJwt.verifyToken], //, authJwt.isAdmin],
  userController.getAllUsers
);

userRouter.get(
    "/userauth/v1/users/:id/roles",
    [authJwt.verifyToken],
    userController.getUserRoles
);

// ************************************************************
// FOR APPLICATION USE ONLY

userRouter.get(
  "/userauth/v1/users/:id",
  [authJwt.isApp],
  userController.getUserById
);

userRouter.get(
    "/userauth/v1/users/agents/:ownerid",
    [authJwt.isApp],
    userController.getAgentByOwnerId
);

userRouter.get(
    "/userauth/v1/users/monitors/:ownerid",
    [authJwt.isApp],
    userController.getMonitorByOwnerId
);

// PUT - update a user
userRouter.put(
    "/userauth/v1/users/:id",
    [authJwt.isApp],
    userController.updateUser
);

export default userRouter;
