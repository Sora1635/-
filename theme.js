document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-btn");
    const body = document.body;

    // Загружаем сохраненную тему
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark");
        themeBtn.textContent = "☀️";
    }

    themeBtn.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            themeBtn.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            themeBtn.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    });
});