const mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/blogin";

const connectToDb = () => {
    mongoose.connect(uri).then(() => { console.log("Connected to db") });
}

module.exports = connectToDb