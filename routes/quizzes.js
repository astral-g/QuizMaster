// Packages
const express       = require('express');
const router        = express.Router();
const mongoose      = require('mongoose');
const bcrypt        = require('bcrypt');
const session       = require('express-session');

router.use(express.urlencoded({extended: true}));

// Schemas
const User      = require('../schemas/userModel');
const Quiz      = require('../schemas/quizModel');
const Question  = require('../schemas/questionModel');

// Authenitcation
const { authUser, checkPermission, authPermission } = require('../middleware/auth');

// Routes

router.get('/dashboard', authUser, async (req, res) => {
    let userPermission = await checkPermission(req.session.user._id);
    const loggedInStatus = true;

    const allQuizzes = await Quiz.find({});
    res.render('quizDashboard', { allQuizzes, loggedInStatus, userPermission });
});

router.get('/new', authUser, authPermission("all"), (req, res) => {
    res.render("quizInsert");
});

router.get('/viewQuiz/:id', authUser, async (req, res) => {
    let userPermission = await checkPermission(req.session.user._id);
    const loggedInStatus = true;

    const { id } = req.params;
    
    const quizData = await Quiz.findById(id);
    const questions = await Question.find({ quizId: id })
    res.render("quizOverview", { quizData, questions, loggedInStatus, userPermission }); 
});

router.post('/dashboard', authUser, async (req, res) => {
    // Check for duplicate quiz name
    const checkForDuplicate = await Quiz.findOne({ name: req.body.name });

    if(checkForDuplicate != null) {
        const errMsg = "A quiz with this name already exists - please enter a new name";
        return res.render("error", { errMsg });
    }

    // If a duplicate quiz does not exist - create the new quiz
    const newQuiz = new Quiz (req.body);
    
    try {
        await newQuiz.save();
        res.redirect(`/quiz/viewQuiz/${newQuiz._id}`);    
    } catch (err) {
        console.log(`[ERROR]: ${err}`);
        res.status(500);
        const errMsg = "Sorry - an error occured when creating this quiz. Please contact your administrator"    
        return res.render("error", { errMsg });
    }
});

router.get('/add-question/:quizId', authUser, authPermission("all"), async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    const quizName = quiz.name;
    res.render("addQuestions" , { quizId, quizName });
});

router.post('/add-question', authUser, authPermission("all"), async (req, res) => {
    const questionData = req.body;
    const newQuestion = new Question (questionData);

    try {
        await newQuestion.save();
        res.redirect(`/quiz/viewQuiz/${questionData.quizId}`);
    } catch (err) {
        console.log(`[ERROR]: ${err}`);
        res.status(500);
        const errMsg = "Sorry - an error occured when saving these questions. Please contact your administrator"    
        return res.render("error", { errMsg });
    }
});

router.post('/delete-quiz', authUser, authPermission("all"), async (req, res) => {
    const id = req.body.quizId;

    // Delete the quiz and questions
    try {
        await Quiz.remove({ _id: id});
        console.log(`[DB]: Successfully deleted quiz with ID of: ${id}`);

        // Check if the quiz has any questions assigned to it
        const locatedQuestions = await Question.find({ quizId: id });
        if(locatedQuestions != null) {
            await Question.remove({ quizId: id});
            console.log(`[DB]: Successfully deleted all questions for the quiz with ID of: ${id}`);

            return res.redirect('/quiz/dashboard');
        }

        // If it does not - return
        return res.redirect('/quiz/dashboard');
    } catch (err) {
        console.log(`[ERROR]: ${err}`)

        const errMsg = "Sorry - an error occured whilst deleting this quiz. Please contact your administrator"    
        return res.render("error", { errMsg });   
    }
});

router.post('/delete-question', authUser, authPermission("all"), async (req, res) => {
    const quizId = req.body.quizId;
    const question = req.body.question;

    try {
        await Question.remove({ 
            quizId: quizId,
            question: question    
        });

        console.log(`[DB]: Successfully deleted question`);

        res.redirect(`/quiz/viewQuiz/${req.body.quizId}`);
    } catch (err) {
        console.log(`[ERROR]: ${err}`)       

        const errMsg = "Sorry - an error occured whilst deleting this question. Please contact your administrator"    
        return res.render("error", { errMsg });   
    }
});

router.post('/edit-question', authUser, authPermission("all"), async (req, res) => {
    const {questionId, question, optionA, optionB, optionC, optionD, correctAnswer} = req.body;
    
    try {
        const query = { _id: questionId };

        const newQuestion = { 
            question: question,
            optionA: optionA,
            optionB: optionB,
            optionC: optionC,
            optionD: optionD,
            correctAnswer: correctAnswer
        };

        await Question.findOneAndUpdate(query, newQuestion, {upsert: true});
        console.log(`[DB]: Successfully edited question`);

        res.redirect(`/quiz/viewQuiz/${req.body.quizId}`);
    } catch (err) {
        console.log(`[ERROR]: ${err}`)       

        const errMsg = "Sorry - an error occured whilst editing this question. Please contact your administrator"    
        return res.render("error", { errMsg });    }
    });

module.exports = router;