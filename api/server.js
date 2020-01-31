const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session"); // install express-session
// const KnexSessionsStore = require("connect-session-knex")(session); // to store sessions in database

const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router");
const restricted = require("../auth/authenticate-middleware");
// const knex = require("../database/dbConfig");
// const cookieParser = require("cookie-parser")
const server = express();

const KnexSessionStore = require("connect-session-knex")(session);
// const sessionConfig = {
//   ////session storage options
//   name: "something", // default would be sid
//   secret: "this is a secret,make it safe ", // used for encryption,must be an environment variable

//   store: new KnexSessionsStore({
//     knex,
//     createtable: true,
//     clearInterval: 1000 * 60 * 10, //defaults to 6000
//     sidifieldname: "sid",

//     ////optional
//     tablename: "sessions"
//   }),

//   cookie: {
//     maxAge: 1000 * 60 * 10,
//     secure: false, // true in production // if false,the cookie is sent over http,if true, only sent over https
//     httpOnly: true // if true,JS cannot access the cookie
//   },
//   resave: true, //
//   saveUninitialized: true // GDPR laws against setting cookies automatically, the user will say if he agrees to accept cookies
// };

server.use(helmet());
server.use(express.json());
server.use(cors());

// server.use(express.cookieParser());

server.use(
  session({
    name: "monkey", // session id
    secret: "keep it secret",
    cookie: {
      maxAge: 1000 * 60,
      secure: false, // https only
      httpOnly: false // can we get at the cookie from JS?
    },
    resave: true,
    // if we don't explicitly do something with the session
    // like adding extra properties (isLoggedIn for example)
    // don't respond with a Set-Cookie of "monkey=someIdSession"
    saveUninitialized: true, // good GDPR
    store: new KnexSessionStore({
      knex: require("../database/dbConfig"), // configured instance of knex
      tablename: "sessions", // table that will store sessions inside the db, name it anything you want
      sidfieldname: "sid", // column that will hold the session id, name it anything you want
      createtable: true, // if the table does not exist, it will create it automatically
      clearInterval: 1000 * 60 * 60 // time it takes to check for old sessions and remove them from the database to keep it clean and performant
    })
  })
);
server.use("/api/auth", authRouter);
server.use("/api/jokes", restricted, jokesRouter);
server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
