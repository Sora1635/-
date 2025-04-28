// Получение параметров из URL
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get("subject") || "math";
const part = urlParams.get("part") || "part1";
const timeLimit = part === "part1" ? 30 * 60 : 60 * 60;

// Глобальные переменные
let currentQuestions = [];
let userAnswers = {};
let markedQuestions = new Set();
let currentQuestionIndex = 0;
let timeRemaining = timeLimit;
let timerInterval;
let isPaused = false;

// Подсказки для вопросов (для примера)
const hints = {
    1: "Подсказка: биринчи умножение, андан кийин кошуу.",
    2: "Подсказка: 1 алманын баасын таап, андан кийин 3кө көбөйтүңүз.",
    3: "Подсказка: квадрат деген санды өзүнө көбөйтүү.",
    // Добавьте подсказки для остальных вопросов
};

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

        // Сбрасываем прогресс перед новым тестом
        userAnswers = {};
        markedQuestions.clear();
        currentQuestionIndex = 0;
        timeRemaining = timeLimit;
        if (timerInterval) clearInterval(timerInterval);

        displayQuestion(0);
        updateAnswerTable();
        updateProgressBar();
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
                    <input type="radio" name="q${question.id}" value="${letter}" ${userAnswers[question.id] === letter ? "checked" : ""}>
                    <span>${letter}. ${opt}</span>
                </label>
            `;
        }).join("");

        // Обновление кнопок навигации
        document.getElementById("prev-question").disabled = index === 0;
        document.getElementById("next-question").disabled = index === currentQuestions.length - 1;

        // Отметка вопроса
        const markBtn = document.getElementById("mark-question");
        markBtn.classList.toggle("marked", markedQuestions.has(question.id));

        // Подсказка
        const hintBtn = document.getElementById("hint-btn");
        const hintText = document.getElementById("hint-text");
        if (hints[question.id]) {
            hintBtn.style.display = "inline-block";
            hintText.style.display = "none";
            hintBtn.onclick = () => {
                hintText.textContent = hints[question.id];
                hintText.style.display = "block";
            };
        } else {
            hintBtn.style.display = "none";
            hintText.style.display = "none";
        }
    } catch (error) {
        console.error("Ошибка отображения вопроса:", error);
        showError(error.message);
    }
}

// Обновление таблицы ответов
function updateAnswerTable() {
    try {
        const answerGrid = document.getElementById("answer-grid");
        answerGrid.innerHTML = currentQuestions.map((q, i) => `
            <div class="answer-cell ${markedQuestions.has(q.id) ? 'marked' : ''}" onclick="goToQuestion(${i})" style="cursor: pointer; ${userAnswers[q.id] ? 'background-color: #d1fae5;' : ''}">
                ${i + 1}: ${userAnswers[q.id] || "-"}
            </div>
        `).join("");
    } catch (error) {
        console.error("Ошибка обновления таблицы ответов:", error);
        showError(error.message);
    }
}

// Обновление прогресс-бара
function updateProgressBar() {
    const progress = (currentQuestionIndex + 1) / currentQuestions.length * 100;
    document.getElementById("progress").style.width = `${progress}%`;
}

// Переход к вопросу
function goToQuestion(index) {
    const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
    if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
    currentQuestionIndex = index;
    displayQuestion(currentQuestionIndex);
    updateAnswerTable();
    updateProgressBar();
}

// Таймер
function startTimer() {
    const timerDisplay = document.getElementById("time-remaining");
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }
    }, 1000);
}

// Пауза теста
function pauseTest() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById("pause-test");
    pauseBtn.textContent = isPaused ? "▶ Продолжить" : "⏸ Пауза";
    if (isPaused) {
        // Сохраняем прогресс
        localStorage.setItem("testProgress", JSON.stringify({
            currentQuestions,
            userAnswers,
            markedQuestions: Array.from(markedQuestions),
            currentQuestionIndex,
            timeRemaining,
            subject,
            part
        }));
    }
}

// Загрузка прогресса
function loadProgress() {
    const savedProgress = localStorage.getItem("testProgress");
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (progress.subject === subject && progress.part === part) {
            currentQuestions = progress.currentQuestions;
            userAnswers = progress.userAnswers;
            markedQuestions = new Set(progress.markedQuestions);
            currentQuestionIndex = progress.currentQuestionIndex;
            timeRemaining = progress.timeRemaining;
            displayQuestion(currentQuestionIndex);
            updateAnswerTable();
            updateProgressBar();
            startTimer();
            return true;
        }
    }
    return false;
}

// Отправка теста
function submitTest() {
    // Сохраняем последний ответ
    const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
    if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;

    let score = 0;
    const categoryErrors = {};

    currentQuestions.forEach(q => {
        const correctIndex = q.options.indexOf(q.correct);
        const correctLetter = String.fromCharCode(1072 + correctIndex);
        if (userAnswers[q.id] === correctLetter) {
            score++;
        } else {
            categoryErrors[q.category] = (categoryErrors[q.category] || 0) + 1;
        }
    });

    // Статистика
    const percentage = (score / currentQuestions.length * 100).toFixed(1);
    const weakCategory = Object.entries(categoryErrors).sort((a, b) => b[1] - a[1])[0]?.[0] || "Жок";

    document.getElementById("score").textContent = score;
    document.getElementById("percentage").textContent = percentage;
    document.getElementById("weak-category").textContent = weakCategory;

    const resultsDetails = document.getElementById("results-details");
    resultsDetails.innerHTML = currentQuestions.map(q => {
        const correctIndex = q.options.indexOf(q.correct);
        const correctLetter = String.fromCharCode(1072 + correctIndex);
        return `
            <div class="result-item">
                <p>${q.text}</p>
                <p>Сиздин жооп: ${userAnswers[q.id] || "Жооп берилген жок"}</p>
                <p>Туура жооп: ${correctLetter}. ${q.correct}</p>
            </div>
        `;
    }).join("");

    document.getElementById("test-section").style.display = "none";
    document.getElementById("results-section").style.display = "block";

    // Очищаем сохраненный прогресс
    localStorage.removeItem("testProgress");
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
    if (!loadProgress()) {
        loadQuestions();
        startTimer();
    }
});

document.getElementById("prev-question")?.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
        updateProgressBar();
    }
});

document.getElementById("next-question")?.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
        updateProgressBar();
    }
});

document.getElementById("pause-test")?.addEventListener("click", pauseTest);

document.getElementById("mark-question")?.addEventListener("click", () => {
    const questionId = currentQuestions[currentQuestionIndex].id;
    if (markedQuestions.has(questionId)) {
        markedQuestions.delete(questionId);
    } else {
        markedQuestions.add(questionId);
    }
    updateAnswerTable();
    displayQuestion(currentQuestionIndex);
});

document.getElementById("submit-test")?.addEventListener("click", () => {
    if (confirm("Сиз чын эле тестти тапшыргыңыз келеби?")) {
        clearInterval(timerInterval);
        submitTest();
    }
});

// Клавиатурная навигация
document.addEventListener("keydown", (e) => {
    if (document.getElementById("test-section").style.display !== "none") {
        if (e.key === "ArrowLeft" && currentQuestionIndex > 0) {
            document.getElementById("prev-question").click();
        } else if (e.key === "ArrowRight" && currentQuestionIndex < currentQuestions.length - 1) {
            document.getElementById("next-question").click();
        }
    }
});

// Проверка загрузки questions.js
window.addEventListener("load", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок");
    }
});