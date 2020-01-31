const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session"); // install express-session
// const KnexSessionsStore = require("connect-session-knex")(session); // to store sessions in database
const KnexSessionsStore = require("connect-session-knex")(session);

const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router");
const restricted = require("../auth/authenticate-middleware");
const knex = require("../database/dbConfig");
// const cookieParser = require("cookie-parser")
const server = express();

const sessionConfig = {
  ////session storage options
  name: "something", // default would be sid
  secret: "this is a secret,make it safe ", // used for encryption,must be an environment variable

  store: new KnexSessionsStore({
    knex,
    createtable: true,
    clearInterval: 1000 * 60 * 10, //defaults to 6000
    sidifieldname: "sid",

    ////optional
    tablename: "sessions"
  }),

  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // true in production // if false,the cookie is sent over http,if true, only sent over https
    httpOnly: true // if true,JS cannot access the cookie
  },
  resave: true, //
  saveUninitialized: true // GDPR laws against setting cookies automatically, the user will say if he agrees to accept cookies
};

server.use(helmet());
server.use(express.json());
server.use(cors());

// server.use(express.cookieParser());

server.use(session(sessionConfig));
server.use("/api/auth", authRouter);
server.use("/api/jokes", restricted, jokesRouter);
server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
