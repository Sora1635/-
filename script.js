// Глобальные переменные
let currentLang = localStorage.getItem('lang') || 'ky';
let currentSubject = null;
let currentPart = null;
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = null;
let timerInterval = null;
let timeLeft = 0;
let totalQuestions = 0;

// Утилита для безопасного доступа к данным
const safeGet = (obj, path, defaultValue = null) => {
    try {
        return path.reduce((o, k) => o && o[k], obj) || defaultValue;
    } catch (e) {
        console.error('Error accessing data:', e);
        return defaultValue;
    }
};

// Переключение языка
function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    if (!['ky', 'ru'].includes(lang)) {
        console.error('Invalid language:', lang);
        return;
    }
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

// Обновление текстов
function updateTexts() {
    console.log('Updating texts for language:', currentLang);
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
        const subjects = {
            math: { ky: 'Математика', ru: 'Математика' },
            kyrgyz: { ky: 'Кыргыз тили', ru: 'Кыргызский язык' },
            manas: { ky: 'Манас таануу', ru: 'Манасоведение' }
        };
        const name = safeGet(subjects, [currentSubject, currentLang], '');
        subjectTitle.textContent = (currentLang === 'ky' ? 'Предмет: ' : 'Предмет: ') + name;
    }

    // Обновление информации о части
    const partDescription = document.getElementById('part-description');
    if (partDescription && currentSubject && currentPart) {
        const partData = safeGet(questions, [currentSubject, `part${currentPart}`]);
        if (partData) {
            const numQuestions = safeGet(partData, ['variant1', 'length'], 0);
            const time = partData.time || 0;
            partDescription.textContent = currentLang === 'ky'
                ? `Суроолордун саны: ${numQuestions}, Убакыт: ${time} мүнөт`
                : `Количество вопросов: ${numQuestions}, Время: ${time} минут`;
        }
    }

    // Обновление результатов
    const resultsDetails = document.getElementById('results-details');
    if (resultsDetails) {
        const score = localStorage.getItem('score');
        const percentage = localStorage.getItem('percentage');
        const knowledge = localStorage.getItem('knowledge');
        const total = localStorage.getItem('totalQuestions');
        if (score && percentage && knowledge && total) {
            resultsDetails.innerHTML = `${currentLang === 'ky' ? 'Балл' : 'Баллы'}: ${score}/${total}<br>` +
                                      `${currentLang === 'ky' ? 'Пайыз' : 'Процент'}: ${percentage}%<br>` +
                                      `${currentLang === 'ky' ? 'Билим деңгээли' : 'Уровень знаний'}: ${knowledge}`;
        }
    }

    // Обновление таймера
    const timerElement = document.getElementById('timer');
    if (timerElement && timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Выбор предмета
function selectSubject(subject) {
    console.log('selectSubject called with:', subject);
    if (!['math', 'kyrgyz', 'manas'].includes(subject)) {
        console.error('Invalid subject:', subject);
        alert(currentLang === 'ky' ? 'Предмет тандалган жок!' : 'Предмет не выбран!');
        return;
    }
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Выбор части
function selectPart(part) {
    console.log('selectPart called with:', part);
    if (!['1', '2'].includes(part)) {
        console.error('Invalid part:', part);
        alert(currentLang === 'ky' ? 'Бөлүк тандалган жок!' : 'Часть не выбрана!');
        return;
    }
    if (!currentSubject) {
        console.error('Subject not set');
        alert(currentLang === 'ky' ? 'Предмет тандалган жок!' : 'Предмет не выбран!');
        window.location.href = 'index.html';
        return;
    }
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Начало теста
function startTest() {
    console.log('startTest called with:', { currentSubject, currentPart });
    if (!currentSubject || !currentPart) {
        console.error('Subject or part not set:', { currentSubject, currentPart });
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        window.location.href = 'index.html';
        return;
    }
    localStorage.setItem('subject', currentSubject);
    localStorage.setItem('part', currentPart);
    window.location.href = 'test.html';
}

// Загрузка теста
function loadTest() {
    console.log('loadTest called');
    currentSubject = localStorage.getItem('subject');
    currentPart = localStorage.getItem('part');
    console.log('Loaded subject and part:', { currentSubject, currentPart });

    if (!currentSubject || !currentPart) {
        console.error('Subject or part missing');
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        window.location.href = 'index.html';
        return;
    }

    const partData = safeGet(questions, [currentSubject, `part${currentPart}`]);
    if (!partData) {
        console.error('Part data not found:', { currentSubject, currentPart });
        alert(currentLang === 'ky' ? 'Бөлүк маалыматы табылган жок!' : 'Данные части не найдены!');
        window.location.href = 'index.html';
        return;
    }

    const variants = Object.keys(partData).filter(key => key.startsWith('variant'));
    if (!variants.length) {
        console.error('No variants found');
        alert(currentLang === 'ky' ? 'Тест варианттары табылган жок!' : 'Варианты теста не найдены!');
        window.location.href = 'index.html';
        return;
    }

    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    currentTest = partData[randomVariant];
    totalQuestions = currentTest.length;
    currentQuestionIndex = 0;
    userAnswers = Array(totalQuestions).fill(null);
    console.log('Test loaded:', { variant: randomVariant, totalQuestions });
    displayQuestion();
    startTimer();
}

// Отображение вопроса
function displayQuestion() {
    console.log('displayQuestion called, index:', currentQuestionIndex);
    const questionCounter = document.getElementById('question-counter');
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');

    if (!questionCounter || !questionsDiv || !answersDiv || !currentTest) {
        console.error('Required elements or test data missing:', { questionCounter, questionsDiv, answersDiv, currentTest });
        alert(currentLang === 'ky' ? 'Тест жүктөлүүдө ката кетти!' : 'Ошибка загрузки теста!');
        window.location.href = 'index.html';
        return;
    }

    questionCounter.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
    questionsDiv.textContent = currentTest[currentQuestionIndex].question;
    answersDiv.innerHTML = '';

    for (let option in currentTest[currentQuestionIndex].options) {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.innerHTML = `<input type="radio" name="answer" value="${option}" ${userAnswers[currentQuestionIndex] === option ? 'checked' : ''}> ${option.toUpperCase()}. ${currentTest[currentQuestionIndex].options[option]}`;
        answersDiv.appendChild(label);
        answersDiv.appendChild(document.createElement('br'));
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userAnswers[currentQuestionIndex] = e.target.value;
            console.log('Answer selected:', e.target.value);
        });
    });
}

