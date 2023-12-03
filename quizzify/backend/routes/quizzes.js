var express = require('express');
var router = express.Router();

const { checkRequiredPermissions, validateAccessToken } = require("../utils/auth")

const mongoose = require("mongoose")
const { Quiz, QUIZ_TYPES } = require("../models/quiz");

const validateQuestions = (questions) => {
    questions?.forEach((question, questionIndex) => {
        if (!question.question)
            throw Error(`Question ${questionIndex+1} must not be empty`)

        let questionAnswers = 0
        question.responses.forEach((response, responseIndex) => {
            if (!response.response)
                throw Error(`Response ${responseIndex+1} of question ${questionIndex+1} must not be empty`)
            if (response.isAnswer)
                questionAnswers++
        })

        if (questionAnswers == 0)
            throw Error(`Question ${questionIndex+1} must have a response marked as answer`)
        else if ([QUIZ_TYPES.SINGLE_CHOICE, QUIZ_TYPES.TRUE_OR_FALSE].includes(question.type) && questionAnswers != 1)
            throw Error(`Question ${questionIndex+1} must have a exactly one response marked as answer`)
    })
}


// GET /quizzes
router.get('/', validateAccessToken(false), async (req, res, next) => {
    try {
        const authedUserId = req.auth?.payload.sub
        // TODO: Paginate
        const quizzes = (await Quiz.find({
            $or: [ // Public quizzes OR private (owned by user)
                { private: false },
                { private: true, userId: authedUserId },
            ]
        })).map(quiz => quiz.hideQuestionsFromNonOwner(authedUserId))
        res.send(quizzes)
    } catch (error) {
        res.status(500).send(error)
    }
});
// POST /quizzes
router.post('/', validateAccessToken(), async (req, res, next) => {
    try {
        validateQuestions(req.body.questions)

        const quiz = {
            userId: req.auth.payload.sub,
            name: req.body.name,
            description: req.body.description,
            private: req.body.private,
            questions: req.body.questions,
            defaultTimer: req.body.defaultTimer,
            mode: req.body.mode,
        }
        const newQuiz = await Quiz.create(quiz.userId, quiz.name, quiz.description, quiz.private, quiz.questions,
                                          quiz.defaultTimer, quiz.mode)
        res.send(newQuiz)
    } catch (error) {
        res.status(500).send(error)
    }
});

// GET /quizzes/:quizId
router.get('/:quizId', validateAccessToken(false), async (req, res, next) => {
    try {
        const authedUserId = req.auth?.payload.sub
        const quiz = (await Quiz.findById(req.params.quizId))
            .hideQuestionsFromNonOwner(authedUserId)

        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.private && quiz.userId !== authedUserId) // Only return private quiz if owned by user
            res.sendStatus(403)
        else
            res.send(quiz)
    } catch (error) {
        res.status(500).send(error)
    }
});
// PUT /quizzes/:quizId
router.put('/:quizId', validateAccessToken(), async (req, res, next) => {
    try {
        validateQuestions(req.body.questions)

        const authedUserId = req.auth.payload.sub
        var quiz = await Quiz.findById(req.params.quizId)

        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.userId !== authedUserId) // Only update quiz if owned by user
            res.sendStatus(403)
        else {
            if (req.body.name)
                quiz.name = req.body.name
            if (req.body.private)
                quiz.private = req.body.private
            if (req.body.description)
                quiz.description = req.body.description
            if (req.body.defaultTimer)
                quiz.defaultTimer = req.body.defaultTimer
            if (req.body.mode)
                quiz.mode = req.body.mode
            if (req.body.questions && Array.isArray(req.body.questions)) {
                quiz.questions = req.body.questions
            }

            const updatedQuiz = await quiz.save()
            res.send(updatedQuiz)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
// DELETE /quizzes/:quizId
router.delete('/:quizId', validateAccessToken(), async (req, res, next) => {
    try {
        const authedUserId = req.auth.payload.sub
        var quiz = await Quiz.findById(req.params.quizId)

        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.userId !== authedUserId) // Only delete quiz if owned by user
            res.sendStatus(403)
        else {
            const deletedQuiz = await Quiz.deleteOne(quiz)
            res.send(deletedQuiz)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

// GET /quizzes/:quizId/copy
router.get('/:quizId/copy', validateAccessToken(), async (req, res, next) => {
    try {
        const authedUserId = req.auth.payload.sub
        var quiz = await Quiz.findById(req.params.quizId)

        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.private && quiz.userId !== authedUserId) // Only copy private quiz if owned by user
            res.sendStatus(403)
        else {
            const newQuiz = await Quiz.create(authedUserId, `${quiz.name} [COPY]`, quiz.description, quiz.private, 
                                              quiz.questions, quiz.defaultTimer, quiz.mode)
            res.send(newQuiz)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

/*
// POST /quizzes/:quizId/questions
router.post('/:quizId/questions', validateAccessToken(), async (req, res, next) => {
    try {
        var quiz = await Quiz.findById(req.params.quizId)
        
        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.userId !== userId) // Only create questions if quiz if owned by user
            res.sendStatus(403)
        else {
            quiz.questions = req.body.questions
            const newQuestionsQuiz = await quiz.save() // TODO: Verify
            res.send(newQuestionsQuiz)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
// PUT /quizzes/:quizId/questions/:questionId
router.put('/:quizId/questions/:questionId', validateAccessToken(), async (req, res, next) => {
    try {
        var quiz = await Quiz.findById(req.params.quizId)
        
        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.userId !== userId) // Only update quiz if owned by user
            res.sendStatus(403)
        else {
            const questionIndex = quiz.questions.findIndex(question => question._id == req.params.questionId)
            if (questionIndex == -1) // Does not exist
                res.sendStatus(404)
            else {
                if (req.body.question)
                    quiz.questions[questionIndex].question = req.body.question
                if (req.body.type && QUIZ_TYPES.contains(req.body.type))
                    quiz.questions[questionIndex].type = req.body.type
                if (req.body.responses)
                    quiz.questions[questionIndex].responses = req.body.responses

                const newQuestionsQuiz = await quiz.save() // TODO: Verify
                res.send(newQuestionsQuiz)
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
// DELETE /quizzes/:quizId/questions/:questionId
router.delete('/:quizId/questions/:questionId', validateAccessToken(), async (req, res, next) => {
    try {
        let quiz = await Quiz.findById(req.params.quizId)
        
        if (quiz === undefined) // Does not exist
            res.sendStatus(404)
        else if (quiz.userId !== userId) // Only deleted quiz question if owned by user
            res.sendStatus(403)
        else {
            quiz = quiz.questions.filter((question) => question.questionId !== req.params.questionId)
            const deletedQuestionQuiz = await quiz.save() // TODO: Verify
            res.send(deletedQuestionQuiz)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
*/

module.exports = router;
