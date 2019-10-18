**FreeCodeCamp**- Information Security and Quality

## Objective

- #### Build a full stack JavaScript app that is functionally similar to this: https://horn-celery.glitch.me/.

# Project Anon Message Board

- **SET NODE_ENV** to `test` without quotes when ready to write tests and DB to your databases connection string (in .env)

- Recomended to create controllers/handlers and handle routing in `routes/api.js`

- You will add any security features to `server.js`

- You will create all of the functional/unit tests in `tests/2_functional-tests.js` and `tests/1_unit-tests.js` but only functional will be tested

## User Stories

- Only allow your site to be loading in an iFrame on your own pages.
- Do not allow DNS prefetching.
- Only allow your site to send the referrer for your own pages.

- I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be \_id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
- I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved \_id, text, created_on, delete_password, & reported.
- I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
- I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
- I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
- I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
- I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
- I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
- Complete functional tests that wholely test routes and pass.  
   | API | GET | POST | PUT | DELETE |
  |:--------------------:|:--------------------------:|:----------------------:|:----------------------:|:------------------------------------:|
  | /api/threads/{board} | list recent threads | create thread | report thread | delete thread with password |
  | /api/replies/{board} | show all replies on thread | create reply on thread | report reply on thread | change reply to '[delete]' on thread |

## Technologies

- Node
- Express
- Helmet
- Mocha-Chai
- Bootstrap
- javascript
- Html

## Project Structure:

```
├── assertion-analyser.js
├── config
│   ├── dev.env
│   └── test.env
├── controller
│   ├── ReplyController.js
│   └── ThreadController.js
├── db
│   └── mongoose.js
├── model
│   ├── boardModel.js
│   └── replyModel.js
├── package.json
├── package-lock.json
├── public
│   ├── img
│   │   ├── api.png
│   │   └── favicon.ico
│   ├── js
│   │   ├── board.js
│   │   ├── main.js
│   │   └── thread.js
│   └── style
│       └── style.css
├── README.md
├── routes
│   ├── api.js
│   └── fcctesting.js
├── server.js
├── test
│   ├── db.js
│   └── mocha.opts
├── test-runner.js
├── tests
│   ├── 1_unit-tests.js
│   └── 2_functional-tests.js
└── views
    ├── board.html
    ├── index.html
    └── thread.html

```

## Prerequisite:

- Node
- git

## Installing:

- clone this project
  - \$ git clone "https://github.com/avatarfreak/fcc-message-board.git"
  - \$ cd fcc-message-board
  - \$ npm install
  - \$ npm run start

## Testing:

- npm test

### Project Demo:

- [FCC-Anon-Message-Board](https://avatarfreak-fcc-message-board.glitch.me)

### Author:

- [avatarfreak](https://github.com/avatarfreak)
