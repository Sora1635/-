// Показ ошибки
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = `Ката: ${message}`;
    errorDiv.style.display = "block";
    document.getElementById("start-test").disabled = true;
}

// Проверка и старт теста
document.getElementById("start-test").addEventListener("click", () => {
    const subject = document.getElementById("subject").value;
    const part = document.getElementById("part").value;

    try {
        if (!window.questions) {
            throw new Error("questions.js жүктөлгөн жок");
        }
        if (!questions[subject] || !questions[subject][part] || !questions[subject][part].length) {
            throw new Error(`Суроолор табылган жок: ${subject}, ${part}`);
        }
        if (questions[subject][part].length < 30) {
            throw new Error("Суроолор саны жетишсиз");
        }

        // Перенаправление на quiz.html
        window.location.href = `quiz.html?subject=${subject}&part=${part}`;
    } catch (error) {
        console.error("Ошибка подготовки теста:", error);
        showError(error.message);
    }
});

// Проверка загрузки questions.js
window.addEventListener("load", () => {
    if (!window.questions) {
        showError("questions.js жүктөлгөн жок. Файл табылган жок же содержит ошибку.");
    }
});