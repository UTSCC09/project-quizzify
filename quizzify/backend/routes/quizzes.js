var express = require('express');
var router = express.Router();

const { checkRequiredPermissions, validateAccessToken } = require("../utils/auth")

const mongoose = require("mongoose")
const Quiz = require("../models/quiz")


// GET /quizzes
router.get('/', (req, res, next) => {
    // TODO: Paginate; private
    Quiz.find()
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});
// POST /quizzes
router.post('/', validateAccessToken, (req, res, next) => {
    const quiz = {
        userId: req.auth.payload.sub,
        name: req.body.name,
        private: req.body.private,
        questions: req.body.questions,
    }
    Quiz.create(quiz.userId, quiz.name, quiz.private, quiz.questions)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});

// GET /quizzes/templates
router.get('/templates', (req, res, next) => {
});

// GET /quizzes/:quizId
router.get('/:quizId', async (req, res, next) => {
  Quiz.findById(req.params.quizId).exec()
    .then((result) => res.send(result))
    .catch((error) => res.send(error))
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
