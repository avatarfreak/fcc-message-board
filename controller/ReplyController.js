const mongoose = require("mongoose");
const Board = require("../model/boardModel");
const Reply = require("../model/replyModel");

//POST
const postReplies = async (req, res) => {
  const keys = Object.keys(req.body); //Getting all the name field from the form
  const { thread_id, text } = req.body;

  const allowedUpdates = ["board", "thread_id", "text", "delete_password"];
  const isValidfield = keys.every(key => allowedUpdates.includes(key)); //Only valid field from the from is allowed, if no then return false

  if (!isValidfield) return res.status(401).send("error: Invalid field");

  if (!mongoose.Types.ObjectId.isValid(thread_id) || !text)
    return res.status(401).send("Please provide the correct information.");

  if (!keys.includes("board"))
    req.body = { ...req.body, board: req.params.board };

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

  if (!mongoose.Types.ObjectId.isValid(thread_id))
    return res.status(404).send("Invalid credential provided.");

  try {
    const query = { thread: thread_id };
    const excludes = { reported: 0, delete_password: 0 };
    const replies = await Reply.find(query, excludes).populate({
      path: "thread",
      select: excludes,
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
  const { reply_id, thread_id } = req.body;
  const isValid = mongoose.Types.ObjectId.isValid;

  if (!isValidField) return res.status(401).send("error: Invalid field");

  if (!keys.includes("board"))
    req.body = { ...req.body, board: req.params.board };

  if (!isValid(reply_id) || !isValid(thread_id))
    return res.send("Invalid information provided.");

  try {
    await Reply.findByIdAndUpdate(reply_id, { $set: { reported: true } });
    res.status(200).send("success");
  } catch (error) {
    res.status(400).send(error);
  }
};

//DELETE
const deleteReplies = async (req, res) => {
  const { thread_id, reply_id, delete_password } = req.body;
  const isValid = mongoose.Types.ObjectId.isValid;

  if (!req.body.hasOwnProperty("board"))
    req.body = { ...req.body, board: req.params.board };

  if (!isValid(reply_id) || !isValid(thread_id))
    return res.status(200).send("Invalid ID provided.");

  try {
    const doc = await Reply.findById(reply_id);
    if (!doc) return res.send("Invalid ID provided.");

    if (doc.delete_password !== delete_password)
      return res.send("incorrect password");

    doc.text = "[deleted]";
    doc.save();
    res.send("success");
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
