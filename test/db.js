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
  replies: [1, 2, "This is reply one", 3, 4, 5],
  replycount: 6
};
const boardTwo = {
  _id: new mongoose.Types.ObjectId(),
  board: "Node",
  text: "Hello Node for second time",
  delete_password: "node",
  reported: false,
  created_on: new Date(),
  bumped_on: new Date(),
  replies: ["This is reply two", 1, 2, "nodejs", 3, 4],
  replycount: 6
};
const boardThree = {
  _id: new mongoose.Types.ObjectId(),
  board: "express",
  text: "Hello express",
  reported: false,
  delete_password: "express",
  created_on: new Date(),
  bumped_on: new Date(),
  replies: [7, "express 1", 8, 9, 12, 13],
  replycount: 6
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
