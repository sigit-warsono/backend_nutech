module.exports ={
    USER : "root",
    DB: "railway",
    PORT: 6797,
    PASSWORD : "pXLblli51WgHmIFlPmYW",
    HOST: "containers-us-west-99.railway.app",
    dialect: "mysql",
    pool:{
      max: 15,
      min: 5,
      idle: 20000,
      acquire: 30000
    }
}
