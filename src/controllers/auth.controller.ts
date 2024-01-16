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
 * auth.controller.ts
 */
import db from "../models";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as bip39 from "bip39"; // TODO read about the syntax here
import cookieConfig from "../config/auth.config";
import logger from '../middleware/logger';
import { createAgent, createMonitor } from './support/auth.support';
import CryptoUtils from "../utility/crypto.utils";

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

class ExpressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExpressError';
    }
}

const errorHandler = (err: ExpressError, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
};

const signup = async (req: Request, res: Response) => {
    // Save User to Database
    try {
        const mnemonic1 = bip39.generateMnemonic();
        const mnemonic2 = bip39.generateMnemonic();

        let agentActive = false;
        if (req.body.agentOwnerId !== 0) {
            agentActive = true;
        }

        let monitorActive = false;
        if (req.body.monitorOwnerId !== 0) {
            monitorActive = true;
        }

        let _ownerId = req.body.ownerId;

        if (req.body.roles[0] == 'admin') {
            _ownerId = "-1";
        }

        const user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            ownerId: _ownerId,
            agentOwnerId: req.body.agentOwnerId,
            monitorOwnerId: req.body.monitorOwnerId,
            agentActive: agentActive,
            monitorActive: monitorActive,
            agentMnemonic: mnemonic1,
            monitorMnemonic: mnemonic2,
            agentId: 0,
            monitorId: 0,
            mfa: CryptoUtils.createThreeDigitRandomInteger(),
        });

        // user could have multiple roles
        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            // set roles plural (NOT VIA UI)
            const result = user.setRoles(roles);
            if (result) {
                res.send({message: "User registered successfully!"});
            }
        } else {
            // user only one role (DEFAULT)
            const result = user.setRoles([1]);
            if (result) {
                res.send({message: "User registered successfully!"});
            }
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
};

const agentSignup = async (req: Request, res: Response) => {
    const ownerId = req.body.agentOwnerId;

    try {
        const user = await createAgent(req.body);

        if (user) {
            res.send({message: "User registered successfully!"});

            // agent id
            const agentId = user.id;
            User.update({agentId: agentId}, {
                where: {
                    id: ownerId
                }
            }).then((num: number) => {
                if (num == 1) {
                    logger.log('info', 'Owner was updated successfully!');
                } else {
                    logger.log('info', 'Owner could not be found!');
                }
            }).catch((err: ExpressError) => {
                errorHandler(err, req, res);
            });
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

const monitorSignup = async (req: Request, res: Response) => {
    const ownerId = req.body.monitorOwnerId;

    try {
        const user = await createMonitor(req.body);

        if (user) {
            res.send({message: "User registered successfully!"});

            // monitor id
            const monitorId = user.id;
            User.update({monitorId: monitorId}, {
                where: {
                    id: ownerId
                }
            }).then((num: number) => {
                if (num == 1) {
                    logger.log('info', 'Owner was updated successfully!');
                } else {
                    logger.log('info', 'Owner could not be found!');
                }
            }).catch((err: ExpressError) => {
                errorHandler(err, req, res);
            });
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

const signin = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password!",
            });
        }

        const authorities = [];
        const roles = await user.getRoles();
        let newrole;

        for (let i = 0; i < roles.length; i++) {
            newrole = roles[i].name;
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        let _ownerid;

        if (newrole === "agent") {
            _ownerid = user.agentOwnerId;
        }
        if (newrole === "monitor") {
            _ownerid = user.monitorOwnerId;
        }
        if (newrole === "owner") {
            _ownerid = user.id;
        }


        const token = jwt.sign(
            {id: user.id, owner: _ownerid, role: newrole},
            cookieConfig.secret,
            {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            }
        );

        req.session.token = token;

        res.set(
            "Access-Control-Allow-Origin",
            process.env["ACCESS_CONTROL_ALLOW_ORIGIN"]
        );
        res.set("Access-Control-Allow-Credentials", "true");

        return res.status(200).send({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            roles: authorities,
            ownerId: user.ownerId,
            agentOwnerId: user.agentOwnerId,
            monitorOwnerId: user.monitorOwnerId,
            agentMnemonic: user.agentMnemonic,
            monitorMnemonic: user.monitorMnemonic,
            agentId: user.agentId,
            monitorId: user.monitorId,
            mfa: user.mfa,
        });
    } catch (error) {
        return res.status(500).send({message: "Internal server error"});
    }
};

const signout = async (req: Request, res: Response) => {
    try {
        logger.log('info', 'in controller signout method in userauth API');

        req.session.token = "";
        logger.log('info', 'session token removed from req object in userauth API');
        logger.log('info', 'try complete cookie removal in userauth API');
        res.clearCookie('jwt');

        return res.status(200).send({
            message: "You've been signed out!",
        });
    } catch (error) {
        logger.log('info', '500 error - not signed out in userauth API');
        return res.status(500).send({message: "Internal server error"});
    }
};

const authController = {
    signup,
    agentSignup,
    monitorSignup,
    signin,
    signout,
};

export default authController;
