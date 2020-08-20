const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const connectDb = require("./api/database/connectToDb");
const auth = require("./api/routes/auth");
const errorHandlerMiddleware = require("./api/middlewares/errorHandler");

const app = express();

app.use(express.json({ extended: false }));
app.use(cookieParser());

connectDb();

app.use("/api/auth", auth);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close();
  server.close();
});
