const mongoose = require("mongoose");
const Board = require("../model/boardModel");

//Get
const getThread = async (req, res) => {
  const { board } = req.params;
  try {
    const excludes = { reported: 0, delete_password: 0 };
    const threads = await Board.find({ board }, excludes)
      .populate({ path: "replies", options: { sort: { created_on: -1 } } })
      .sort({ bumped_on: -1 })
      .limit(10)
      .slice("replies", 3);
    res.status(200).send(threads);
  } catch (error) {
    res.status(400).send(error);
  }
};

//POST
const postThread = async (req, res) => {
  const keys = Object.keys(req.body);
  let isEmpty = keys.some(key => req.body[key] === ""); //if some fields is missing, return true

  if (isEmpty) return res.status(400).send("please fill in the required field");

  if (!keys.includes("board"))
    req.body = { ...req.body, board: req.params.board };

  try {
    await new Board(req.body).save();
    res.redirect(301, "/b/" + req.params.board);
  } catch (error) {
    res.status(400).send("please fill in the required fields");
  }
};

//Put
const putThread = async (req, res) => {
  const { thread_id } = req.body;
  const keys = Object.keys(req.body);
  const allowedUpdates = ["thread_id", "board"];
  const isValidkey = keys.every(key => allowedUpdates.includes(key)); //Only given field in form must included, return true or false

  if (!isValidkey) return res.status(400).send("error: Invalid field(s)");

  if (!mongoose.Types.ObjectId.isValid(thread_id))
    return res.status(200).send("Invalid ID provided.");

  try {
    await Board.findByIdAndUpdate(thread_id, { reported: true });
    res.status(201).send("success");
  } catch (error) {
    res.send(400).send(error);
  }
};

//DELETE
const deleteThread = async (req, res) => {
  const { thread_id, delete_password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(thread_id))
    return res.send("Invalid ID provided.");

  try {
    let threads = await Board.findById(thread_id);
    if (!threads) return res.send("Invalid ID provided."); //If provided thread_id is not in database.

    if (threads.delete_password !== delete_password)
      //correct thread_id but wrong passord is provided
      return res.send("incorrect password");

    threads.remove(); //remove thread and it replies
    res.send("success");
  } catch (error) {
    res.send("incorrect password");
  }
};

module.exports = {
  getThread,
  postThread,
  putThread,
  deleteThread
};
