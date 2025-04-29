let currentLang = localStorage.getItem('lang') || 'ky';
let currentSubject, currentPart, currentTest, currentQuestionIndex, userAnswers, timerInterval, timeLeft;
let currentUser = localStorage.getItem('currentUser');
let userData = JSON.parse(localStorage.getItem('userData')) || { testResults: {}, knowledgeAreas: {} };
let testType = 'subject';

const questions = {
    math: {
        part1: {
            variant1: [
                { question: "2 + 2 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
                { question: "5 - 3 канча болот?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "b" },
                // Добавьте ещё 28 вопросов (всего 30)
            ],
            variant2: [
                { question: "3 + 4 канча болот?", options: { a: "5", b: "7", c: "8", d: "9" }, correct: "b" },
                { question: "10 - 6 канча болот?", options: { a: "2", b: "3", c: "4", d: "5" }, correct: "c" },
                // Добавьте ещё 28 вопросов (всего 30)
            ],
        },
        part2: {
            variant1: [
                { question: "2^3 канча болот?", options: { a: "6", b: "8", c: "10", d: "12" }, correct: "b" },
                // Добавьте ещё 29 вопросов
            ],
            variant2: [
                { question: "3^3 канча болот?", options: { a: "9", b: "18", c: "27", d: "36" }, correct: "c" },
                // Добавьте ещё 29 вопросов
            ],
        },
    },
    kyrgyz: {
        part1: {
            variant1: [
                { question: "Кыргыз тилинде 'күн' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "c" },
                // Добавьте ещё 29 вопросов
            ],
            variant2: [
                { question: "Кыргыз тилинде 'ай' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "a" },
                // Добавьте ещё 29 вопросов
            ],
        },
        part2: {
            variant1: [
                { question: "Кыргыз тилинде 'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Тоо", c: "Токой", d: "Жол" }, correct: "b" },
                // Добавьте ещё 29 вопросов
            ],
            variant2: [
                { question: "Кыргыз тилинде 'көл' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Көл", c: "Токой", d: "Жол" }, correct: "b" },
                // Добавьте ещё 29 вопросов
            ],
        },
    },
    manas: {
        part1: {
            variant1: [
                { question: "Манас эпосунда ким башкы каарман?", options: { a: "Алтай", b: "Манас", c: "Каныкей", d: "Семетей" }, correct: "b" },
                // Добавьте ещё 29 вопросов
            ],
            variant2: [
                { question: "Манас эпосунда Каныкей ким?", options: { a: "Манастын аялы", b: "Манастын уулу", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
                // Добавьте ещё 29 вопросов
            ],
        },
        part2: {
            variant1: [
                { question: "Манас эпосунда Семетей ким?", options: { a: "Манастын уулу", b: "Манастын аялы", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
                // Добавьте ещё 29 вопросов
            ],
            variant2: [
                { question: "Манас эпосунда Айчүрөк ким?", options: { a: "Семетейдин аялы", b: "Манастын аялы", c: "Манастын энеси", d: "Манастын душманы" }, correct: "a" },
                // Добавьте ещё 29 вопросов
            ],
        },
    },
};

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

function updateTexts() {
    if (!currentLang) {
        console.error('currentLang is not defined in updateTexts, defaulting to "ky"');
        currentLang = 'ky';
    }

    document.querySelectorAll('[data-lang-ky], [data-lang-ru]').forEach(el => {
        el.textContent = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
    });
    document.querySelectorAll('textarea').forEach(el => {
        el.placeholder = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
    });
    document.querySelectorAll('select option').forEach(option => {
        if (option.value) {
            option.textContent = currentLang === 'ky' ? option.getAttribute('data-lang-ky') : option.getAttribute('data-lang-ru');
        }
    });
}

function selectSubject(subject) {
    if (!subject) {
        console.error('Subject is not defined in selectSubject!');
        alert(currentLang === 'ky' ? 'Предмет тандалган жок!' : 'Предмет не выбран!');
        return;
    }
    console.log('Selecting subject:', subject);
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    try {
        window.location.href = 'subject.html';
    } catch (error) {
        console.error('Navigation to subject.html failed:', error);
        alert(currentLang === 'ky' ? 'Навигацияда ката кетти!' : 'Ошибка навигации!');
    }
}

function selectPart(part) {
    if (!part) {
        console.error('Part is not defined in selectPart!');
        alert(currentLang === 'ky' ? 'Бөлүк тандалган жок!' : 'Часть не выбрана!');
        return;
    }

    const currentSubject = localStorage.getItem('subject');
    if (!currentSubject) {
        console.error('Subject is not set before selecting part!');
        alert(currentLang === 'ky' ? 'Предмет тандалган жок! Башкы бетке кайтыңыз.' : 'Предмет не выбран! Вернитесь на главную страницу.');
        window.location.href = 'index.html';
        return;
    }

    console.log('Selecting part:', part, 'for subject:', currentSubject);
    currentPart = part;
    localStorage.setItem('part', part);
    try {
        window.location.href = 'part-details.html';
    } catch (error) {
        console.error('Navigation to part-details.html failed:', error);
        alert(currentLang === 'ky' ? 'Навигацияда ката кетти! "part-details.html" файлы табылган жок.' : 'Ошибка навигации! Файл "part-details.html" не найден.');
    }
}

function updatePartDetails() {
    if (!currentPart) {
        console.error('currentPart is not defined in updatePartDetails:', currentPart);
        return;
    }

    const time = currentPart == 1 ? 30 : 60;
    const descriptionElement = document.getElementById('part-description');
    if (descriptionElement) {
        descriptionElement.textContent = currentLang === 'ky' 
            ? `Суроолордун саны: 30, Убакыт: ${time} мүнөт` 
            : `Количество вопросов: 30, Время: ${time} минут`;
    } else {
        console.warn('Element with id "part-description" not found.');
    }
}

function startTest() {
    if (!currentSubject || !currentPart) {
        console.error('Subject or part not set! Subject:', currentSubject, 'Part:', currentPart);
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        return;
    }
    console.log('Starting test for subject:', currentSubject, 'part:', currentPart);
    try {
        window.location.href = 'test.html';
    } catch (error) {
        console.error('Navigation to test.html failed:', error);
        alert(currentLang === 'ky' ? 'Навигацияда ката кетти!' : 'Ошибка навигации!');
    }
}

function loadTest() {
    const subjectData = questions[currentSubject];
    if (!subjectData) {
        console.error('Subject not found in questions:', currentSubject);
        alert(currentLang === 'ky' ? 'Предмет табылган жок!' : 'Предмет не найден!');
        window.location.href = 'index.html';
        return;
    }

    const partData = subjectData[`part${currentPart}`];
    if (!partData) {
        console.error('Part not found for subject:', currentSubject, 'part:', currentPart);
        alert(currentLang === 'ky' ? 'Бөлүк табылган жок!' : 'Часть не найдена!');
        window.location.href = 'index.html';
        return;
    }

    const variants = Object.keys(partData).filter(key => key.startsWith('variant'));
    if (variants.length === 0) {
        console.error('No variants found for subject:', currentSubject, 'part:', currentPart);
        alert(currentLang === 'ky' ? 'Варианттар табылган жок!' : 'Варианты не найдены!');
        window.location.href = 'index.html';
        return;
    }

    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    console.log('Selected variant:', randomVariant);

    const selectedQuestions = partData[randomVariant];
    if (!selectedQuestions || selectedQuestions.length !== 30) {
        console.error('Invalid number of questions in variant:', randomVariant, 'Found:', selectedQuestions ? selectedQuestions.length : 0);
        alert(currentLang === 'ky' ? 'Суроолор саны туура эмес! 30 суроо болушу керек.' : 'Неверное количество вопросов! Должно быть 30 вопросов.');
        window.location.href = 'index.html';
        return;
    }

    currentTest = selectedQuestions;
    currentQuestionIndex = 0;
    userAnswers = Array(30).fill(null);
    displayQuestion();
}

function displayQuestion() {
    const questionCounter = document.getElementById('question-counter');
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');

    questionCounter.textContent = `${currentQuestionIndex + 1}/30`;
    questionsDiv.textContent = currentTest[currentQuestionIndex].question;

    answersDiv.innerHTML = '';
    for (let option in currentTest[currentQuestionIndex].options) {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="answer" value="${option}" ${userAnswers[currentQuestionIndex] === option ? 'checked' : ''}> ${option.toUpperCase()}. ${currentTest[currentQuestionIndex].options[option]}`;
        answersDiv.appendChild(label);
        answersDiv.appendChild(document.createElement('br'));
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userAnswers[currentQuestionIndex] = e.target.value;
        });
    });
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < 29) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function startTimer() {
    timeLeft = (currentPart == 1 ? 30 : 60) * 60;
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
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

function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / 30 * 100).toFixed(2);
    const knowledge = percentage >= 80 ? (currentLang === 'ky' ? 'Жогорку' : 'Высокий') : 
                      percentage >= 50 ? (currentLang === 'ky' ? 'Орточо' : 'Средний') : 
                      (currentLang === 'ky' ? 'Төмөн' : 'Низкий');

    localStorage.setItem('score', score);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);

    console.log('Saved to localStorage - score:', localStorage.getItem('score'), 
                'percentage:', localStorage.getItem('percentage'), 
                'knowledge:', localStorage.getItem('knowledge'));

    if (currentUser) {
        const testKey = `${testType}_${currentSubject}_part${currentPart}`;
        userData.testResults[testKey] = { score, percentage, knowledge, date: new Date().toLocaleString() };
        userData.knowledgeAreas[currentSubject] = knowledge;
        saveUserData(currentUser);
    }

    try {
        window.location.href = 'results.html';
    } catch (error) {
        console.error('Navigation to results.html failed:', error);
        alert(currentLang === 'ky' ? 'Навигацияда ката кетти!' : 'Ошибка навигации!');
    }
}

function backToMain() {
    console.log('backToMain called - Returning to main page');
    alert('backToMain was called! Check the console for details.');
    // localStorage.removeItem('subject');
    // localStorage.removeItem('part');
    try {
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Navigation to index.html failed:', error);
        alert(currentLang === 'ky' ? 'Навигацияда ката кетти!' : 'Ошибка навигации!');
    }
}

function saveUserData(username) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userData', JSON.stringify(userData));
}