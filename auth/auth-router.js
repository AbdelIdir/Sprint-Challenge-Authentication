

const bcrypt = require("bcrypt");

const express = require("express");


const router = require('express').Router();


const Auth = require("./auth-models")


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



router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
