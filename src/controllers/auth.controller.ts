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
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as bip39 from "bip39"; // TODO read about the syntax here
import cookieConfig from "../config/auth.config";

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

/*
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
*/

const signup = async (req: Request, res: Response) => {
  // Save User to Database
  try {
    const mnemonic1 = bip39.generateMnemonic();
    const mnemonic2 = bip39.generateMnemonic();

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      ownerId: req.body.ownerId,
      agentMnemonic: mnemonic1,
      monitorMnemonic: mnemonic2,
      agentId: 0,
      monitorId: 0,
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

      const result = user.setRoles(roles);
      if (result) {
        res.send({ message: "User registered successfully!" });
      }
    } else {
      // user only one role
      const result = user.setRoles([1]);
      if (result) {
        res.send({ message: "User registered successfully!" });
      }
    }
  } catch (err: any) {
    res.status(500).send("Internal server error");
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
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

    const token = jwt.sign(
      { id: user.id, owner: user.ownerId },
      cookieConfig.secret,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );

    let authorities = [];
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    // @ts-ignore
    req.session.token = token;

    res.set(
      "Access-Control-Allow-Origin",
      process.env["ACCESS_CONTROL_ALLOW_ORIGIN"]
    );
    res.set("Access-Control-Allow-Credentials", "true");

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      ownerId: user.ownerId,
      agentMnemonic: user.agentMnemonic,
      monitorMnemonic: user.monitorMnemonic,
      agentId: user.agentId,
      monitorId: user.monitorId,
    });
  } catch (err: any) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const signout = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    req.session.token = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const authController = {
  signup,
  signin,
  signout,
};

export default authController;
