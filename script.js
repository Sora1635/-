// Глобальные переменные
let currentLang = localStorage.getItem('lang') || 'ky';
let currentSubject = localStorage.getItem('subject');
let currentPart = localStorage.getItem('part');
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = null;
let timerInterval = null;
let timeLeft = 0;

// Вопросы
const questions = {
    math: {
        part1: {
            time: 30,
            questions: [
                { question: "2 + 2 канча болот?", options: { a: "3", б: "4", в: "5", г: "6" }, correct: "б" },
                { question: "5 - 3 канча болот?", options: { a: "1", б: "2", в: "3", г: "4" }, correct: "б" },
                { question: "3 * 4 канча болот?", options: { a: "6", б: "8", в: "10", г: "12" }, correct: "г" },
                { question: "10 / 2 канча болот?", options: { a: "2", б: "4", в: "5", г: "6" }, correct: "в" },
                { question: "7 + 8 канча болот?", options: { a: "13", б: "15", в: "16", г: "17" }, correct: "б" },
                { question: "9 - 4 канча болот?", options: { a: "3", б: "5", в: "6", г: "7" }, correct: "б" },
                { question: "6 * 3 канча болот?", options: { a: "9", б: "12", в: "15", г: "18" }, correct: "г" },
                { question: "20 / 5 канча болот?", options: { a: "2", б: "4", в: "5", г: "10" }, correct: "в" },
                { question: "12 + 13 канча болот?", options: { a: "23", б: "25", в: "26", г: "27" }, correct: "б" },
                { question: "15 - 7 канча болот?", options: { a: "6", б: "8", в: "9", г: "10" }, correct: "б" }
            ]
        },
        part2: {
            time: 60,
            questions: [
                { question: "2^2 канча болот?", options: { a: "2", б: "4", в: "6", г: "8" }, correct: "б" },
                { question: "2^3 канча болот?", options: { a: "4", б: "6", в: "8", г: "10" }, correct: "в" }
            ]
        }
    },
    kyrgyz: {
        part1: {
            time: 30,
            questions: [
                { question: "'күн' сөзү эмнени билдирет?", options: { a: "Ай", б: "Жылдыз", в: "Күн", г: "Суу" }, correct: "в" },
                { question: "'ай' сөзү эмнени билдирет?", options: { a: "Ай", б: "Жылдыз", в: "Күн", г: "Суу" }, correct: "а" }
            ]
        },
        part2: {
            time: 60,
            questions: [
                { question: "'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", б: "Тоо", в: "Токой", г: "Жол" }, correct: "б" },
                { question: "'көл' сөзү эмнени билдирет?", options: { a: "Дарыя", б: "Көл", в: "Токой", г: "Жол" }, correct: "б" }
            ]
        }
    },
    manas: {
        part1: {
            time: 30,
            questions: [
                { question: "Манас ким?", options: { a: "Алтай", б: "Манас", в: "Каныкей", г: "Семетей" }, correct: "б" },
                { question: "Каныкей ким?", options: { a: "Манастын аялы", б: "Манастын уулу", в: "Манастын душманы", г: "Манастын атасы" }, correct: "а" }
            ]
        },
        part2: {
            time: 60,
            questions: [
                { question: "Семетей ким?", options: { a: "Манастын уулу", б: "Манастын аялы", в: "Манастын душманы", г: "Манастын атасы" }, correct: "а" },
                { question: "Айчүрөк ким?", options: { a: "Семетейдин аялы", б: "Манастын аялы", в: "Манастын энеси", г: "Манастын душманы" }, correct: "а" }
            ]
        }
    }
};

