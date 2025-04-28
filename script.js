// Загрузка вопросов
const part = window.location.pathname.includes("part1") ? "part1" : "part2";
const timeLimit = part === "part1" ? 30 * 60 : 60 * 60; // 30 или 60 минут в секундах
let currentQuestions = [];
let userAnswers = {};
let timeRemaining = timeLimit;

// Рандомизация массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Загрузка и рандомизация вопросов
function loadQuestions() {
    // Фильтрация по варианту (например, взять только variant: 1)
    const variant = localStorage.getItem("currentVariant") || 1;
    let availableQuestions = questions[part].filter(q => q.variant == variant);
    
    // Выбрать 30 случайных вопросов
    availableQuestions = shuffle(availableQuestions).slice(0, 30);
    
    currentQuestions = availableQuestions.map(q => ({
        ...q,
        options: shuffle([...q.options]) // Рандомизация ответов
    }));

    // Отображение вопросов
    const container = document.getElementById("question-container");
    currentQuestions.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <p>${index + 1}. ${q.text}</p>
            ${q.options.map((opt, i) => `
                <label>
                    <input type="radio" name="q${q.id}" value="${opt}">
                    ${opt}
                </label><br>
            `).join("")}
        `;
        container.appendChild(div);
    });
}

// Таймер
function startTimer() {
    const timerDisplay = document.getElementById("time-remaining");
    const interval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
        if (timeRemaining <= 0) {
            clearInterval(interval);
            submitTest();
        }
    }, 1000);
}

// Подсчет баллов и отображение результатов
function submitTest() {
    let score = 0;
    const resultsDetails = document.getElementById("results-details");
    
    currentQuestions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        const userAnswer = selected ? selected.value : null;
        userAnswers[q.id] = userAnswer;
        
        if (userAnswer === q.correct) {
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
document.getElementById("submit-test").addEventListener("click", submitTest);
document.getElementById("restart-test").addEventListener("click", () => {
    localStorage.setItem("currentVariant", parseInt(localStorage.getItem("currentVariant") || 1) + 1);
    window.location.reload();
});

// Инициализация
loadQuestions();
startTimer();