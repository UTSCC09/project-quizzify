var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const Quiz = require("../models/quiz")

// GET /quizzes
router.get('/', (req, res, next) => {
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
router.put('/:quizId', (req, res, next) => {
});
// DELETE /quizzes/:quizId
router.delete('/:quizId', (req, res, next) => {
});

// POST /quizzes/:quizId/questions
router.post('/:quizId/questions', (req, res, next) => {
});
// PUT /quizzes/:quizId/questions/:questionId
router.put('/:quizId/questions/:questionId', (req, res, next) => {
});
// DELETE /quizzes/:quizId/questions/:questionId
router.delete('/:quizId/questions/:questionId', (req, res, next) => {
});

// POST /quizzes/:quizId/start
router.post('/:quizId/start', (req, res, next) => {
});
// POST /quizzes/:quizId/end
router.post('/:quizId/end', (req, res, next) => {
});

module.exports = router;
