const bcrypt = require("bcrypt");

const express = require("express");

const router = require("express").Router();

const Auth = require("./auth-models");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Auth.addUser(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({ message: "something went wrong" });
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Auth.findByLog({ username })
    // .first()
    .then(user => {
      // console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedUser= user;
        console.log("SESSION LOGGED",req.session.loggedUser)
        res.status(200).json({
          message: `Welcome to my website ${user.username},id: ${user.id}`
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "something went wrong" });
      console.log(err);
    });
});



router.get("/logout", (req, res) => {
  if (req.session) {
    return req.session.destroy(err => {
      if (err) {
        res.json({ message: "you have not logged out properly" });
      } else {
        res.status(200).json({ message: "you have successfully logged out" });
        console.log(req.session)
      }
    });
  } else {
  }
  res.status(200).json({ message: "you were not logged in to start with" });
});

module.exports = router;
