const express = require('express');
const router = express.Router();

const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris" // (or use index for more security)
    },
    {
        id: 2,
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    }
];

// GET /quiz — send all questions without the answer
router.get('/quiz', (req, res) => {
    const safeQuestions = questions.map(q => {
        const { answer, ...rest } = q;
        return rest;
    });
    res.json(safeQuestions);
});

// POST /quiz/submit — user submits their answers
router.post('/quiz/submit', (req, res) => {
    const userAnswers = req.body.answers; // Array of submitted answers
    let correct = 0;
    let incorrect = 0;
    userAnswers.forEach((ans, index) => {
        if (questions[index].answer === ans) {
            correct++;
        }
        else {
            incorrect++
        }
    });
    res.json({ correct,incorrect, total: questions.length });
});

module.exports = router;
