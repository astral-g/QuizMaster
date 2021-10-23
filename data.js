const ROLE = {
    ADMIN:      'admin',
    TEACHER:    'teacher',
    STUDENT:    'student'
};

module.exports = { 
    ROLE: ROLE,
    users: [
        {id: 1, name: 'George',     role: ROLE.ADMIN, userId: 1},
        {id: 2, name: 'Charlie',    role: ROLE.TEACHER, userId: 2},
        {id: 3, name: 'Bella',      role: ROLE.STUDENT, userId: 3}
    ], 
    quiz: [
        {id: 1, name: 'General Knowledge', edit: ROLE.ADMIN},
        {id: 2, name: 'Geography', edit: ROLE.ADMIN}
    ],
    questions: [
        {quizId: [1, 2], question: 'What is the capital of England?', choices: ['Birmingham', 'London', 'Dudley', 'Edinburgh'], correctAnswer: 'London'}
    ]
}