// Переключение языка
function switchLanguage(lang) {
    console.log('Переключение языка:', lang);
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

// Обновление текстов
function updateTexts() {
    console.log('Обновление текстов:', currentLang);
    document.querySelectorAll('[data-lang-ky][data-lang-ru]').forEach(el => {
        const text = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
        if (el.tagName === 'BUTTON' && el.querySelector('i')) {
            const icon = el.querySelector('i');
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + text));
        } else {
            el.textContent = text;
        }
    });

    // Обновление заголовка предмета
    const subjectTitle = document.getElementById('subject-title');
    if (subjectTitle && currentSubject) {
        const subjectName = currentSubject === 'math' ? (currentLang === 'ky' ? 'Математика' : 'Математика') :
                           currentSubject === 'kyrgyz' ? (currentLang === 'ky' ? 'Кыргыз тили' : 'Кыргызский язык') :
                           (currentLang === 'ky' ? 'Манас таануу' : 'Манасоведение');
        subjectTitle.textContent = (currentLang === 'ky' ? 'Предмет: ' : 'Предмет: ') + subjectName;
    }

    // Обновление информации о части
    const partDescription = document.getElementById('part-description');
    if (partDescription && currentSubject && currentPart) {
        const partData = questions[currentSubject][`part${currentPart}`];
        if (partData) {
            partDescription.textContent = currentLang === 'ky'
                ? `Суроолордун саны: ${partData.questions.length}, Убакыт: ${partData.time} мүнөт`
                : `Количество вопросов: ${partData.questions.length}, Время: ${partData.time} минут`;
        }
    }

    // Обновление результатов
    const resultsDetails = document.getElementById('results-details');
    if (resultsDetails) {
        const score = localStorage.getItem('score');
        const totalQuestions = localStorage.getItem('totalQuestions');
        const percentage = localStorage.getItem('percentage');
        const knowledge = localStorage.getItem('knowledge');
        if (score && totalQuestions && percentage && knowledge) {
            resultsDetails.innerHTML = `${currentLang === 'ky' ? 'Балл' : 'Баллы'}: ${score}/${totalQuestions}<br>` +
                                      `${currentLang === 'ky' ? 'Пайыз' : 'Процент'}: ${percentage}%<br>` +
                                      `${currentLang === 'ky' ? 'Билим деңгээли' : 'Уровень знаний'}: ${knowledge}`;
        }
    }

    // Обновление таймера
    const timerElement = document.getElementById('timer');
    if (timerElement && timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Выбор предмета
function selectSubject(subject) {
    console.log('Выбор предмета:', subject);
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Выбор части
function selectPart(part) {
    console.log('Выбор части:', part);
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Начало теста
function startTest() {
    console.log('Начало теста:', { currentSubject, currentPart });
    window.location.href = 'test.html';
}

// Загрузка теста
function loadTest() {
    console.log('Загрузка теста:', { currentSubject, currentPart });
    currentSubject = localStorage.getItem('subject');
    currentPart = localStorage.getItem('part');

    if (!currentSubject || !currentPart) {
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        window.location.href = 'index.html';
        return;
    }

    const partData = questions[currentSubject][`part${currentPart}`];
    if (!partData) {
        alert(currentLang === 'ky' ? 'Бөлүк табылган жок!' : 'Часть не найдена!');
        window.location.href = 'index.html = 'index.html';
        return;
    }

    currentTest = partData.questions;
    currentQuestionIndex = 0;
    userAnswers = Array(currentTest.length).fill(null);
    console.log('Тест загружен:', { questionCount: currentTest.length, time: partData.time });
    displayQuestion();
    startTimer(partData.time);
}

// Отображение вопроса
function displayQuestion() {
    console.log('Отображение вопроса:', currentQuestionIndex);
    const questionCounter = document.getElementById('question-counter');
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');

    if (!questionCounter || !questionsDiv || !answersDiv || !currentTest) {
        alert(currentLang === 'ky' ? 'Тест жүктөлүүдө ката кетти!' : 'Ошибка загрузки теста!');
        window.location.href = 'index.html';
        return;
    }

    questionCounter.textContent = `${currentQuestionIndex + 1}/${currentTest.length}`;
    questionsDiv.textContent = currentTest[currentQuestionIndex].question;
    answersDiv.innerHTML = '';

    for (let option in currentTest[currentQuestionIndex].options) {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.innerHTML = `<input type="radio" name="answer" value="${option}" ${userAnswers[currentQuestionIndex] === option ? 'checked' : ''}>${option.toUpperCase()}. ${currentTest[currentQuestionIndex].options[option]}`;
        answersDiv.appendChild(label);
        answersDiv.appendChild(document.createElement('br'));
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', e => {
            userAnswers[currentQuestionIndex] = e.target.value;
            console.log('Ответ выбран:', e.target.value);
        });
    });
}

