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
import * as bcrypt from "bcryptjs";

const User = db.user;

interface PasswordType {
    password: string;
}

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

const deleteUserById = async (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    User.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "User was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `User was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const email = req.query["email"];
        const user = await User.findAll({
            where: { email: email},
        });
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
}

const patchUserPassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params["id"]);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // patch existing
        const obj: PasswordType = {
            password: bcrypt.hashSync(req.body.password, 8)
        }
        await user.update(obj);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }

}

const getAllUsers = async (req: Request, res: Response) => {
    User.findAll()
        .then((data: UserType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const userController = {
    getUserById,
    deleteUserById,
    getUserByEmail,
    getAllUsers,
    patchUserPassword,
};

export default userController;
