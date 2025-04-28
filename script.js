// Ждем загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
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

    // Установка информации о времени
    const timeInfo = document.getElementById("time-info");
    if (timeInfo) {
        timeInfo.textContent = part === "part1" ? "30 мүнөт" : "60 мүнөт";
    } else {
        console.error("Элемент #time-info не найден");
    }

    // Проверка загрузки questions.js
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок");
        return;
    }

    // Рандомизация массива
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Показ ошибки
    function showError(message) {
        const errorDiv = document.getElementById("error-message");
        if (errorDiv) {
            errorDiv.textContent = `Ката: ${message}`;
            errorDiv.style.display = "block";
        }
        console.error(message);
    }

    // Загрузка вопросов
    function loadQuestions() {
        try {
            // Проверка наличия вопросов
            if (!window.questions?.[subject]?.[part]?.length) {
                throw new Error(`Суроолор табылган жок: ${subject}, ${part}`);
            }

            // Получение использованных вопросов
            const usedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "{}");
            if (!usedQuestions[subject]) usedQuestions[subject] = {};
            if (!usedQuestions[subject][part]) usedQuestions[subject][part] = [];

            // Фильтрация неиспользованных вопросов
            let availableQuestions = window.questions[subject][part].filter(
                q => !usedQuestions[subject][part].includes(q.id)
            );

            // Если вопросов меньше 30, сбрасываем использованные
            if (availableQuestions.length < 30) {
                usedQuestions[subject][part] = [];
                availableQuestions = window.questions[subject][part];
                localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
            }

            if (availableQuestions.length < 30) {
                throw new Error(`Жетиштүү суроолор жок: ${availableQuestions.length}/30`);
            }

            // Выбор 30 случайных вопросов
            currentQuestions = shuffle(availableQuestions).slice(0, 30).map(q => ({
                ...q,
                options: shuffle([...q.options])
            }));

            // Сохранение использованных вопросов
            usedQuestions[subject][part].push(...currentQuestions.map(q => q.id));
            localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));

            // Отображение первого вопроса и таблицы ответов
            displayQuestion(0);
            updateAnswerTable();
        } catch (error) {
            showError(error.message);
        }
    }

    // Отображение вопроса
    function displayQuestion(index) {
        try {
            const question = currentQuestions[index];
            if (!question) throw new Error(`Суроо табылган жок: индекс ${index}`);

            // Обновление номера вопроса
            const questionNumber = document.getElementById("question-number");
            if (questionNumber) {
                questionNumber.textContent = index + 1;
            }

            // Отображение текста вопроса
            const questionText = document.getElementById("question-text");
            if (questionText) {
                questionText.textContent = question.text;
            }

            // Отображение вариантов ответа с буквами (а, б, в, г)
            const optionsContainer = document.getElementById("options-container");
            if (optionsContainer) {
                optionsContainer.innerHTML = question.options.map((opt, i) => {
                    const letter = String.fromCharCode(1072 + i); // а, б, в, г
                    return `
                        <label class="option">
                            <input type="radio" name="q${question.id}" value="${letter}" ${userAnswers[question.id] === letter ? "checked" : ""}>
                            <span>${letter}. ${opt}</span>
                        </label>
                    `;
                }).join("");
            }

            // Обновление кнопок навигации
            const prevButton = document.getElementById("prev-question");
            const nextButton = document.getElementById("next-question");
            if (prevButton) prevButton.disabled = index === 0;
            if (nextButton) nextButton.disabled = index === currentQuestions.length - 1;
        } catch (error) {
            showError(error.message);
        }
    }

    // Обновление таблицы ответов
    function updateAnswerTable() {
        try {
            const answerGrid = document.getElementById("answer-grid");
            if (answerGrid) {
                answerGrid.innerHTML = currentQuestions.map((q, i) => `
                    <div class="answer-cell" onclick="goToQuestion(${i})" style="cursor: pointer; ${userAnswers[q.id] ? 'background-color: #d1fae5;' : ''}">
                        ${i + 1}: ${userAnswers[q.id] || "-"}
                    </div>
                `).join("");
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Переход к вопросу по клику на таблицу
    function goToQuestion(index) {
        try {
            const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
            if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
            currentQuestionIndex = index;
            displayQuestion(currentQuestionIndex);
            updateAnswerTable();
        } catch (error) {
            showError(error.message);
        }
    }

    // Таймер
    function startTimer() {
        try {
            const timerDisplay = document.getElementById("time-remaining");
            if (!timerDisplay) throw new Error("Элемент #time-remaining не найден");

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
        } catch (error) {
            showError(error.message);
        }
    }

    // Отправка теста
    function submitTest() {
        try {
            // Сохраняем ответ на текущий вопрос
            const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
            if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;

            let score = 0;
            const resultsDetails = document.getElementById("results-details");
            if (!resultsDetails) throw new Error("Элемент #results-details не найден");

            currentQuestions.forEach(q => {
                const correctIndex = q.options.indexOf(q.correct);
                const correctLetter = String.fromCharCode(1072 + correctIndex);
                if (userAnswers[q.id] === correctLetter) score++;
            });

            const scoreElement = document.getElementById("score");
            if (scoreElement) scoreElement.textContent = score;

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

            const testSection = document.getElementById("test-section");
            const resultsSection = document.getElementById("results-section");
            if (testSection) testSection.style.display = "none";
            if (resultsSection) resultsSection.style.display = "block";
        } catch (error) {
            showError(error.message);
        }
    }

    // Привязка событий
    const startButton = document.getElementById("start-test");
    if (startButton) {
        startButton.addEventListener("click", () => {
            console.log("Кнопка 'Тестти баштоо' нажата");
            const startSection = document.getElementById("start-section");
            const testSection = document.getElementById("test-section");
            if (startSection) startSection.style.display = "none";
            if (testSection) testSection.style.display = "block";
            loadQuestions();
            startTimer();
        });
    } else {
        console.error("Кнопка #start-test не найдена");
    }

    const prevButton = document.getElementById("prev-question");
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            if (currentQuestionIndex > 0) {
                const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
                if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
                currentQuestionIndex--;
                displayQuestion(currentQuestionIndex);
                updateAnswerTable();
            }
        });
    }

    const nextButton = document.getElementById("next-question");
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (currentQuestionIndex < currentQuestions.length - 1) {
                const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
                if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
                updateAnswerTable();
            }
        });
    }

    const submitButton = document.getElementById("submit-test");
    if (submitButton) {
        submitButton.addEventListener("click", submitTest);
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
});