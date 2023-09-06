const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

// const uri = "mongodb://127.0.0.1:27017/blogin";
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@blogin.qxgxfni.mongodb.net/?retryWrites=true&w=majority`;

const connectToDb = () => {
    mongoose.connect(uri).then(() => {
        console.log("Connected to db");
    });
};

module.exports = connectToDb;

// TheBloginMongod
