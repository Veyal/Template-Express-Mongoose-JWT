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
        res.json({ success: true, message: "User Added", data: result });
      }
    );
  },

  create: async (req, res, next) => {
    const user = await userModel.findOne({ username: req.body.username });
    if (user !== null) {
      res.json({ success: false, message: "Username Taken", data: null });
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
        res.json({ success: true, message: "User Added", data: result });
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
            success: true,
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
    if (!req.body.prevPass || !req.body.newPass) {
      res.json({ success: false, message: "Invalid parameter", data: null });
      return;
    }
    userModel.findById(req.body.userId, (err, user) => {
      if (err) {
        next(err);
      }
      if (user == null) {
        res
          .status(500)
          .send({ success: false, message: "Invalid Token", data: null });
        return;
      }
      if (bcrypt.compareSync(req.body.prevPass, user.password)) {
        user.password = req.body.newPass;
        user.save();
        res.send({ success: true, message: "Success change password" });
      } else {
        res
          .status(400)
          .send({
            success: false,
            message: "Invalid current password",
            data: null,
          });
      }
    });
  },
};
