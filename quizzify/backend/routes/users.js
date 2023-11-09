var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const User = require("../models/user")

// GET /users
router.get('/', (req, res, next) => {
});

// GET /users/:userId
router.get('/:userId', (req, res, next) => {
});

// GET /users/:userId/quizzes
router.get('/:userId/quizzes', (req, res, next) => {
});

module.exports = router;
