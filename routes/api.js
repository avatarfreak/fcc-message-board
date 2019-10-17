/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const db = require("../db/mongoose");
const ThreadController = require("../controller/ThreadController");
const ReplyController = require("../controller/ReplyController");

module.exports = function(app) {
  //Get Thread
  app.route("/api/threads/:board").get(ThreadController.getThread);

  //POST Thread
  app.route("/api/threads/:board").post(ThreadController.postThread);

  //Put Thread
  app.route("/api/threads/:board").put(ThreadController.putThread);

  //DELETE Thread
  app.route("/api/threads/:board").delete(ThreadController.deleteThread);

  //POST Replies
  app.route("/api/replies/:board").post(ReplyController.postReplies);

  //GET Replies
  app.route("/api/replies/:board").get(ReplyController.getReplies);

  //PUT Replies
  app.route("/api/replies/:board").put(ReplyController.putReplies);

  //DELETE Replies
  app.route("/api/replies/:board").delete(ReplyController.deleteReplies);
};
