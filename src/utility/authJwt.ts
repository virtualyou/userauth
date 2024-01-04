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
 * authJwt
 */

import jwt from "jsonwebtoken";
import cookieConfig from "../config/auth.config";
import { Request, Response, NextFunction } from "express";
import logger from '../middleware/logger';
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    logger.log('info', 'checking for a token in userauth API');

    const token = req.session.token;

    if (!token) {
        logger.log('info', 'no token in userauth API');
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    logger.log('info', 'we have a token in userauth API');

    jwt.verify(token,
        cookieConfig.secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, decoded: any) => {
            if (err) {
                console.log("JWT did not verify!");
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }

            req.userId = decoded.id;
            req.ownerId = decoded.owner;
            req.role = decoded.role;

            logger.log('info', 'userId=' + req.userId);
            logger.log('info', 'ownerId=' + req.ownerId);
            logger.log('info', 'role=' + req.role);

            next();
        });
};

// TODO -> refactor into one method to reduce code duplication
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.role;

        if (role === "admin") {
            return next();
        }

        return res.status(403).send({
            message: "Require Admin Role!",
        });

    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Admin role!",
        });
    }
};

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.role;

        if (role === 'owner') {
            return next();
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

const isOwnerOrAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.role;
        if (role === "owner" || role === "agent") {
            return next();
        }

        return res.status(403).send({
            message: "Requires either Owner or Agent Role!",
        });

    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Owner or Agent roles!",
        });
    }
};

const isOwnerOrAgentOrMonitor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.role;

        if (role === "owner" || role === "agent" || role === "monitor") {
            return next();
        }

        return res.status(403).send({
            message: "Requires either Owner, Agent, or Monitor Role!",
        });

    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Owner, Agent, or Monitor roles!",
        });
    }
};

const isAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.role;

        if (role === "agent") {
            return next();
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


const isMonitor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.log('info', 'in isMonitor in userauth API');

        const role = req.role;

        if (role === "monitor") {
            logger.log('info', 'in isMonitor we have a monitor role in userauth API');
            return next();
        }

        logger.log('info', 'in isMonitor and we do not have a monitor role in userauth API');

        return res.status(403).send({
            message: "Require Monitor Role!",
        });

    } catch (error) {
        logger.log('info', 'in isMonitor and something is really wrong in userauth API');

        return res.status(500).send({
            message: "Unable to validate Monitor role!",
        });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isOwner,
    isOwnerOrAgent,
    isOwnerOrAgentOrMonitor,
    isAgent,
    isMonitor,
};

export default authJwt;
