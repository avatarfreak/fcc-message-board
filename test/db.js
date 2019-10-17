const mongoose = require("mongoose");
const Board = require("../model/boardModel");
const Reply = require("../model/replyModel");

const boardOne = {
  _id: new mongoose.Types.ObjectId(),
  board: "Node",
  text: "Hello Node",
  delete_password: "node",
  reported: false,
  created_on: new Date(),
  bumped_on: new Date(),
  replies: [],
  replycount: 0
};
const boardTwo = {
  _id: new mongoose.Types.ObjectId(),
  board: "Node",
  text: "Hello Node for second time",
  delete_password: "node",
  reported: false,
  created_on: new Date(),
  bumped_on: new Date(),
  replies: [],
  replycount: 2
};
const boardThree = {
  _id: new mongoose.Types.ObjectId(),
  board: "express",
  text: "Hello express",
  reported: false,
  delete_password: "express",
  created_on: new Date(),
  bumped_on: new Date(),
  replies: [],
  replycount: 0
};

const replyOne = {
  _id: new mongoose.Types.ObjectId(),
  text: "This is reply one",
  delete_password: "node",
  reported: false,
  created_on: new Date(),
  thread: boardOne._id
};

const replyTwo = {
  _id: new mongoose.Types.ObjectId(),
  text: "This is reply two",
  delete_password: "node",
  reported: false,
  created_on: new Date(),
  thread: boardTwo._id
};

const setUpDatabase = async () => {
  await Board.deleteMany();
  await Reply.deleteMany();
  await new Board(boardOne).save();
  await new Board(boardTwo).save();
  await new Board(boardThree).save();
  await new Reply(replyOne).save();
  await new Reply(replyTwo).save();
};

module.exports = {
  setUpDatabase,
  boardOne,
  boardTwo,
  boardThree,
  replyOne,
  replyTwo
};
