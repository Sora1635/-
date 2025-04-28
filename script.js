let currentSubject = '';
let currentPart = 0;
let currentTest = null;
let timerInterval = null;

function switchLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
    });
    document.documentElement.lang = lang;
}

function showSubject(subject) {
    currentSubject = subject;
    document.getElementById('home').classList.remove('active');
    document.getElementById('subject').classList.add('active');
    document.getElementById('subject-title').textContent = subject === 'math' ? 'Математика' : 'Кыргыз тили';
}

function showPart(part) {
    currentPart = part;
    document.getElementById('subject').classList.remove('active');
    document.getElementById('part-details').classList.add('active');
    document.getElementById('part-title').textContent = `${part}-бөлүк (${part === 1 ? 'Жеңил' : 'Татаал'})`;
    document.getElementById('part-description').textContent = `Суроолордун саны: 30, Убакыт: ${part === 1 ? '30 мүнөт' : '60 мүнөт'}`;
}

function startTest() {
    document.getElementById('part-details').classList.remove('active');
    document.getElementById('test').classList.add('active');
    
    // Выбираем случайный вариант теста
    const variants = questions[currentSubject][`part${currentPart}`];
    const variantIndex = Math.floor(Math.random() * variants.length);
    currentTest = variants[variantIndex];
    
    // Отображаем вопросы
    const questionsDiv = document.getElementById('questions');
    questionsDiv.innerHTML = currentTest.map((q, i) => `
        <div class="question">
            <p>${i + 1}. ${q.question}</p>
            <p>a) ${q.options.a}</p>
            <p>б) ${q.options.b}</p>
            <p>в) ${q.options.c}</p>
            <p>г) ${q.options.d}</p>
        </div>
    `).join('');

    // Отображаем блок ответов
    const answersDiv = document.getElementById('answer-options');
    answersDiv.innerHTML = currentTest.map((q, i) => `
        <div class="answer-row">
            <span>${i + 1}:</span>
            <select id="answer-${i}">
                <option value="">Тандаңыз</option>
                <option value="a">а</option>
                <option value="б">б</option>
                <option value="в">в</option>
                <option value="г">г</option>
            </select>
        </div>
    `).join('');

    // Таймер
    const timeLimit = currentPart === 1 ? 30 * 60 : 60 * 60;
    startTimer(timeLimit);
}

function startTimer(seconds) {
    const timerDiv = document.getElementById('timer');
    let timeLeft = seconds;
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDiv.textContent = `Калган убакыт: ${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function submitTest() {
    clearInterval(timerInterval);
    document.getElementById('test').classList.remove('active');
    document.getElementById('results').classList.add('active');

    let score = 0;
    currentTest.forEach((q, i) => {
        const selected = document.getElementById(`answer-${i}`).value;
        if (selected === q.correct) score++;
    });

    const percentage = (score / 30 * 100).toFixed(2);
    let knowledge = '';
    if (percentage >= 80) knowledge = 'Жогорку билим деңгээли';
    else if (percentage >= 50) knowledge = 'Орточо билим деңгээли';
    else knowledge = 'Төмөн билим деңгээли';

    document.getElementById('score').textContent = `Балл: ${score}/30`;
    document.getElementById('percentage').textContent = `Пайыз: ${percentage}%`;
    document.getElementById('knowledge').textContent = `Билим деңгээли: ${knowledge}`;
}

function backToHome() {
    document.getElementById('results').classList.remove('active');
    document.getElementById('home').classList.add('active');
    currentSubject = '';
    currentPart = 0;
    currentTest = null;
}

// Инициализация языка
switchLanguage('ky');