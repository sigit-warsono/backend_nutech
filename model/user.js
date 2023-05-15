const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

module.exports = (database, Sequelize) => {
  return database.define("user", {
    firstName : DataTypes.STRING,
    lastName : DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
};
