const express = require("express");
const connectToDb = require("./connectToDb");
connectToDb();
const cors = require("cors");

const app = express();
const port = 8000;

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
