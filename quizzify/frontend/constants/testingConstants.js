// for testing purposes, will remove
export const SAMPLE_QUIZ = {
    quizId: '1234',
    name: 'Animal Quiz',
    questions: [
        {
            question: 'What mammal has the most powerful bite?',
            type: 'Quiz',
            responses: [{response: 'Your mom', isAnswer: false }, {response: 'Gorilla', isAnswer: false }, 
                        {response: 'Hippopotamus', isAnswer: true }, {response: 'Grizzly Bear', isAnswer: false }],
        },
        {
            question: 'What is a group of cats called?',
            type: 'Quiz',
            responses: [{response: 'A Clowder', isAnswer: true }, {response: 'A Pandemonium', isAnswer: false }, 
                        {response: 'A Spawnage', isAnswer: false }, {response: 'A Clover', isAnswer: false }],
        },
        {
            question: 'How many legs does a lobster have?',
            type: 'Quiz',
            responses: [{response: '10', isAnswer: true }, {response: '8', isAnswer: false }, 
                        {response: '12', isAnswer: false }, {response: '6', isAnswer: false }],
        },
        {
            question: 'What is the deadliest creature in the world?',
            type: 'Quiz',
            responses: [{response: 'Snake', isAnswer: false }, {response: 'Shark', isAnswer: false }, 
                        {response: 'Grizzly Bear', isAnswer: false }, {response: 'Mosquito', isAnswer: true }],
        },
        {
            question: 'The ostrich lays the smallest egg compared to all animals.',
            type: 'T/F',
            responses: [{response: 'True', isAnswer: false }, {response: 'False', isAnswer: true }],
        },
    ],
    private: false
}