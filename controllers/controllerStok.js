const Sequelize = require("sequelize");
const db = require("../model");

exports.HomeApi = (req, res) => {
    res.send("Welcome rest api maslow digital indonesia");
  };