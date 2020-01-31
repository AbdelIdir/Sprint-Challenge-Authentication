const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");
const session = require("express-session");
const KnexSessionsStore = require("connect-session-knex")(session); // to store sessions in database
const knex = require("../database/dbConfig");

const server = express();

const sessionConfig = {
  ////session storage options
  name: "some library maybe", // default would be sid
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
  resave: false, //
  saveUninitialized: false // GDPR laws against setting cookies automatically, the user will say if he agrees to accept cookies
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));


server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

module.exports = server;
