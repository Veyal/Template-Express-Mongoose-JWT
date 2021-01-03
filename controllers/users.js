const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createFirstUser: async (req, res, next) => {
    const count = await userModel.countDocuments();
    if (count > 0) {
      res.sendStatus(403);
      return;
    }
    userModel.create(
      {
        username: req.body.username,
        password: req.body.password,
      },
      (err, result) => {
        if (err) {
          next(err);
        }
        res.json({message: "User Added", data: result });
      }
    );
  },

  create: async (req, res, next) => {
    const user = await userModel.findOne({ username: req.body.username });
    if (user !== null) {
      res.status(409).send({message: "Username Taken", data: null });
      return;
    }
    userModel.create(
      {
        username: req.body.username,
        password: req.body.password,
      },
      (err, result) => {
        if (err) {
          next(err);
        }
        res.json({message: "User Added", data: result });
      }
    );
  },

  authenticate: (req, res, next) => {
    userModel.findOne(
      {
        username: req.body.username,
      },
      (err, user) => {
        if (err) {
          next(err);
        }
        if (user == null) {
          res
            .status(401)
            .send({ message: "Invalid username/password", data: null });
          return;
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign(
            {
              id: user._id,
            },
            process.env.jwt_key,
            { expiresIn: "1h" }
          );

          res.send({
            message: "Authenticated!",
            data: {
              user: user,
              token: token,
            },
          });
        } else {
          res
            .status(401)
            .send({ message: "Invalid username/password", data: null });
        }
      }
    );
  },

  changePass: (req, res, next) => {
    userModel.findById(req.body.userId, (err, user) => {
      if (err) {
        next(err);
      }
      if (user == null) {
        res
          .status(500)
          .send({message: "Invalid Token", data: null });
        return;
      }
      if (bcrypt.compareSync(req.body.prevPass, user.password)) {
        user.password = req.body.newPass;
        user.save();
        res.send({message: "Success change password", data:user});
      } else {
        res.status(400).send({
          message: "Invalid current password",
          data: null,
        });
      }
    });
  },

  getUsers: async (req, res, next) => {
    const users = await userModel.find({});
    res.send(users);
  },

  removeUser: async (req, res, next) => {
    userModel.findByIdAndRemove(req.params.id,(err,user)=>{
      if(err){
        res.status(500).send(err);
        return;
      }
      res.status(200).send({message:"User Deleted", data: user});
    })
  },
};
