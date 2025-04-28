// Получение параметров из URL
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get("subject") || "math";
const part = urlParams.get("part") || "part1";
const timeLimit = part === "part1" ? 30 * 60 : 60 * 60;

let currentQuestions = [];
let userAnswers = {}; // Хранит индексы ответов (0–3)
let currentQuestionIndex = 0;
let timeRemaining = timeLimit;
let timerInterval;

// Установка информации о времени
document.getElementById("time-info").textContent = part === "part1" ? "30 мүнөт" : "60 мүнөт";

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
        if (!questions?.[subject]?.[part]?.length) {
            throw new Error(`Суроолор табылган жок: ${subject}, ${part}`);
        }

        const usedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "{}");
        if (!usedQuestions[subject]) usedQuestions[subject] = {};
        if (!usedQuestions[subject][part]) usedQuestions[subject][part] = [];

        let availableQuestions = questions[subject][part].filter(
            q => !usedQuestions[subject][part].includes(q.id)
        );

        if (availableQuestions.length < 30) {
            usedQuestions[subject][part] = [];
            availableQuestions = questions[subject][part];
            localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
        }

        currentQuestions = shuffle(availableQuestions).slice(0, 30).map(q => ({
            ...q,
            options: shuffle([...q.options])
        }));

        usedQuestions[subject][part].push(...currentQuestions.map(q => q.id));
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));

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

        // Обновление номера вопроса
        document.getElementById("question-number").textContent = `Суроо ${index + 1}/30`;

        // Отображение текста вопроса
        document.getElementById("question-text").textContent = question.text;

        // Отображение вариантов ответа с буквами (а, б, в, г)
        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = question.options.map((opt, i) => {
            const letter = String.fromCharCode(1072 + i); // а, б, в, г
            return `
                <label class="option">
                    <input type="radio" name="q${question.id}" value="${i}" ${userAnswers[question.id] === i ? "checked" : ""}>
                    <span>${letter}. ${opt}</span>
                </label>
            `;
        }).join("");

        // Обновление кнопок навигации
        document.getElementById("prev-question").disabled = index === 0;
        document.getElementById("next-question").disabled = index === currentQuestions.length - 1;
    } catch (error) {
        console.error("Ошибка отображения вопроса:", error);
        showError(error.message);
    }
}

// Обновление таблицы ответов
function updateAnswerTable() {
    try {
        const answerGrid = document.getElementById("answer-grid");
        answerGrid.innerHTML = currentQuestions.map((q, i) => {
            const letter = userAnswers[q.id] !== undefined ? String.fromCharCode(1072 + userAnswers[q.id]) : "-";
            return `
                <div class="answer-cell" onclick="goToQuestion(${i})" style="cursor: pointer; ${userAnswers[q.id] !== undefined ? 'background-color: #d1fae5;' : ''}">
                    ${i + 1}: ${letter}
                </div>
            `;
        }).join("");
    } catch (error) {
        console.error("Ошибка обновления таблицы ответов:", error);
        showError(error.message);
    }
}

// Переход к вопросу по клику на таблицу
function goToQuestion(index) {
    const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
    if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = parseInt(selected.value);
    currentQuestionIndex = index;
    displayQuestion(currentQuestionIndex);
    updateAnswerTable();
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
    try {
        let score = 0;
        const resultsDetails = document.getElementById("results-details");

        currentQuestions.forEach(q => {
            if (userAnswers[q.id] !== undefined && q.options[userAnswers[q.id]] === q.correct) {
                score++;
            }
        });

        document.getElementById("score").textContent = score;
        resultsDetails.innerHTML = currentQuestions.map(q => `
            <div class="result-item">
                <p>${q.text}</p>
                <p>Сиздин жооп: ${userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : "Жооп берилген жок"}</p>
                <p>Туура жооп: ${q.correct}</p>
            </div>
        `).join("");

        document.getElementById("test-section").style.display = "none";
        document.getElementById("results-section").style.display = "block";
    } catch (error) {
        console.error("Ошибка подсчета результатов:", error);
        showError(error.message);
    }
}

// Показ ошибки
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = `Ката: ${message}`;
    errorDiv.style.display = "block";
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
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = parseInt(selected.value);
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
    }
});

document.getElementById("next-question")?.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = parseInt(selected.value);
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
    }
});

document.getElementById("submit-test")?.addEventListener("click", submitTest);

// Проверка загрузки questions.js
window.addEventListener("load", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок");
    }
});Error("questions.js жүктөлгөн жок");
    }
});