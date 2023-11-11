var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const Quiz = require("../models/quiz")

// GET /users
router.get('/', (req, res, next) => {
    try {
        res.sendStatus(501) // TODO
    } catch (error) {
        res.status(500).send(error)
    }
});

// GET /users/:userId
router.get('/:userId', (req, res, next) => {
    try {
        res.sendStatus(501) // TODO
    } catch (error) {
        res.status(500).send(error)
    }
});

// GET /users/:userId/quizzes
router.get('/:userId/quizzes', async (req, res, next) => {
    try {
        const authedUserId = "TODO"
        // TODO: Paginate
        const quizzes = (await Quiz.find({
            userId: req.params.userId,
            $or: [ // Public quizzes OR private (owned by user)
                { private: false },
                { private: true, userId: authedUserId },
            ]
        })).map(quiz => quiz.hideQuestionsFromNonOwner(authedUserId))
        res.send(quizzes)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

module.exports = router;
