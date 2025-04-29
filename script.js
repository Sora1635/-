// Пользовательские данные
let currentUser = null;
let users = {};

// Функции для кодирования/декодирования Base64
function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
}

// Загрузка данных из localStorage
function loadUsers() {
    const encodedData = localStorage.getItem('usersData');
    if (encodedData) {
        try {
            users = JSON.parse(decodeBase64(encodedData));
        } catch (e) {
            console.error('Декодирование данных не удалось:', e);
            users = {};
        }
    }
}

// Сохранение данных в localStorage
function saveUsers() {
    const encodedData = encodeBase64(JSON.stringify(users));
    localStorage.setItem('usersData', encodedData);
}

// Инициализация
loadUsers();

// Система аккаунтов
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Логин жана сырсөздү толтуруңуз!');
        return;
    }

    if (users[username]) {
        alert('Бул логин мурунтан катталган!');
        return;
    }

    users[username] = {
        password,
        testResults: {},
        courseProgress: {},
        knowledgeAreas: {}
    };
    saveUsers();
    loginUser(username);
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!users[username] || users[username].password !== password) {
        alert('Логин же сырсөз туура эмес!');
        return;
    }

    loginUser(username);
}

function loginUser(username) {
    currentUser = users[username];
    localStorage.setItem('currentUser', encodeBase64(username));
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Проверка авторизации
window.onload = function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && users[decodeBase64(savedUser)]) {
        loginUser(decodeBase64(savedUser));
    }
};

// Переключение секций
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

// Тесты
let currentSubject = localStorage.getItem('subject') || '';
let currentPart = localStorage.getItem('part') || 0;
let currentTest = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let userAnswers = Array(30).fill(null);
let testType = 'ort_prob';

