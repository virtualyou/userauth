const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bip39 = require('bip39');


exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const mnemonic1 = bip39.generateMnemonic();
    const mnemonic2 = bip39.generateMnemonic();

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      ownerId: 0,
      agentMnemonic: mnemonic1,
      monitorMnemonic: mnemonic2
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
        res.send({message: "User registered successfully!"});
      }
    }
    else {
        // user has role = 1
        const result = user.setRoles([1]);
        if (result) {
          res.send({message: "User registered successfully!"});
        }
      }
    }
  catch (error) {
    res.status(500).send({message: error.message});
  }
};

exports.signin = async (req, res) => {
  /*
    Need to set headers ...
      Access-Control-Allow-Origin: http://localhost:3000
      Access-Control-Allow-Credentials: true
   */
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

    const token = jwt.sign({ id: user.id , owner: user.ownerId },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                           });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    res.set('Access-Control-Allow-Origin', 'http://localhost:3004');
    res.set('Access-Control-Allow-Credentials', 'true');

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      ownerId: user.ownerId,
      agentMnemonic: user.agentMnemonic,
      monitorMnemonic: user.monitorMnemonic
    });
  } catch (error) {
      return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (error) {
    this.next(error);
  }
};


