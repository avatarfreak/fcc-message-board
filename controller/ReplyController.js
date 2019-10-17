const mongoose = require("mongoose");
const Board = require("../model/boardModel");
const Reply = require("../model/replyModel");

//POST
const postReplies = async (req, res) => {
  //Getting all the name field from form
  const keys = Object.keys(req.body);

  const allowedUpdates = ["board", "thread_id", "text", "delete_password"];
  //Only valid name field is allowed, if no then return false
  const isValidfield = keys.every(key => allowedUpdates.includes(key));

  if (!isValidfield) {
    return res.status(401).send("error: Invalid field");
  }
  const { thread_id, text } = req.body;
  if (!mongoose.Types.ObjectId.isValid(thread_id) || !text) {
    return res.status(401).send("Please provide the correct information.");
  }
  if (!keys.includes("board")) {
    req.body = {
      ...req.body,
      board: req.params.board
    };
  }

  const replies = new Reply({
    ...req.body,
    thread: thread_id,
    bumped_on: new Date()
  });

  try {
    const data = await replies.save();
    await Board.findByIdAndUpdate(
      thread_id,
      {
        $push: { replies: data._id },
        $inc: { replycount: 1 },
        $set: { bumped_on: new Date() }
      },
      { new: true }
    );
    res.redirect(301, `/b/${req.params.board}/${thread_id}`);
  } catch (error) {
    res.status(500).send(error);
  }
};

//GET
const getReplies = async (req, res) => {
  const { thread_id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(thread_id)) {
    return res.status(404).send("Invalid credential provided.");
  }

  const query = { thread: thread_id };
  const update = { delete_password: 0, reported: 0 };

  try {
    const replies = await Reply.find(query, update).populate({
      path: "thread",
      options: { sort: { created_on: -1 } }
    });
    res.status(200).send({ replies });
  } catch (error) {
    res.status(400).send(error);
  }
};

//PUT
const putReplies = async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedUpdates = ["board", "thread_id", "reply_id"];
  const isValidField = keys.every(key => allowedUpdates.includes(key));

  if (!isValidField) {
    return res.status(401).send("error: Invalid field");
  }

  if (!keys.includes("board")) {
    req.body = {
      ...req.body,
      board: req.params.board
    };
  }
  const { reply_id, thread_id } = req.body;
  const isValid = mongoose.Types.ObjectId.isValid;
  if (!isValid(reply_id) || !isValid(thread_id)) {
    return res.send("Invalid information provided.");
  }

  try {
    await Reply.findByIdAndUpdate(reply_id, { $set: { reported: true } });
    res.status(200).send("success");
  } catch (error) {
    res.status(400).send(error);
  }
};

//DELETE
const deleteReplies = async (req, res) => {
  const { board, thread_id, reply_id, delete_password } = req.body;
  if (!req.body.hasOwnProperty("board")) {
    req.body = { ...req.body, board: req.params.board };
  }

  const isValid = mongoose.Types.ObjectId.isValid;
  if (!isValid(reply_id) || !isValid(thread_id)) {
    return res.status(200).send("Invalid ID provided.");
  }
  try {
    await Reply.findOne({ _id: reply_id }).exec((err, data) => {
      if (err) throw err;

      if (data.delete_password !== delete_password) {
        return res.send("incorrect password");
      }
      data.text = "[deleted]";
      data.save();
      return res.send("success");
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports = {
  getReplies,
  postReplies,
  putReplies,
  deleteReplies
};
