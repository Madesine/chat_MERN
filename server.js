const express = require("express");
const connectDb = require("./config/db");

const app = express();

connectDb();

app.get("/", (req, res) => {
	res.send("I'm running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server is here *-*");
});
