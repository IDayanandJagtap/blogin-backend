const express = require("express");
const connectToDb = require("./connectToDb");
connectToDb();
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/post"));

app.get("/", (req, res) => {
    console.log("Hello there !");
});

app.listen(port, () => {
    console.log("App is up");
});
