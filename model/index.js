const dbConfig = require("../config/db");
const Sequelize = require("sequelize");
const database = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});




const db = {};
db.Sequelize = Sequelize;
db.databaseConf = database;
// function to drop existing tables and re-sync database
db.dropRestApiTable = () => {
    db.databaseConf.sync({ force: true }).then(() => {
      console.log("restTutorial table just dropped and db re-synced.");
    });
  };

db.product= require("./product")(database, Sequelize);
db.user = require("./user")(database, Sequelize);

module.exports = db;
