const mongoose = require("mongoose");
const Reply = require("./replyModel");
const Schema = mongoose.Schema;

let boardSchema = Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true, minlength: 2 },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  replycount: {
    type: Number,
    default: 0
  }
});

//delete threads replies when thread is destroyed
boardSchema.pre("remove", async function(next) {
  const board = this;
  await Reply.deleteMany({
    thread: board._id
  });
  next();
});

module.exports = mongoose.models.Board || mongoose.model("Board", boardSchema);
