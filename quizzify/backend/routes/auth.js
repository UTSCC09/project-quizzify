var express = require('express');
var router = express.Router();

const { requiresAuth } = require('express-openid-connect');

const mongoose = require("mongoose")
const User = require("../models/user")


router.get('/', function (req, res, next) {
  res.json({ 
    isAuthenticated: req.oidc.isAuthenticated()
  })
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.json({
    user: req.oidc.user
  })
});


module.exports = router;