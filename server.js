const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.send("I'm running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server is here *-*");
});
