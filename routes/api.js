/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const mongoose = require("mongoose");
const db = require("../db/mongoose");
const Board = require("../model/boardModel");
const Reply = require("../model/replyModel");

module.exports = function(app) {
  //Get
  app.route("/api/threads/:board").get(async (req, res) => {
    const { board } = req.params;
    try {
      const query = { board };
      const excludes = { reported: 0, delete_password: 0 };

      let threads = await Board.find(query, excludes)
        .sort({ bumped_on: -1 })
        .limit(10)
        .slice("replies", 3);
      res.status(200).send(threads);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  //POST
  app.route("/api/threads/:board").post(async (req, res) => {
    const keys = Object.keys(req.body);
    let isEmpty = keys.some(key => req.body[key] === "");
    if (isEmpty) {
      return res.status(400).send("please fill in the required field");
    }

    if (!keys.includes("board")) {
      req.body = {
        board: req.params.board,
        ...req.body
      };
    }

    const board = new Board(req.body);
    try {
      await board.save();
      res.redirect(301, "/b/" + req.params.board);
    } catch (error) {
      res.status(400).send("please fill in the required fields");
    }
  });

  //Put
  app.route("/api/threads/:board").put(async (req, res) => {
    const thread_id = req.body.thread_id;
    const keys = Object.keys(req.body);
    const allowedUpdates = ["thread_id", "board"];
    //valid key field is provided
    const isValidkey = keys.every(key => allowedUpdates.includes(key));
    //if valid key fiels is provided
    if (!isValidkey) {
      console.log(`missing fields: ${keys}`);
      return res.status(400).send("error: Invalid field(s)");
    }

    if (!mongoose.Types.ObjectId.isValid(thread_id)) {
      return res.status(200).send("Invalid ID provided.");
    }
    try {
      let reported = await Board.findByIdAndUpdate(thread_id, {
        reported: true
      });
      return res.status(201).send("success");
    } catch (error) {
      return res.send(400).send(error);
    }
  });

  //DELETE
  app.route("/api/threads/:board").delete(async (req, res) => {
    const { thread_id, delete_password } = req.body;
    const isValid = mongoose.Types.ObjectId.isValid;

    if (!isValid(thread_id)) {
      return res.send("Invalid ID provided.");
    }

    try {
      let del_Board = await Board.deleteOne({
        $and: [{ _id: thread_id }, { delete_password: delete_password }]
      });
      if (!del_Board.deletedCount) {
        return res.send("incorrect password");
      }
      res.send("success");
    } catch (error) {
      res.send("incorrect password");
    }
  });
  //app.routatus(400).ste("/api/threads/:board");

  //Replies

  //POST
  app.route("/api/replies/:board").post(async (req, res) => {
    //Getting all the name field from form
    const keys = Object.keys(req.body);

    const allowedUpdates = ["board", "thread_id", "text", "delete_password"];
    //Only valid name field is allowed, if no then return false
    const isValidfield = keys.every(key => allowedUpdates.includes(key));

    if (!isValidfield) {
      console.log(`missing fields: ${keys}`);
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
      res.redirect(301, `/b/${req.params.board}/${thread_id}`);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //GET
  app.route("/api/replies/:board").get(async (req, res) => {
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
  });

  //PUT
  app.route("/api/replies/:board").put(async (req, res) => {
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
      console.log(error);
      res.status(400).send(error);
    }
  });

  //DELETE
  app.route("/api/replies/:board").delete(async (req, res) => {
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
  });
};
