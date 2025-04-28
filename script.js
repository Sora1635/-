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

// Установка времени
document.getElementById("time-info").textContent = part === "part1" ? "30 мүнөт" : "60 мүнөт";

// Показ ошибки
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = `Ката: ${message}`;
    errorDiv.style.display = "block";
    document.getElementById("start-test").disabled = true;
}

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
    try {
        if (!window.questions) {
            throw new Error("questions.js жүктөлгөн жок");
        }
        if (!questions[subject] || !questions[subject][part] || !questions[subject][part].length) {
            throw new Error(`Суроолор табылган жок: ${subject}, ${part}`);
        }

        let availableQuestions = questions[subject][part];
        if (availableQuestions.length < 30) {
            throw new Error("Суроолор саны жетишсиз");
        }

        currentQuestions = shuffle([...availableQuestions]).slice(0, 30).map(q => ({
            ...q,
            options: shuffle([...q.options])
        }));

        displayQuestion(0);
        updateAnswerTable();
    } catch (error) {
        console.error("Ошибка загрузки вопросов:", error);
        showError(error.message);
    }
}

// Отображение вопроса
function displayQuestion(index) {
    try {
        const question = currentQuestions[index];
        if (!question) throw new Error(`Суроо табылган жок: индекс ${index}`);

        document.getElementById("question-number").textContent = index + 1;
        document.getElementById("question-text").textContent = question.text;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = question.options.map((opt, i) => {
            const letter = String.fromCharCode(1072 + i);
            return `
                <label class="option">
                    <input type="radio" name="q${index}" value="${letter}" ${userAnswers[index] === letter ? "checked" : ""} onchange="saveAnswer(${index}, this.value)">
                    <span>${letter}. ${opt}</span>
                </label>
            `;
        }).join("");

        document.getElementById("prev-question").disabled = index === 0;
        document.getElementById("next-question").disabled = index === currentQuestions.length - 1;
    } catch (error) {
        console.error("Ошибка отображения вопроса:", error);
        showError(error.message);
    }
}

// Сохранение ответа
function saveAnswer(index, value) {
    userAnswers[index] = value;
    updateAnswerTable();
}

// Обновление таблицы ответов
function updateAnswerTable() {
    const answerGrid = document.getElementById("answer-grid");
    answerGrid.innerHTML = currentQuestions.map((_, i) => `
        <div class="answer-cell" onclick="goToQuestion(${i})" style="cursor: pointer; ${userAnswers[i] ? 'background-color: #d1fae5;' : ''}">
            ${i + 1}: ${userAnswers[i] || "-"}
        </div>
    `).join("");
}

// Переход к вопросу
function goToQuestion(index) {
    currentQuestionIndex = index;
    displayQuestion(index);
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

// Отправка теста
function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    const resultsDetails = document.getElementById("results-details");

    currentQuestions.forEach((q, i) => {
        const correctIndex = q.options.indexOf(q.correct);
        const correctLetter = String.fromCharCode(1072 + correctIndex);
        if (userAnswers[i] === correctLetter) score++;

        resultsDetails.innerHTML += `
            <div class="result-item">
                <p>${q.text}</p>
                <p>Сиздин жооп: ${userAnswers[i] || "Жооп берилген жок"}</p>
                <p>Туура жооп: ${correctLetter}. ${q.correct}</p>
            </div>
        `;
    });

    document.getElementById("score").textContent = score;
    document.getElementById("test-section").style.display = "none";
    document.getElementById("results-section").style.display = "block";
}

// События
document.getElementById("start-test").addEventListener("click", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок");
        return;
    }
    document.getElementById("start-section").style.display = "none";
    document.getElementById("test-section").style.display = "block";
    loadQuestions();
    startTimer();
});

document.getElementById("prev-question").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});

document.getElementById("next-question").addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
});

document.getElementById("submit-test").addEventListener("click", submitTest);

// Диагностика загрузки
window.addEventListener("load", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок. Файл табылган жок же содержит ошибку.");
    }
});