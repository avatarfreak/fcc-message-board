/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
var Reply = require("../model/replyModel");
const { setUpDatabase } = require("../test/db");

let board = "Node";
let id;
chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    //scaffolding database
    this.beforeEach(setUpDatabase);

    suite("POST", function() {
      test("Post to test board with valid credential should redirect to b/{board}", async () => {
        const res = await chai
          .request(server)
          .post("/api/threads/:board")
          .send({ board: "Node", text: "Hello Node", delete_password: "node" })
          .redirects(0);
        assert.equal(res.status, 301);
      });

      test("Post to test board with missing field", async () => {
        const res = await chai
          .request(server)
          .post("/api/threads/:board")
          .send({ board: "", text: "Hello Node", delete_password: "" })
          .redirects(0);
        assert.equal(res.status, 400);
        assert.equal(res.text, "please fill in the required field");
      });
    });

    suite("GET", function() {
      test("fetch most recent 10 bumped threads with only 3 most recent replies and should not return reported and delete_password.", async () => {
        const res = await chai.request(server).get(`/api/threads/${board}`);

        assert.equal(res.status, 200);
        assert.equal(res.body[0].board, "Node");
        assert.isArray(res.body[0].replies, "replies is array");
        assert.isBelow(res.body.length, 11, "Only 10 bumped threads");
        assert.notProperty(res.body[0], "delete_password");
        assert.notProperty(res.body[0], "reported");
        id = res.body[0]._id;
      });
    });

    suite("DELETE", function() {
      test("should delete a thread completely by passing on thread_id & delete_password. response will be 'success'", async () => {
        const res = await chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({ thread_id: id, delete_password: "node" });

        assert.equal(res.status, 200);
        assert.equal(res.text, "success");
      });

      test("should not delete a thread on passing incorrect id", async () => {
        const res = await chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: "5da8253eb208ce524b136130",
            delete_password: "node"
          });

        assert.equal(res.status, 200);
        assert.equal(res.text, "Invalid ID provided.");
      });

      test("delete a thread completely by passing on thread_id & delete_password. response will be 'incorrect password'", async () => {
        const res = await chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({ thread_id: id, delete_password: "123" });

        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");
      });
    });

    suite("PUT", function() {
      test("should report a thread and change it's reported value to true", async () => {
        const res = await chai
          .request(server)
          .put("/api/threads/:board")
          .send({ board: board, thread_id: id });

        assert.equal(res.status, 201);
        assert.equal(res.text, "success");
      });

      test("should report a thread and change it's reported value to error: Invalid field", async () => {
        const res = await chai
          .request(server)
          .put("/api/threads/:board")
          .send({});

        assert.equal(res.status, 200);
        assert.equal(res.text, "Invalid ID provided.");
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("should redirect to  /b/{board}/{thread_id} and update the bumped_on data to the comments data", async () => {
        const res = await chai
          .request(server)
          .post("/api/replies/:board")
          .send({
            board: board,
            thread_id: id,
            text: "This is testing phase.",
            delete_password: "node"
          })
          .redirects(0);
        assert.equal(res.status, 301);
      });

      test("should not redirect to /b/{board}/{thread_id}, missing fields", async () => {
        const res = await chai
          .request(server)
          .post("/api/replies/:board")
          .send({
            board: board,
            thread_id: id,
            text: "",
            delete_password: "node"
          })
          .redirects(0);
        assert.equal(res.status, 401);
        assert.equal(res.text, "Please provide the correct information.");
      });

      test("should not redirect to /b/{board}/{thread_id}, invalid field send ", async () => {
        const res = await chai
          .request(server)
          .post("/api/replies/:board")
          .send({
            board: "board",
            reported: false,
            thread_id: id,
            text: "This is testing phase.",
            delete_password: "node"
          })
          .redirects(0);
        assert.equal(res.status, 401);
        assert.equal(res.text, "error: Invalid field");
      });
    });

    suite("GET", function() {
      test("should show all the replies on thread excluding password and reported fields  on passing thread_id", async () => {
        const res = await chai
          .request(server)
          .get("/api/replies/:board")
          .query({ thread_id: id });
        assert.equal(res.status, 200);
        assert.property(res.body.replies[0], "created_on");
        assert.property(res.body.replies[0], "text");
        assert.notProperty(res.body.replies[0], "delete_password");
        assert.notProperty(res.body.replies[0], "reported");
        replyId = res.body.replies[0]._id;
      });

      test("should give error with invalid thread_id", async () => {
        const res = await chai
          .request(server)
          .get("/api/replies/:board")
          .query({ thread_id: "124" });

        assert.equal(res.status, 404);
        assert.equal(res.text, "Invalid credential provided.");
      });
    });

    suite("PUT", function() {
      test("should get response success by passing on thread_id and reply_id", async () => {
        const res = await chai
          .request(server)
          .put("/api/replies/:board")
          .send({ board: board, thread_id: id, reply_id: replyId });
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");
      });

      test("should get error message on passing invalid thread_id or reply_id", async () => {
        const res = await chai
          .request(server)
          .put("/api/replies/:board")
          .send({});

        assert.equal(res.status, 200);
        assert.equal(res.text, "Invalid information provided.");
      });
    });

    suite("DELETE", function() {
      test("should  delete a post on passing thread_id, reply_id & delete_password and changed the text to [deleted] with response 'success'", async () => {
        const res = await chai
          .request(server)
          .delete("/api/replies/:board")
          .send({
            board: board,
            thread_id: id,
            reply_id: replyId,
            delete_password: "node"
          });

        assert.equal(res.status, 200);
        assert.equal(res.text, "success");

        const data = await Reply.findById(replyId);
        assert.equal(data.text, "[deleted]");
      });

      test("should not delete a post on passing wrong (delete_password) and get response 'incorrect password' ", async () => {
        const res = await chai
          .request(server)
          .delete("/api/replies/:board")
          .send({
            board: board,
            thread_id: id,
            reply_id: replyId,
            delete_password: "nod"
          });
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");
      });

      test("should not delete a post on passing wrong reply_id, response Invalid ID provided.", async () => {
        const res = await chai
          .request(server)
          .delete("/api/replies/:board")
          .send({
            board: board,
            thread_id: id,
            reply_id: "12ad9",
            delete_password: "node"
          });

        assert.equal(res.status, 200);
        assert.equal(res.text, "Invalid ID provided.");
      });
    });
  });
});
