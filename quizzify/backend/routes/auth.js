var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const User = require("../models/user")

// GET /auth
router.get('/', (req, res, next) => {
  // TODO: Get current authed user
});

// POST /auth/register
router.post('/register', (req, res, next) => {
});

// POST /auth/login
router.post('/login', (req, res, next) => {
});

module.exports = router;