"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const bip39 = __importStar(require("bip39"));
const auth_config_1 = __importDefault(require("../config/auth.config"));
const User = models_1.default.user;
const Role = models_1.default.role;
const Op = models_1.default.Sequelize.Op;
const signup = async (req, res) => {
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
      const result = user.setRoles([1]);
      if (result) {
        res.send({ message: "User registered successfully!" });
      }
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};
const signin = async (req, res) => {
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
      auth_config_1.default.secret,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      }
    );
    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
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
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
const signout = async (req, res) => {
  try {
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
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map
