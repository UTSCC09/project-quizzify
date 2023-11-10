var express = require('express');
var router = express.Router();

const { checkRequiredPermissions, validateAccessToken } = require("../utils/auth")

const mongoose = require("mongoose")
const Quiz = require("../models/quiz")


// GET /quizzes
router.get('/', (req, res, next) => {
    res.json({quizzes: ["test1", "test2"]})
});
// POST /quizzes
router.post('/', (req, res, next) => {
});

// GET /quizzes/templates
router.get('/templates', (req, res, next) => {
});

// GET /quizzes/:quizId
router.get('/:quizId', (req, res, next) => {
});
// PUT /quizzes/:quizId
router.put('/:quizId', validateAccessToken, (req, res, next) => {
});
// DELETE /quizzes/:quizId
router.delete('/:quizId', validateAccessToken, (req, res, next) => {
});

// POST /quizzes/:quizId/questions
router.post('/:quizId/questions', validateAccessToken, (req, res, next) => {
});
// PUT /quizzes/:quizId/questions/:questionId
router.put('/:quizId/questions/:questionId', validateAccessToken, (req, res, next) => {
});
// DELETE /quizzes/:quizId/questions/:questionId
router.delete('/:quizId/questions/:questionId', validateAccessToken, (req, res, next) => {
});

// POST /quizzes/:quizId/start
router.post('/:quizId/start', validateAccessToken, (req, res, next) => {
});
// POST /quizzes/:quizId/end
router.post('/:quizId/end', validateAccessToken, (req, res, next) => {
});

module.exports = router;