// Предыдущий вопрос
function prevQuestion() {
    console.log('Предыдущий вопрос');
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Следующий вопрос
function nextQuestion() {
    console.log('Следующий вопрос');
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Запуск таймера
function startTimer(minutes) {
    console.log('Запуск таймера:', minutes, 'минут');
    timeLeft = minutes * 60;
    const timerElement = document.getElementById('timer');

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            console.log('Время истекло');
            submitTest();
            return;
        }
        const minutesLeft = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutesLeft}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
    }, 1000);
}

// Отправка теста
function submitTest() {
    console.log('Отправка теста');
    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / currentTest.length * 100).toFixed(2);
    const knowledge = percentage >= 80 ? (currentLang === 'ky' ? 'Жогорку' : 'Высокий') :
                     percentage >= 50 ? (currentLang === 'ky' ? 'Орточо' : 'Средний') :
                     (currentLang === 'ky' ? 'Төмөн' : 'Низкий');

    console.log('Результаты:', { score, total: currentTest.length, percentage, knowledge });
    localStorage.setItem('score', score);
    localStorage.setItem('totalQuestions', currentTest.length);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);
    window.location.href = 'results.html';
}

// Возврат на главную
function back() {
    console.log('Возврат на главную');
    window.location.href = 'index.html';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация страницы');

    // Обработчики для index.html
    const mathButton = document.getElementById('subject-math');
    const kyrgyzButton = document.getElementById('subject-kyrgyz');
    const manasButton = document.getElementById('subject-manas');
    if (mathButton) mathButton.onclick = () => selectSubject('math');
    if (kyrgyzButtonButton) kyrgyzButton.onclick = () => selectSubject('kyrgyz');
    if (manasButton) manasButton.onclick = () => selectSubject('manas');

    // Обработчики для subject.html
    const part1Button = document.getElementById('part-1');
    const part2Button = document.getElementById('part-2');
    if (part1Button) part1Button.onclick = () => selectPart('1');
    if (part2Button) part2Button.onclick = () => selectPart('2');

    // Обработчики для part-details.html
    const startTestButton = document.getElementById('start-test');
    if (startTestButton) startTestButton.onclick = startTest;

    // Обработчики для test.html
    const prevQuestionButton = document.getElementById('prev-question');
    const nextQuestionButton = document.getElementById('next-question');
    const submitTestButton = document.getElementById('submit-test');
    if (prevQuestionButton) prevQuestionButton.onclick = prevQuestion;
    if (nextQuestionButton) nextQuestionButton.onclick = nextQuestion;
    if (submitTestButton) submitTestButton.onclick = submitTest;

    // Обработчики для всех страниц
    const langKyButton = document.getElementById('lang-ky');
    const langRuButton = document.getElementById('lang-ru');
    const backButton = document.getElementById('back-main');
    if (langKyButton) langKyButton.onclick = () => switchLanguage('ky');
    if (langRuButton) langRuButton.onclick = () => switchLanguage('ru');
    if (backButton) backButton.onclick = back;

    updateTexts();
});() => selectSubject('kyrgyz'));
    if (manasButton) manasButton.addEventListener('click', () => selectSubject('manas'));

    // Обработчики для subject.html
    const part1Button = document.getElementById('part-1');
    const part2Button = document.getElementById('part-2');
    const backButtonSubject = document.getElementById('back-main');
    if (part1Button) part1Button.addEventListener('click', () => selectPart('1'));
    if (part2Button) part2Button.addEventListener('click', () => selectPart('2'));
    if (backButtonSubject) backButtonSubject.addEventListener('click', backToMain);

    // Обработчики для part-details.html
    const startTestButton = document.getElementById('start-test');
    const backButtonPart = document.getElementById('back-main');
    if (startTestButton) startTestButton.addEventListener('click', startTest);
    if (backButtonPart) backButtonPart.addEventListener('click', backToMain);

    // Обработчики для test.html
    const prevQuestionButton = document.getElementById('prev-question');
    const nextQuestionButton = document.getElementById('next-question');
    const submitTestButton = document.getElementById('submit-test');
    const backButtonTest = document.getElementById('back-main-test');
    if (prevQuestionButton) prevQuestionButton.addEventListener('click', prevQuestion);
    if (nextQuestionButton) nextQuestionButton.addEventListener('click', nextQuestion);
    if (submitTestButton) submitTestButton.addEventListener('click', submitTest);
    if (backButtonTest) backButtonTest.addEventListener('click', backToMain);

    // Обработчики для results.html
    const backButtonResults = document.getElementById('back-main');
    if (backButtonResults) backButtonResults.addEventListener('click', backToMain);

    // Обработчики для courses.html
    const startLessonButton = document.getElementById('start-lesson');
    const backLinkCourses = document.getElementById('back-main');
    const courseMath = document.getElementById('course-math');
    const courseKyrgyz = document.getElementById('course-kyrgyz');
    const courseManas = document.getElementById('course-manas');
    if (startLessonButton) startLessonButton.addEventListener('click', startCourseLesson);
    if (backLinkCourses) backLinkCourses.addEventListener('click', backToMain);
    if (courseMath) courseMath.addEventListener('click', () => {
        localStorage.setItem('courseSubject', 'math');
        updateTexts();
    });
    if (courseKyrgyz) courseKyrgyz.addEventListener('click', () => {
        localStorage.setItem('courseSubject', 'kyrgyz');
        updateTexts();
    });
    if (courseManas) courseManas.addEventListener('click', () => {
        localStorage.setItem('courseSubject', 'manas');
        updateTexts();
    });

    // Обновление текстов при загрузке
    updateTexts();

    // Обновление информации о части для part-details.html
    if (window.location.pathname.includes('part-details.html')) {
        updatePartDetails();
    }
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initializeEventListeners();
});ocation.href = 'results.html';
}