// Переключение вопросов
function prevQuestion() {
    console.log('prevQuestion called');
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    console.log('nextQuestion called');
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Запуск таймера
function startTimer() {
    console.log('startTimer called');
    const partData = safeGet(questions, [currentSubject, `part${currentPart}`]);
    if (!partData || !partData.time) {
        console.error('Time data missing');
        alert(currentLang === 'ky' ? 'Убакыт маалыматы табылган жок!' : 'Данные о времени не найдены!');
        window.location.href = 'index.html';
        return;
    }

    timeLeft = partData.time * 60;
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error('Timer element missing');
        alert(currentLang === 'ky' ? 'Таймер табылган жок!' : 'Таймер не найден!');
        return;
    }

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            console.log('Timer ended');
            clearInterval(timerInterval);
            submitTest();
            return;
        }
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
    }, 1000);
}

// Отправка теста
function submitTest() {
    console.log('submitTest called');
    if (!currentTest) {
        console.error('Test data missing');
        alert(currentLang === 'ky' ? 'Тест маалыматы жок!' : 'Нет данных теста!');
        window.location.href = 'index.html';
        return;
    }

    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / totalQuestions * 100).toFixed(2);
    const knowledge = percentage >= 80 ? (currentLang === 'ky' ? 'Жогорку' : 'Высокий') :
                     percentage >= 50 ? (currentLang === 'ky' ? 'Орточо' : 'Средний') :
                     (currentLang === 'ky' ? 'Төмөн' : 'Низкий');

    console.log('Test results:', { score, percentage, knowledge, totalQuestions });
    localStorage.setItem('score', score);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);
    localStorage.setItem('totalQuestions', totalQuestions);
    window.location.href = 'results.html';
}

// Возврат на главную
function back масло backToMain() {
    console.log('backToMain called');
    window.location.href = 'index.html';
}

// Начало урока
function startCourseLesson() {
    console.log('startCourseLesson called');
    alert(currentLang === 'ky' ? 'Урок башталды!' : 'Урок начался!');
}

// Инициализация
function initialize() {
    console.log('Initializing event listeners');

    // Кнопки предметов
    ['math', 'kyrgyz', 'manas'].forEach(subject => {
        const btn = document.getElementById(`subject-${subject}`);
        if (btn) btn.addEventListener('click', () => selectSubject(subject));
    });

    // Кнопки частей
    ['1', '2'].forEach(part => {
        const btn = document.getElementById(`part-${part}`);
        if (btn) btn.addEventListener('click', () => selectPart(part));
    });

    // Кнопки языка
    ['ky', 'ru'].forEach(lang => {
        const btn = document.getElementById(`lang-${lang}`);
        if (btn) btn.addEventListener('click', () => switchLanguage(lang));
    });

    // Кнопки навигации теста
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const submitBtn = document.getElementById('submit-test');
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (submitBtn) submitBtn.addEventListener('click', submitTest);

    // Кнопки возврата
    document.querySelectorAll('#back-main').forEach(btn => {
        btn.addEventListener('click', backToMain);
    });

    // Кнопка начала теста
    const startTestBtn = document.getElementById('start-test');
    if (startTestBtn) startTestBtn.addEventListener('click', startTest);

    // Кнопка начала урока
    const startLessonBtn = document.getElementById('start-lesson');
    if (startLessonBtn) startLessonBtn.addEventListener('click', startCourseLesson);

    // Обновление текстов
    updateTexts();

    // Загрузка теста на странице test.html
    if (window.location.pathname.includes('test.html')) {
        loadTest();
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', initialize);