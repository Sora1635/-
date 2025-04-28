// Получение параметров из URL
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get("subject") || "math";
const part = urlParams.get("part") || "part1";
const timeLimit = part === "part1" ? 30 * 60 : 60 * 60;

let currentQuestions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let timeRemaining = timeLimit;
let timerInterval;

// Рандомизация массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Загрузка вопросов
function loadQuestions() {
    // Получаем использованные вопросы
    const usedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "{}");
    if (!usedQuestions[subject]) usedQuestions[subject] = {};
    if (!usedQuestions[subject][part]) usedQuestions[subject][part] = [];

    // Фильтруем неиспользованные вопросы
    let availableQuestions = questions[subject][part].filter(
        q => !usedQuestions[subject][part].includes(q.id)
    );

    // Если не хватает вопросов, очищаем использованные
    if (availableQuestions.length < 30) {
        usedQuestions[subject][part] = [];
        availableQuestions = questions[subject][part];
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
    }

    // Выбираем 30 случайных вопросов
    currentQuestions = shuffle(availableQuestions).slice(0, 30).map(q => ({
        ...q,
        options: shuffle([...q.options])
    }));

    // Добавляем выбранные вопросы в использованные
    usedQuestions[subject][part].push(...currentQuestions.map(q => q.id));
    localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));

    displayQuestion(0);
    updateAnswerTable();
}

// Отображение текущего вопроса
function displayQuestion(index) {
    const question = currentQuestions[index];
    const container = document.getElementById("question-container");
    container.innerHTML = `
        <p>${index + 1}. ${question.text}</p>
        ${question.options.map((opt, i) => `
            <label>
                <input type="radio" name="q${question.id}" value="${opt}" ${userAnswers[question.id] === opt ? "checked" : ""}>
                ${opt}
            </label><br>
        `).join("")}
    `;
    
    document.getElementById("prev-question").disabled = index === 0;
    document.getElementById("next-question").disabled = index === currentQuestions.length - 1;
}

// Обновление таблицы ответов
function updateAnswerTable() {
    const answerGrid = document.getElementById("answer-grid");
    answerGrid.innerHTML = currentQuestions.map((q, i) => `
        <div class="answer-cell">${i + 1}: ${
            userAnswers[q.id] ? userAnswers[q.id] : "-"
        }</div>
    `).join("");
}

// Таймер
function startTimer() {
    const timerDisplay = document.getElementById("time-remaining");
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

// Подсчет баллов и отображение результатов
function submitTest() {
    let score = 0;
    const resultsDetails = document.getElementById("results-details");
    
    currentQuestions.forEach(q => {
        if (userAnswers[q.id] === q.correct) {
            score++;
        }
    });

    document.getElementById("score").textContent = `${score} / 30`;
    resultsDetails.innerHTML = currentQuestions.map(q => `
        <p>
            ${q.text}<br>
            Сиздин жооп: ${userAnswers[q.id] || "Жооп берилген жок"}<br>
            Туура жооп: ${q.correct}
        </p>
    `).join("");

    document.getElementById("test-section").style.display = "none";
    document.getElementById("results-section").style.display = "block";
}

// События
document.getElementById("start-test")?.addEventListener("click", () => {
    document.getElementById("start-section").style.display = "none";
    document.getElementById("test-section").style.display = "block";
    loadQuestions();
    startTimer();
});

document.getElementById("prev-question")?.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
    }
});

document.getElementById("next-question")?.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
    }
});

document.getElementById("submit-test")?.addEventListener("click", submitTest);