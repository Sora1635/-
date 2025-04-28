// ... текущий код до displayQuestion ...

function displayQuestion(index) {
    try {
        const question = currentQuestions[index];
        if (!question) throw new Error(`Суроо табылган жок: индекс ${index}`);

        document.getElementById("question-number").textContent = index + 1;
        document.getElementById("question-text").textContent = question.text;
        document.getElementById("progress").style.width = `${((index + 1) / currentQuestions.length) * 100}%`;

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

        document.getElementById("prev-question").disabled = index === 0;
        document.getElementById("next-question").disabled = index === currentQuestions.length - 1;
    } catch (error) {
        console.error("Ошибка отображения вопроса:", error);
        showError(error.message);
    }
}

function saveProgress() {
    localStorage.setItem("testProgress", JSON.stringify({
        subject,
        part,
        currentQuestionIndex,
        userAnswers,
        timeRemaining
    }));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem("testProgress"));
    if (progress && progress.subject === subject && progress.part === part) {
        currentQuestionIndex = progress.currentQuestionIndex;
        userAnswers = progress.userAnswers;
        timeRemaining = progress.timeRemaining;
        return true;
    }
    return false;
}

function submitTest() {
    try {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;

        let score = 0;
        const resultsDetails = document.getElementById("results-details");

        currentQuestions.forEach(q => {
            const correctIndex = q.options.indexOf(q.correct);
            const correctLetter = String.fromCharCode(1072 + correctIndex);
            if (userAnswers[q.id] === correctLetter) score++;
        });

        const stats = JSON.parse(localStorage.getItem("testStats") || "[]");
        stats.push({ subject, part, score, date: new Date() });
        localStorage.setItem("testStats", JSON.stringify(stats));

        document.getElementById("score").textContent = score;
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
        localStorage.removeItem("testProgress"); // Очистка прогресса после завершения
    } catch (error) {
        console.error("Ошибка подсчета результатов:", error);
        showError(error.message);
    }
}

// ... текущий код до событий ...

document.getElementById("start-test")?.addEventListener("click", () => {
    if (loadProgress()) {
        document.getElementById("start-section").style.display = "none";
        document.getElementById("test-section").style.display = "block";
        loadQuestions();
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
        startTimer();
    } else {
        document.getElementById("start-section").style.display = "none";
        document.getElementById("test-section").style.display = "block";
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
        saveProgress();
    }
});

document.getElementById("next-question")?.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        updateAnswerTable();
        saveProgress();
    }
});

document.getElementById("submit-test")?.addEventListener("click", () => {
    const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
    if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;
    clearInterval(timerInterval);
    submitTest();
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(error => {
        console.error("Service Worker registration failed:", error);
    });
}/ Сохраняем ответ на текущий вопрос перед подсчетом результатов
        const selected = document.querySelector(`input[name="q${currentQuestions[currentQuestionIndex].id}"]:checked`);
        if (selected) userAnswers[currentQuestions[currentQuestionIndex].id] = selected.value;

        let score = 0;
        const resultsDetails = document.getElementById("results-details");

        currentQuestions.forEach(q => {
            // Проверяем, совпадает ли выбранная буква с буквой правильного ответа
            const correctIndex = q.options.indexOf(q.correct);
            const correctLetter = String.fromCharCode(1072 + correctIndex);
            if (userAnswers[q.id] === correctLetter) score++;
        });

        document.getElementById("score").textContent = score;
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

// Проверка загрузки questions.js
window.addEventListener("load", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок");
    }
});