// Возврат на главную
function backToMain() {
    console.log('backToMain called');
    window.location.href = 'index.html';
}

// Начало урока
function startCourseLesson() {
    console.log('startCourseLesson called');
    alert(currentLang === 'ky' ? 'Урок башталды!' : 'Урок начался!');
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    console.log('Initializing event listeners');

    // index.html
    const mathButton = document.getElementById('subject-math');
    const kyrgyzButton = document.getElementById('subject-kyrgyz');
    const manasButton = document.getElementById('subject-manas');
    const langKyButton = document.getElementById('lang-ky');
    const langRuButton = document.getElementById('lang-ru');

    if (mathButton) mathButton.addEventListener('click', () => selectSubject('math'));
    if (kyrgyzButton) kyrgyzButton.addEventListener('click', () => selectSubject('kyrgyz'));
    if (manasButton) manasButton.addEventListener('click', () => selectSubject('manas'));
    if (langKyButton) langKyButton.addEventListener('click', () => switchLanguage('ky'));
    if (langRuButton) langRuButton.addEventListener('click', () => switchLanguage('ru'));

    // subject.html
    const part1Button = document.getElementById('part-1');
    const part2Button = document.getElementById('part-2');
    const backButtonSubject = document.getElementById('back-main-subject');

    if (part1Button) part1Button.addEventListener('click', () => selectPart('1'));
    if (part2Button) part2Button.addEventListener('click', () => selectPart('2'));
    if (backButtonSubject) backButtonSubject.addEventListener('click', backToMain);

    // part-details.html
    const startTestButton = document.getElementById('start-test');
    const backButtonPart = document.getElementById('back-main-part');

    if (startTestButton) startTestButton.addEventListener('click', startTest);
    if (backButtonPart) backButtonPart.addEventListener('click', backToMain);

    // test.html
    const prevQuestionButton = document.getElementById('prev-question');
    const nextQuestionButton = document.getElementById('next-question');
    const submitTestButton = document.getElementById('submit-test');
    const backButtonTest = document.getElementById('back-main-test');

    if (prevQuestionButton) prevQuestionButton.addEventListener('click', prevQuestion);
    if (nextQuestionButton) nextQuestionButton.addEventListener('click', nextQuestion);
    if (submitTestButton) submitTestButton.addEventListener('click', submitTest);
    if (backButtonTest) backButtonTest.addEventListener('click', backToMain);

    // results.html
    const backButtonResults = document.getElementById('back-main-results');
    if (backButtonResults) backButtonResults.addEventListener('click', backToMain);

    // courses.html
    const startLessonButton = document.getElementById('start-lesson');
    const backLinkCourses = document.getElementById('back-main-courses');
    if (startLessonButton) startLessonButton.addEventListener('click', startCourseLesson);
    if (backLinkCourses) backLinkCourses.addEventListener('click', backToMain);
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initializeEventListeners();
});