// Все вопросы встроены прямо в код
const questions = {
    math_part1: [
        { question: "2 + 2 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "5 - 3 канча болот?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "b" },
        { question: "3 * 4 канча болот?", options: { a: "6", b: "8", c: "10", d: "12" }, correct: "d" },
        { question: "10 / 2 канча болот?", options: { a: "2", b: "4", c: "5", d: "6" }, correct: "c" },
        { question: "7 + 8 канча болот?", options: { a: "13", b: "15", c: "16", d: "17" }, correct: "b" },
        { question: "9 - 4 канча болот?", options: { a: "3", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "6 * 3 канча болот?", options: { a: "9", b: "12", c: "15", d: "18" }, correct: "d" },
        { question: "20 / 5 канча болот?", options: { a: "2", b: "4", c: "5", d: "10" }, correct: "c" },
        { question: "12 + 13 канча болот?", options: { a: "23", b: "25", c: "26", d: "27" }, correct: "b" },
        { question: "15 - 7 канча болот?", options: { a: "6", b: "8", c: "9", d: "10" }, correct: "b" },
        { question: "8 * 9 канча болот?", options: { a: "64", b: "72", c: "78", d: "81" }, correct: "b" },
        { question: "24 / 6 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "17 + 18 канча болот?", options: { a: "33", b: "35", c: "36", d: "37" }, correct: "b" },
        { question: "22 - 9 канча болот?", options: { a: "11", b: "12", c: "13", d: "14" }, correct: "c" },
        { question: "7 * 8 канча болот?", options: { a: "49", b: "56", c: "58", d: "64" }, correct: "b" },
        { question: "30 / 5 канча болот?", options: { a: "5", b: "6", c: "7", d: "8" }, correct: "b" },
        { question: "23 + 24 канча болот?", options: { a: "45", b: "46", c: "47", d: "48" }, correct: "c" },
        { question: "28 - 12 канча болот?", options: { a: "14", b: "16", c: "18", d: "20" }, correct: "b" },
        { question: "9 * 10 канча болот?", options: { a: "80", b: "90", c: "95", d: "100" }, correct: "b" },
        { question: "40 / 8 канча болот?", options: { a: "4", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "31 + 32 канча болот?", options: { a: "61", b: "62", c: "63", d: "64" }, correct: "c" },
        { question: "35 - 15 канча болот?", options: { a: "18", b: "20", c: "22", d: "25" }, correct: "b" },
        { question: "11 * 12 канча болот?", options: { a: "121", b: "132", c: "133", d: "144" }, correct: "b" },
        { question: "50 / 10 канча болот?", options: { a: "4", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "42 + 43 канча болот?", options: { a: "83", b: "84", c: "85", d: "86" }, correct: "c" },
        { question: "47 - 23 канча болот?", options: { a: "22", b: "24", c: "26", d: "28" }, correct: "b" },
        { question: "13 * 14 канча болот?", options: { a: "169", b: "170", c: "182", d: "184" }, correct: "c" },
        { question: "60 / 15 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "55 + 56 канча болот?", options: { a: "109", b: "110", c: "111", d: "112" }, correct: "c" },
        { question: "60 - 25 канча болот?", options: { a: "33", b: "35", c: "37", d: "40" }, correct: "b" }
    ],
    math_part2: [
        { question: "2^3 канча болот?", options: { a: "6", b: "8", c: "10", d: "12" }, correct: "b" }
        // Добавьте ещё 29 вопросов
    ],
    kyrgyz_part1: [
        { question: "Кыргыз тилинде 'күн' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "c" }
        // Добавьте ещё 29 вопросов
    ],
    kyrgyz_part2: [
        { question: "Кыргыз тилинде 'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Тоо", c: "Токой", d: "Жол" }, correct: "b" }
        // Добавьте ещё 29 вопросов
    ]
};

// Быстрый выбор предмета для теста
function quickSelectSubject(subject, type = 'ort_prob') {
    if (subject) {
        testType = type;
        selectSubject(subject);
    }
}

// Выбор типа теста
function selectTestType(type) {
    testType = type;
    window.location.href = 'subject.html';
}

// Предметти тандоо
function selectSubject(subject) {
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Бөлүктү тандоо
function selectPart(part) {
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Бөлүк жөнүндө маалыматты жаңылоо
function updatePartDetails() {
    const time = currentPart == 1 ? 30 : 60;
    document.getElementById('part-description').textContent = `Суроолордун саны: 30, Убакыт: ${time} мүнөт`;
}

// Тестти баштоо
function startTest() {
    window.location.href = 'test.html';
}

// Тестти жүктөө
function loadTest() {
    const key = `${currentSubject}_part${currentPart}`;
    if (!questions[key] || questions[key].length !== 30) {
        alert("Суроолор толук эмес! 30 суроо болушу керек.");
        return;
    }
    currentTest = questions[key];
    currentQuestionIndex = 0;
    userAnswers = Array(30).fill(null);
    displayQuestion();
}

// Учурдагы суроону көрсөтүү
function displayQuestion() {
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');
    const questionCounter = document.getElementById('question-counter');

    const q = currentTest[currentQuestionIndex];
    questionsDiv.innerHTML = `
        <div class="question">
            <p>${currentQuestionIndex + 1}. ${q.question}</p>
            <p>a) ${q.options.a}</p>
            <p>b) ${q.options.b}</p>
            <p>c) ${q.options.c}</p>
            <p>d) ${q.options.d}</p>
        </div>
    `;
    answersDiv.innerHTML = `
        <div class="answer-row">
            <span>${currentQuestionIndex + 1}.</span>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="a" ${userAnswers[currentQuestionIndex] === 'a' ? 'checked' : ''}> a</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="b" ${userAnswers[currentQuestionIndex] === 'b' ? 'checked' : ''}> b</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="c" ${userAnswers[currentQuestionIndex] === 'c' ? 'checked' : ''}> c</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="d" ${userAnswers[currentQuestionIndex] === 'd' ? 'checked' : ''}> d</label>
        </div>
    `;
    questionCounter.textContent = `${currentQuestionIndex + 1}/30`;

    answersDiv.querySelectorAll(`input[name="ans${currentQuestionIndex}"]`).forEach(input => {
        input.addEventListener('change', () => {
            userAnswers[currentQuestionIndex] = input.value;
        });
    });
}

// Мурунку суроого өтүү
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Кийинки суроого өтүү
function nextQuestion() {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Таймер
function startTimer() {
    const timeLimit = currentPart == 1 ? 30 * 60 : 60 * 60;
    let timeLeft = timeLimit;
    const timerDiv = document.getElementById('timer');
    timerInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDiv.textContent = `Калган убакыт: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

// Тестти тапшыруу
function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / 30 * 100).toFixed(2);
    const knowledge = percentage >= 80 ? 'Жогорку' : percentage >= 50 ? 'Орточо' : 'Төмөн';

    localStorage.setItem('score', score);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);

    // Сохранение результатов в профиль пользователя
    if (currentUser) {
        const testKey = `${testType}_${currentSubject}_part${currentPart}`;
        currentUser.testResults[testKey] = { score, percentage, knowledge, date: new Date().toLocaleString() };
        currentUser.knowledgeAreas[currentSubject] = knowledge;
        saveUsers();
    }

    window.location.href = 'results.html';
}

// Башкы бетке кайтуу
function backToMain() {
    localStorage.removeItem('subject');
    localStorage.removeItem('part');
    window.location.href = 'index.html';
}

// Курстар
function quickSelectCourse(subject) {
    if (subject) {
        localStorage.setItem('courseSubject', subject);
        window.location.href = 'courses.html';
    }
}

function showCourses() {
    window.location.href = 'courses.html';
}

function startCourseLesson() {
    const subject = localStorage.getItem('courseSubject');
    if (currentUser) {
        currentUser.courseProgress[subject] = { progress: 50, lastLesson: 'Тема 1' }; // Пример прогресса
        saveUsers();
    }
    alert('Урок башталды!');
}

// Показ результатов
function showResults(subject) {
    const resultsDiv = document.getElementById('results-content');
    if (!subject) {
        resultsDiv.innerHTML = '';
        return;
    }
    if (currentUser && currentUser.testResults) {
        let html = '';
        for (let key in currentUser.testResults) {
            if (key.includes(subject)) {
                const result = currentUser.testResults[key];
                html += `<p>${key}: Балл: ${result.score}/30, Пайыз: ${result.percentage}%, Билим деңгээли: ${result.knowledge}, Күнү: ${result.date}</p>`;
            }
        }
        resultsDiv.innerHTML = html || 'Жыйынтыктар жок.';
    }
}

// Продолжение курсов
function showContinueContent() {
    const continueDiv = document.getElementById('continue-content');
    if (currentUser && currentUser.courseProgress) {
        let html = '';
        for (let subject in currentUser.courseProgress) {
            const progress = currentUser.courseProgress[subject];
            html += `<p>${subject}: Прогресс: ${progress.progress}%, Акыркы урок: ${progress.lastLesson}</p>`;
        }
        continueDiv.innerHTML = html || 'Улантуу үчүн курстар жок.';
    }
}