* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', Arial, sans-serif;
    transition: background-color 0.3s, color 0.3s;
}

body {
    background: linear-gradient(135deg, #74ebd5, #acb6e5);
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

body.dark {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #e5e7eb;
}

header {
    background-color: #1e3a8a;
    color: white;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

body.dark header {
    background-color: #0f172a;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
}

nav {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.nav-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s, transform 0.2s;
}

body.dark .nav-btn {
    background-color: #60a5fa;
}

.nav-btn:hover {
    background-color: #2563eb;
    transform: translateY(-3px);
}

.nav-btn.active {
    background-color: #16a34a;
}

body.dark .nav-btn.active {
    background-color: #22c55e;
}

main {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    flex: 1;
}

body.dark main {
    background-color: #1e293b;
}

.hero, #start-section, #results-section {
    text-align: center;
    padding: 2.5rem;
}

.hero h2, #start-section h2, #results-section h2 {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
    color: #1e3a8a;
}

body.dark .hero h2, body.dark #start-section h2, body.dark #results-section h2 {
    color: #60a5fa;
}

.action-btn {
    background-color: #16a34a;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

body.dark .action-btn {
    background-color: #22c55e;
}

.action-btn:hover {
    background-color: #15803d;
    transform: translateY(-3px);
}

.action-btn.pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.card-section {
    text-align: center;
}

.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1.5rem;
}

.card {
    background-color: #f3f4f6;
    padding: 2rem;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

body.dark .card {
    background-color: #334155;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card h3 {
    color: #1e3a8a;
    margin-bottom: 0.75rem;
}

body.dark .card h3 {
    color: #60a5fa;
}

#timer {
    font-size: 1.5rem;
    font-weight: bold;
    color: #dc2626;
    text-align: center;
    margin: 1.5rem 0;
}

#progress-bar {
    width: 100%;
    height: 10px;
    background-color: #e5e7eb;
    border-radius: 5px;
    overflow: hidden;
    margin: 1rem 0;
}

#progress {
    height: 100%;
    background-color: #16a34a;
    transition: width 0.3s ease-in-out;
}

body.dark #progress-bar {
    background-color: #475569;
}

body.dark #progress {
    background-color: #22c55e;
}

#question-area {
    background-color: #f9fafb;
    padding: 2.5rem;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    margin: 1.5rem 0;
    position: relative;
}

body.dark #question-area {
    background-color: #334155;
    border-color: #475569;
}

#question-header {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

#question-text {
    font-size: 1.4rem;
    margin-bottom: 2rem;
}

#options-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.option {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: white;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
}

body.dark .option {
    background-color: #1e293b;
    border-color: #475569;
}

.option:hover {
    background-color: #f3f4f6;
    border-color: #3b82f6;
}

body.dark .option:hover {
    background-color: #334155;
    border-color: #60a5fa;
}

.option input {
    margin-right: 0.75rem;
}

#navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    gap: 1rem;
}

.mark-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;
}

.mark-btn.marked {
    color: #f59e0b;
}

.hint-btn {
    background-color: #f59e0b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
    display: inline-block;
}

body.dark .hint-btn {
    background-color: #d97706;
}

#hint-text {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fef3c7;
    border-radius: 6px;
}

body.dark #hint-text {
    background-color: #713f12;
}

#answer-table {
    margin: 2.5rem 0;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

body.dark #answer-table {
    background-color: #334155;
    border-color: #475569;
}

#answer-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 0.75rem;
    text-align: center;
}

.answer-cell {
    padding: 0.75rem;
    background-color: white;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

body.dark .answer-cell {
    background-color: #1e293b;
    border-color: #475569;
}

.answer-cell:hover {
    background-color: #e5e7eb;
}

body.dark .answer-cell:hover {
    background-color: #475569;
}

#results-details .result-item {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
}

body.dark #results-details .result-item {
    background-color: #334155;
    border-color: #475569;
}

#stats {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: #ecfdf5;
    border-radius: 12px;
}

body.dark #stats {
    background-color: #14532d;
}

#error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 1.5rem;
    border-radius: 12px;
    margin: 1.5rem 0;
    text-align: center;
}

body.dark #error-message {
    background-color: #7f1d1d;
}

footer {
    text-align: center;
    padding: 1.5rem;
    background-color: #1e3a8a;
    color: white;
    margin-top: auto;
}

body.dark footer {
    background-color: #0f172a;
}

.theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
}

#theme-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Адаптивность */
@media (max-width: 768px) {
    main {
        margin: 1rem;
        padding: 1.5rem;
    }

    header h1 {
        font-size: 2rem;
    }

    .nav-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    #answer-grid {
        grid-template-columns: repeat(5, 1fr);
    }

    #question-text {
        font-size: 1.2rem;
    }

    #navigation {
        flex-direction: column;
        gap: 0.5rem;
    }

    .nav-btn {
        width: 100%;
    }
}v = document.getElementById("error-message");
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