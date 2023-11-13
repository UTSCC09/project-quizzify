var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const { Quiz } = require("../models/quiz");
const { getUsers, getUserById } = require('../utils/auth');

const stripUserFields = (user) => {
    return {
        created_at: user.created_at,
        email: user.email,
        family_name: user.family_name,
        given_name: user.given_name,
        locale: user.locale,
        name: user.name,
        picture: user.picture,
        user_id: user.user_id,
    }
}

// GET /users
router.get('/', async (req, res, next) => {
    try {
        const users = await getUsers()
        if (users.statusCode && users.statusCode !== 200)
            res.sendStatus(users.statusCode)
        else {
            const strippedUsers = users.map(user => stripUserFields(user))
            res.send(strippedUsers)
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

// GET /users/:userId
router.get('/:userId', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId)
        if (user.statusCode && user.statusCode !== 200)
            res.sendStatus(user.statusCode)
        else {
            const strippedUser = stripUserFields(user)
            res.send(strippedUser)
        }
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
