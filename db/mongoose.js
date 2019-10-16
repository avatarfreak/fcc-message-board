const mongoose = require("mongoose");

const database = process.env.DB;

mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.once("open", () => console.log("db connection successfully established."));
db.on("error", console.error.bind(console, "connection error:"));

module.exports = db;
