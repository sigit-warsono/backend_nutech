const express = require('express');
const server = express();
const PORT = 3000;
var mysql = require('mysql');
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require("./model")
const FileUpload = require("express-fileupload")
const api = require("./routes/index")

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(FileUpload())
server.use(express.json());
server.use(express.static("public"));
server.use("/", api);

db.databaseConf.sync();

server.listen(PORT,"0.0.0.0", function(){
 console.log("running in localhost:8080")
})

