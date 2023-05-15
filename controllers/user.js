const db = require("../model");
const User = db.user;
const { Op } = require("sequelize");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  var hash = md5(password);
  var token = jwt.sign({ foo: "bar" }, "shhhhh");
  // try {
  const dataa = await User.findAll({
    attributes: ["id", "firstName", "lastName", "username"],
    where: {
      [Op.and]: [{ username: username }, { password: hash }],
    },
  });
  if (dataa.length > 0) {
    res.json({
      status: "ok",
      message: "Logged in",
      accessToken: token,
      user: dataa.pop(),
    });
  } else {
    return res.status(400).json({ status: "error", message: "Login failed" });
  }
};

exports.Register = async(req, res)=>{
  const firstName = req.body.firstName;
  const lastName= req.body.lastName;
  const username  = req.body.username;
  const password   = md5(req.body.password);

  try {
    const validationUsername = await User.findAll({
      where: {
        [Op.and]: [{ username: username }],
      },
    });


    if (validationUsername.length > 0) {
      res.status(400).json({ messageTitle: "Join register failed", message: "Username already exist. Please use another username" });
    }else{
      await User.create({ firstName: firstName, lastName: lastName, password: password, username: username });
      res.status(201).json({ messageTitle: "Register join", message: "User Created Successfuly" });
    }


  } catch (error) {
    console.error.message;
  }
}
