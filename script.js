let currentLang = localStorage.getItem('lang') || 'ky';
let currentSubject = localStorage.getItem('subject') || '';
let currentPart = localStorage.getItem('part') || 0;
let currentTest = null;
let timerInterval = null;

const translations = {
    ky: {
        select_subject: "Предметти тандаңыз",
        select_part: "Бөлүктү тандаңыз",
        part_details: "Бөлүк жөнүндө маалымат",
        part_description: "Суроолордун саны: 30, Убакыт: {time} мүнөт",
        test_title: "Тест: {subject} - {part}",
        start_test: "Тестти баштоо",
        submit_test: "Тестти тапшыруу",
        results: "Жыйынтыктар",
        back_to_main: "Кайра башкы бетке"
    },
    ru: {
        select_subject: "Выберите предмет",
        select_part: "Выберите часть",
        part_details: "Информация о части",
        part_description: "Количество вопросов: 30, Время: {time} минут",
        test_title: "Тест: {subject} - {part}",
        start_test: "Начать тест",
        submit_test: "Завершить тест",
        results: "Результаты",
        back_to_main: "Вернуться на главную"
    }
};

// Переключение языка
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

// Обновление текста
function updateTexts() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        let key = el.getAttribute('data-lang');
        let text = translations[currentLang][key];
        if (key === 'part_description') {
            const time = currentPart == 1 ? 30 : 60;
            text = text.replace('{time}', time);
        } else if (key === 'test_title') {
            const subject = currentSubject === 'math' ? (currentLang === 'ky' ? 'Математика' : 'Математика') : (currentLang === 'ky' ? 'Кыргыз тили' : 'Киргизский язык');
            const part = currentPart == 1 ? (currentLang === 'ky' ? '1-бөлүк' : 'Часть 1') : (currentLang === 'ky' ? '2-бөлүк' : 'Часть 2');
            text = text.replace('{subject}', subject).replace('{part}', part);
        }
        el.textContent = text;
    });
}

// Выбор предмета
function selectSubject(subject) {
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Выбор части
function selectPart(part) {
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Старт теста
function startTest() {
    window.location.href = 'test.html';
}

// Загрузка теста
async function loadTest() {
    const file = `questions/${currentSubject}_part${currentPart}.json`;
    const response = await fetch(file);
    const data = await response.json();
    const variants = data.variants;
    currentTest = variants[Math.floor(Math.random() * variants.length)];
    
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');
    questionsDiv.innerHTML = '';
    answersDiv.innerHTML = '';

    currentTest.forEach((q, i) => {
        const qText = q.question[currentLang];
        const opts = q.options;
        questionsDiv.innerHTML += `
            <div class="question">
                <p>${i + 1}. ${qText}</p>
                <p>a) ${opts.a[currentLang]}</p>
                <p>b) ${opts.b[currentLang]}</p>
                <p>c) ${opts.c[currentLang]}</p>
                <p>d) ${opts.d[currentLang]}</p>
            </div>
        `;
        answersDiv.innerHTML += `
            <div class="answer-row">
                <span>${i + 1}.</span>
                <label><input type="radio" name="ans${i}" value="a"> a</label>
                <label><input type="radio" name="ans${i}" value="b"> b</label>
                <label><input type="radio" name="ans${i}" value="c"> c</label>
                <label><input type="radio" name="ans${i}" value="d"> d</label>
            </div>
        `;
    });
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

// Отправка теста
function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        const selected = document.querySelector(`input[name="ans${i}"]:checked`);
        if (selected && selected.value === q.correct) score++;
    });
    const percentage = (score / 30 * 100).toFixed(2);
    const knowledge = percentage >= 80 ? 'Жогорку' : percentage >= 50 ? 'Орточо' : 'Төмөн';
    
    localStorage.setItem('score', score);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);
    window.location.href = 'results.html';
}

// Возврат на главную
function backToMain() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Инициализация на каждой странице
window.onload = function() {
    setLanguage(currentLang);
    if (window.location.pathname.includes('results.html')) {
        document.getElementById('score').textContent = `Балл: ${localStorage.getItem('score')}/30`;
        document.getElementById('percentage').textContent = `Пайыз: ${localStorage.getItem('percentage')}%`;
        document.getElementById('knowledge').textContent = `Билим деңгээли: ${localStorage.getItem('knowledge')}`;
    }
};