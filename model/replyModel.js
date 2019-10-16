const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let replySchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    created_on: { type: Date, default: new Date() },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    thread: { type: Schema.Types.ObjectId,  ref: "Board" }
  }
);

module.exports = mongoose.models.Reply || mongoose.model("Reply", replySchema);
