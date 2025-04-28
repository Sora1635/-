let currentSubject = localStorage.getItem('subject') || '';
let currentPart = localStorage.getItem('part') || 0;
let currentTest = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let userAnswers = Array(30).fill(null);

// Все вопросы встроены прямо в код
const questions = {
    math_part1: [
        {
            question: "2 + 2 канча болот?",
            options: { a: "3", б: "4", в: "5", г: "6" },
            correct: "б"
        },
        {
            question: "5 - 3 канча болот?",
            options: { a: "1", б: "2", в: "3", г: "4" },
            correct: "б"
        },
        {
            question: "3 * 4 канча болот?",
            options: { a: "6", б: "8", в: "10", г: "12" },
            correct: "г"
        },
        {
            question: "10 / 2 канча болот?",
            options: { a: "2", б: "4", в: "5", г: "6" },
            correct: "в"
        },
        {
            question: "7 + 8 канча болот?",
            options: { a: "13", б: "15", в: "16", г: "17" },
            correct: "б"
        },
        {
            question: "9 - 4 канча болот?",
            options: { a: "3", б: "5", в: "6", г: "7" },
            correct: "б"
        },
        {
            question: "6 * 3 канча болот?",
            options: { a: "9", б: "12", в: "15", г: "18" },
            correct: "г"
        },
        {
            question: "20 / 5 канча болот?",
            options: { a: "2", б: "4", в: "5", г: "10" },
            correct: "в"
        },
        {
            question: "12 + 13 канча болот?",
            options: { a: "23", б: "25", в: "26", г: "27" },
            correct: "б"
        },
        {
            question: "15 - 7 канча болот?",
            options: { a: "6", б: "8", в: "9", г: "10" },
            correct: "б"
        },
        {
            question: "8 * 9 канча болот?",
            options: { a: "64", б: "72", в: "78", г: "81" },
            correct: "б"
        },
        {
            question: "24 / 6 канча болот?",
            options: { a: "3", б: "4", в: "5", г: "6" },
            correct: "б"
        },
        {
            question: "17 + 18 канча болот?",
            options: { a: "33", б: "35", в: "36", г: "37" },
            correct: "б"
        },
        {
            question: "22 - 9 канча болот?",
            options: { a: "11", б: "12", в: "13", г: "14" },
            correct: "в"
        },
        {
            question: "7 * 8 канча болот?",
            options: { a: "49", б: "56", в: "58", г: "64" },
            correct: "б"
        },
        {
            question: "30 / 5 канча болот?",
            options: { a: "5", б: "6", в: "7", г: "8" },
            correct: "б"
        },
        {
            question: "23 + 24 канча болот?",
            options: { a: "45", б: "46", в: "47", г: "48" },
            correct: "в"
        },
        {
            question: "28 - 12 канча болот?",
            options: { a: "14", б: "16", в: "18", г: "20" },
            correct: "б"
        },
        {
            question: "9 * 10 канча болот?",
            options: { a: "80", б: "90", в: "95", г: "100" },
            correct: "б"
        },
        {
            question: "40 / 8 канча болот?",
            options: { a: "4", б: "5", в: "6", г: "7" },
            correct: "б"
        },
        {
            question: "31 + 32 канча болот?",
            options: { a: "61", б: "62", в: "63", г: "64" },
            correct: "в"
        },
        {
            question: "35 - 15 канча болот?",
            options: { a: "18", б: "20", в: "22", г: "25" },
            correct: "б"
        },
        {
            question: "11 * 12 канча болот?",
            options: { a: "121", б: "132", в: "133", г: "144" },
            correct: "б"
        },
        {
            question: "50 / 10 канча болот?",
            options: { a: "4", б: "5", в: "6", г: "7" },
            correct: "б"
        },
        {
            question: "42 + 43 канча болот?",
            options: { a: "83", б: "84", в: "85", г: "86" },
            correct: "в"
        },
        {
            question: "47 - 23 канча болот?",
            options: { a: "22", б: "24", в: "26", г: "28" },
            correct: "б"
        },
        {
            question: "13 * 14 канча болот?",
            options: { a: "169", б: "170", в: "182", г: "184" },
            correct: "в"
        },
        {
            question: "60 / 15 канча болот?",
            options: { a: "3", б: "4", в: "5", г: "6" },
            correct: "б"
        },
        {
            question: "55 + 56 канча болот?",
            options: { a: "109", б: "110", в: "111", г: "112" },
            correct: "в"
        },
        {
            question: "60 - 25 канча болот?",
            options: { a: "33", б: "35", в: "37", г: "40" },
            correct: "б"
        }
    ],
    math_part2: [
        // Пример для Математики, часть 2
        {
            question: "2^3 канча болот?",
            options: { a: "6", б: "8", в: "10", г: "12" },
            correct: "б"
        }
        // Добавьте ещё 29 вопросов для math_part2
    ],
    kyrgyz_part1: [
        {
            question: "Кыргыз тилинде 'күн' сөзү эмнени билдирет?",
            options: { a: "Ай", б: "Жылдыз", в: "Күн", г: "Суу" },
            correct: "в"
        }
        // Добавьте ещё 29 вопросов для kyrgyz_part1
    ],
    kyrgyz_part2: [
        {
            question: "Кыргыз тилинде 'тоо' сөзү эмнени билдирет?",
            options: { a: "Дарыя", б: "Тоо", в: "Токой", г: "Жол" },
            correct: "б"
        }
        // Добавьте ещё 29 вопросов для kyrgyz_part2
    ]
};

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
    userAnswers = Array(30).fill(null); // Сбрасываем ответы
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
            <p>б) ${q.options.b}</p>
            <p>в) ${q.options.c}</p>
            <p>г) ${q.options.d}</p>
        </div>
    `;
    answersDiv.innerHTML = `
        <div class="answer-row">
            <span>${currentQuestionIndex + 1}.</span>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="a" ${userAnswers[currentQuestionIndex] === 'a' ? 'checked' : ''}> a</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="б" ${userAnswers[currentQuestionIndex] === 'б' ? 'checked' : ''}> б</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="в" ${userAnswers[currentQuestionIndex] === 'в' ? 'checked' : ''}> в</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="г" ${userAnswers[currentQuestionIndex] === 'г' ? 'checked' : ''}> г</label>
        </div>
    `;
    questionCounter.textContent = `${currentQuestionIndex + 1}/30`;

    // Сохраняем выбор пользователя
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
    window.location.href = 'results.html';
}

// Башкы бетке кайтуу
function backToMain() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Бөлүк жөнүндө маалымат барагы үчүн инициализация
if (window.location.pathname.includes('part-details.html')) {
    updatePartDetails();
}