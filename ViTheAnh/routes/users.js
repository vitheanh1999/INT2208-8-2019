var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const brcyptjs = require("bcryptjs");
const User = require("./userModel");
/* GET users listing. */
mongoose.connect("mongodb://localhost:27017/User", err => {
  console.log("Connect to mongdb success");

  router.get("/", function(req, res, next) {
    res.send("respond with a resource");
  });
  // Sign in
  router.post("/sign-in", async function(req, res, next) {
    const loginInfo = req.body;
    const user = await User.findOne({
      $or: [{ contact: loginInfo.user }, { email: loginInfo.user }]
    }).exec();
    if (!user) {
      res.status(404).json({ url: "/", ok: false, isExist: false });
    } else {
      const comparePassword = await brcyptjs.compare(
        loginInfo.password,
        user.password
      );
      if (comparePassword) {
        // xac thuc
        req.session.user = {
          _id: user._id,
          email: user.email,
          permissions: user.permissions.length > 0 ? user.permissions : []
        };
        req.session.save();
        res.status(201).json({ url: "/", ok: true, isExist: true });
      } else {
        res.status(201).json({ url: "/", ok: false, isExist: true });
      }
    }
  });
  // Sign up
  router.post("/sign-up", async function(req, res, next) {
    const userInfo = req.body;
    const hashPassword = await brcyptjs.hash(userInfo.password, 10);
    const newUser = await User.create({
      ...userInfo,
      password: hashPassword,
      permissions : ["POST_CREATE"]
    });
    res.status(201).json({ url: "/sign-in" });
  });
  // Check valid sign up
  router.post("/sign-up/checkvalid", async (req, res, next) => {
    const validemail = /^([\w]*[\w\.]*(?!\.)@gmail.com)$/;
    const validcontact = /(09\d|03[2-8]|08[1-5]|07[0|6|7|8|9])+([0-9]{7})$/;
    const validpassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9_#@%\*\-]{8,24}$/;
    const { checkInfo, type } = req.body;
    let isExist = false;
    let isValid = true;
    let isNull = false;

    if (checkInfo == "") isNull = true;
    if (type == "contact" || type === "email") {
      const existAccount = await User.findOne({ type: checkInfo });
      if (existAccount) isExist = true;
    }
    if (type === "contact") {
      if (!checkInfo.match(validcontact)) {
        isValid = false;
      }
    } else if (type === "email") {
      if (!checkInfo.match(validemail)) {
        isValid = false;
      }
    } else if (type === "password") {
      if (!checkInfo.match(validpassword)) {
        isValid = false;
      }
    }

    res.status(201).json({ isExist, isValid, type, isNull });
  });
  // Reset password
  router.post("/repass/:id", async function(req, res, next) {
    const id = req.params.id;
    
    const pas = await brcyptjs.hash(req.body.pass, 10);
    await User.update({ _id: id }, { $set: { password: pas } });
    res.status(201).json({ url: "/sign-in" });
  });
  // Send a email to reset password
  router.post("/forget-password", async function(req, res, next) {
    const user = await User.findOne({
      $or: [{ email: req.body.user }, { contact: req.body.user }]
    });
    if (user) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "vianh1999bg@gmail.com",
          pass: "0969468213"
        }
      });
      const mainOption = {
        from: "Main Sever",
        to: `${user.email}`,
        subject: "Khôi phục tài khoản",
        text: `You recieved message form Main Sever`,
        html: `<h1> Link khôi phục tài khoản </h1><a href="http://localhost:3000/repass/${
          user._id
        }">http://localhost:3000/repass/${user._id}</a> `
      };
      transporter.sendMail(mainOption, (err, info) => {
        if (err) {
          console.log(err);
        }
        console.log(`Message send `);
      });
      res.json(user.email);
    } else res.json("false");
  });
  // Sent An Email to Verify Account
  router.post("/verify-account", async (req, res, next) => {
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { contact: req.body.email }]
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vianh1999bg@gmail.com",
        pass: "0969468213"
      }
    });
    const mainOption = {
      from: "Main Sever",
      to: `${user.email}`,
      subject: "Xác nhận tài khoản",
      text: `You recieved message form Main Sever`,
      html: `<h1> Link xác nhận tài khoản </h1><a href="http://localhost:3000/verify/${
        user._id
      }">http://localhost:3000/verify/${user._id}</a> `
    };
    transporter.sendMail(mainOption, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(`Message send `);
    });
    res.json(user.email);
  });
  // Verify Account
  router.post("/verify/:id", async (req, res, next) => {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { $set: { verify: true } });
    res.status(201).json({ url: "/" });
  });
  // logout
  router.get("/logout", async (req, res, next) => {
    req.session.destroy();
    res.status(200).end();
  });
});

module.exports = router;
