let currentSubject = localStorage.getItem('subject') || '';
let currentPart = localStorage.getItem('part') || 0;
let currentTest = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let userAnswers = Array(30).fill(null); // Массив для хранения ответов пользователя

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
async function loadTest() {
    const file = `${currentSubject}_part${currentPart}.json`;
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`JSON файл жок: ${file}`);
        }
        const data = await response.json();
        if (!data.variants || data.variants.length === 0 || data.variants[0].length !== 30) {
            throw new Error("Суроолор толук эмес! 30 суроо болушу керек.");
        }
        const variants = data.variants;
        currentTest = variants[Math.floor(Math.random() * variants.length)];
        currentQuestionIndex = 0;
        displayQuestion();
    } catch (error) {
        console.error(error);
        alert(`Суроолорду жүктөөдө ката: ${error.message}`);
    }
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
    const checked = userAnswers[currentQuestionIndex] ? `checked` : '';
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