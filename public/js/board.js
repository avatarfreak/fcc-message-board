$(function() {
  var currentBoard = window.location.pathname.split("/")[2];

  var url = "/api/threads/" + currentBoard;
  console.log("board.html: ", url);
  $("#boardTitle").text("Welcome to " + window.location.pathname);
  $.ajax({
    type: "GET",
    url: url,
    success: function(data) {
      var boardThreads = [];
      //
      // THIS ARRAY SET UP IS FOR CODE READABILITIES AND TESTING!
      // THIS IS NOT WHAT IT WOULD LOOK LIKE TO GO LIVE
      //
      data.forEach(function(ele) {
        console.log(ele); //can I use typeScript please?!
        var thread = ['<div class="thread mb-3">'];
        thread.push('<div class="main card p-2">');
        thread.push(
          '<p class="id card-header">id:' +
            ele._id +
            " (" +
            ele.created_on +
            ")</p>"
        );
        thread.push(
          '<form id="reportThread"><input type="hidden" name="thread_id" value="' +
            ele._id +
            '"><input class="btn btn-outline-info" type="submit" value="Report"></form>'
        );
        thread.push(
          '<form id="deleteThread"><input type="hidden" value="' +
            ele._id +
            '" name="thread_id" required=""><div class="input-group mb-1">\
            <input class="form-control" type="text" placeholder="password" name="delete_password" required="" />\
                <div class="input-group-append">\
                  <span class="input-group-text bg-light">\
                    <input class="btn btn-outline-danger" type="submit" value="Delete" />\
                  </span>\
                </div>\
              </div>\
            </form>'
        );
        thread.push("<h3 class='font-weight-bold'>" + ele.text + "</h3>");
        thread.push('</div><div class="replies card">');
        var hiddenCount = ele.replycount - 3;
        if (hiddenCount < 1) {
          hiddenCount = 0;
        }
        thread.push(
          "<h5 class='card-header'>" +
            ele.replycount +
            " replies total (" +
            hiddenCount +
            ' hidden)- <a href="' +
            window.location.pathname +
            ele._id +
            '">See the full thread here</a>.</h5>'
        );
        ele.replies.forEach(function(rep) {
          thread.push('<div class="reply card-body">');
          thread.push(
            '<p class="id font-weight-small text-center">id: ' +
              rep._id +
              " (" +
              rep.created_on +
              ")</p>"
          );
          thread.push(
            '<form id="reportReply"><input type="hidden" name="thread_id" value="' +
              ele._id +
              '"><input type="hidden" name="reply_id" value="' +
              rep._id +
              '"><input class="btn btn-info" type="submit" value="Report"></form>'
          );
          thread.push(
            '<form id="deleteReply"><input type="hidden" value="' +
              ele._id +
              '" name="thread_id" required=""><input type="hidden" value="' +
              rep._id +
              '" name="reply_id" required="">\
              <div class="input-group mb-1">\
                  <input class="form-control" type="text" placeholder="password" name="delete_password" required="" />\
                  <div class="input-group-append">\
                    <span class="input-group-text">\
                      <input class="btn btn-outline-danger" type="submit" value="Delete" />\
                    </span>\
                  </div>\
                </div>\
              </form>'
          );
          thread.push(
            "<p class='text-light border' style='background:#009688'>" +
              rep.text +
              "</p>"
          );
          thread.push("</div>");
        });
        thread.push('<div class="newReply">');
        thread.push(
          '<form action="/api/replies/' +
            currentBoard +
            '/" method="post" id="newReply">'
        );
        thread.push(
          '<input type="hidden" name="thread_id" value="' + ele._id + '">'
        );
        thread.push(
          '<textarea class="form-control" rows="5" cols="80" type="text" placeholder="Quick reply..." name="text" required=""></textarea><br>'
        );
        thread.push(
          '    <div class="input-group mb-1">\
                  <input class="form-control" type="text" placeholder="password to delete" name="delete_password" required="" />\
                  <div class="input-group-append">\
                    <span class="input-group-text">\
                      <input class="btn btn-outline-info" type="submit" value="Submit" />\
                    </span>\
                  </div>\
                </div>'
        );
        thread.push("</form></div></div></div>");
        boardThreads.push(thread.join(""));
      });
      $("#boardDisplay").html(boardThreads.join(""));
    }
  });

  $("#newThread").submit(function() {
    $(this).attr("action", "/api/threads/" + currentBoard);
  });

  $("#boardDisplay").on("submit", "#reportThread", function(e) {
    var url = "/api/threads/" + currentBoard;
    $.ajax({
      type: "PUT",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        alert(data);
      }
    });
    e.preventDefault();
  });
  $("#boardDisplay").on("submit", "#reportReply", function(e) {
    var url = "/api/replies/" + currentBoard;
    $.ajax({
      type: "PUT",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        alert(data);
      }
    });
    e.preventDefault();
  });
  $("#boardDisplay").on("submit", "#deleteThread", function(e) {
    var url = "/api/threads/" + currentBoard;
    $.ajax({
      type: "DELETE",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        alert(data);
        location.reload();
      }
    });
    e.preventDefault();
  });
  $("#boardDisplay").on("submit", "#deleteReply", function(e) {
    var url = "/api/replies/" + currentBoard;
    $.ajax({
      type: "DELETE",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        alert(data);
        location.reload();
      }
    });
    e.preventDefault();
  });
});
