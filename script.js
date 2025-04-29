// Переменные для системы аккаунтов
let currentUser = null;
let userData = {};
let users = JSON.parse(localStorage.getItem('users')) || {};

// Переменные для тестов
let currentSubject = localStorage.getItem('subject') || '';
let currentPart = localStorage.getItem('part') || 0;
let currentTest = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let userAnswers = Array(30).fill(null);
let testType = 'ort_prob';

// Переменные для языка
let currentLang = localStorage.getItem('lang') || 'ky';

// Функции для работы с языком
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

function updateTexts() {
    document.querySelectorAll('[data-lang-ky], [data-lang-ru]').forEach(el => {
        el.textContent = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
    });
    // Обновление placeholder в textarea
    document.querySelectorAll('textarea').forEach(el => {
        el.placeholder = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
    });
    // Обновление значений в select
    document.querySelectorAll('select option').forEach(option => {
        if (option.value) {
            option.textContent = currentLang === 'ky' ? option.getAttribute('data-lang-ky') : option.getAttribute('data-lang-ru');
        }
    });
}

// Функции для работы с данными пользователя
function loadUserData(username) {
    const data = localStorage.getItem(`user_${username}`);
    if (data) {
        userData = JSON.parse(data);
    } else {
        userData = {
            password: '',
            testResults: {},
            courseProgress: {},
            knowledgeAreas: {}
        };
    }
}

function saveUserData(username) {
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Система аккаунтов
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert(currentLang === 'ky' ? 'Логин жана сырсөздү толтуруңуз!' : 'Заполните логин и пароль!');
        return;
    }

    if (users[username]) {
        alert(currentLang === 'ky' ? 'Бул логин мурунтан катталган!' : 'Этот логин уже зарегистрирован!');
        return;
    }

    users[username] = password;
    saveUsers();
    loadUserData(username);
    userData.password = password;
    saveUserData(username);
    loginUser(username);
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!users[username] || users[username] !== password) {
        alert(currentLang === 'ky' ? 'Логин же сырсөз туура эмес!' : 'Неверный логин или пароль!');
        return;
    }

    loginUser(username);
}

function loginUser(username) {
    currentUser = username;
    localStorage.setItem('currentUser', username);
    loadUserData(username);
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
    updateTexts();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Переключение секций
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
    if (sectionId === 'continue') {
        showContinueContent();
    }
}

// Вопросы для тестов
const questions = {
    math_part1: [
        { question: "2 + 2 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "5 - 3 канча болот?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "b" },
        { question: "3 * 4 канча болот?", options: { a: "6", b: "8", c: "10", d: "12" }, correct: "d" },
        { question: "10 / 2 канча болот?", options: { a: "2", b: "4", c: "5", d: "6" }, correct: "c" },
        { question: "7 + 8 канча болот?", options: { a: "13", b: "15", c: "16", d: "17" }, correct: "b" },
        { question: "9 - 4 канча болот?", options: { a: "3", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "6 * 3 канча болот?", options: { a: "9", b: "12", c: "15", d: "18" }, correct: "d" },
        { question: "20 / 5 канча болот?", options: { a: "2", b: "4", c: "5", d: "10" }, correct: "c" },
        { question: "12 + 13 канча болот?", options: { a: "23", b: "25", c: "26", d: "27" }, correct: "b" },
        { question: "15 - 7 канча болот?", options: { a: "6", b: "8", c: "9", d: "10" }, correct: "b" },
        { question: "8 * 9 канча болот?", options: { a: "64", b: "72", c: "78", d: "81" }, correct: "b" },
        { question: "24 / 6 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "17 + 18 канча болот?", options: { a: "33", b: "35", c: "36", d: "37" }, correct: "b" },
        { question: "22 - 9 канча болот?", options: { a: "11", b: "12", c: "13", d: "14" }, correct: "c" },
        { question: "7 * 8 канча болот?", options: { a: "49", b: "56", c: "58", d: "64" }, correct: "b" },
        { question: "30 / 5 канча болот?", options: { a: "5", b: "6", c: "7", d: "8" }, correct: "b" },
        { question: "23 + 24 канча болот?", options: { a: "45", b: "46", c: "47", d: "48" }, correct: "c" },
        { question: "28 - 12 канча болот?", options: { a: "14", b: "16", c: "18", d: "20" }, correct: "b" },
        { question: "9 * 10 канча болот?", options: { a: "80", b: "90", c: "95", d: "100" }, correct: "b" },
        { question: "40 / 8 канча болот?", options: { a: "4", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "31 + 32 канча болот?", options: { a: "61", b: "62", c: "63", d: "64" }, correct: "c" },
        { question: "35 - 15 канча болот?", options: { a: "18", b: "20", c: "22", d: "25" }, correct: "b" },
        { question: "11 * 12 канча болот?", options: { a: "121", b: "132", c: "133", d: "144" }, correct: "b" },
        { question: "50 / 10 канча болот?", options: { a: "4", b: "5", c: "6", d: "7" }, correct: "b" },
        { question: "42 + 43 канча болот?", options: { a: "83", b: "84", c: "85", d: "86" }, correct: "c" },
        { question: "47 - 23 канча болот?", options: { a: "22", b: "24", c: "26", d: "28" }, correct: "b" },
        { question: "13 * 14 канча болот?", options: { a: "169", b: "170", c: "182", d: "184" }, correct: "c" },
        { question: "60 / 15 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
        { question: "55 + 56 канча болот?", options: { a: "109", b: "110", c: "111", d: "112" }, correct: "c" },
        { question: "60 - 25 канча болот?", options: { a: "33", b: "35", c: "37", d: "40" }, correct: "b" }
    ],
    math_part2: [
        { question: "2^3 канча болот?", options: { a: "6", b: "8", c: "10", d: "12" }, correct: "b" },
        { question: "3^2 канча болот?", options: { a: "6", b: "9", c: "12", d: "15" }, correct: "b" },
        { question: "5^2 канча болот?", options: { a: "20", b: "25", c: "30", d: "35" }, correct: "b" },
        { question: "4^3 канча болот?", options: { a: "16", b: "32", c: "64", d: "128" }, correct: "c" },
        { question: "7^2 канча болот?", options: { a: "42", b: "49", c: "56", d: "63" }, correct: "b" },
        { question: "8^2 канча болот?", options: { a: "56", b: "64", c: "72", d: "80" }, correct: "b" },
        { question: "9^2 канча болот?", options: { a: "72", b: "81", c: "90", d: "99" }, correct: "b" },
        { question: "10^2 канча болот?", options: { a: "90", b: "100", c: "110", d: "120" }, correct: "b" },
        { question: "11^2 канча болот?", options: { a: "111", b: "121", c: "131", d: "141" }, correct: "b" },
        { question: "12^2 канча болот?", options: { a: "134", b: "144", c: "154", d: "164" }, correct: "b" },
        { question: "13^2 канча болот?", options: { a: "159", b: "169", c: "179", d: "189" }, correct: "b" },
        { question: "14^2 канча болот?", options: { a: "186", b: "196", c: "206", d: "216" }, correct: "b" },
        { question: "15^2 канча болот?", options: { a: "215", b: "225", c: "235", d: "245" }, correct: "b" },
        { question: "16^2 канча болот?", options: { a: "246", b: "256", c: "266", d: "276" }, correct: "b" },
        { question: "17^2 канча болот?", options: { a: "279", b: "289", c: "299", d: "309" }, correct: "b" },
        { question: "18^2 канча болот?", options: { a: "314", b: "324", c: "334", d: "344" }, correct: "b" },
        { question: "19^2 канча болот?", options: { a: "351", b: "361", c: "371", d: "381" }, correct: "b" },
        { question: "20^2 канча болот?", options: { a: "390", b: "400", c: "410", d: "420" }, correct: "b" },
        { question: "21^2 канча болот?", options: { a: "431", b: "441", c: "451", d: "461" }, correct: "b" },
        { question: "22^2 канча болот?", options: { a: "474", b: "484", c: "494", d: "504" }, correct: "b" },
        { question: "23^2 канча болот?", options: { a: "519", b: "529", c: "539", d: "549" }, correct: "b" },
        { question: "24^2 канча болот?", options: { a: "566", b: "576", c: "586", d: "596" }, correct: "b" },
        { question: "25^2 канча болот?", options: { a: "615", b: "625", c: "635", d: "645" }, correct: "b" },
        { question: "26^2 канча болот?", options: { a: "666", b: "676", c: "686", d: "696" }, correct: "b" },
        { question: "27^2 канча болот?", options: { a: "719", b: "729", c: "739", d: "749" }, correct: "b" },
        { question: "28^2 канча болот?", options: { a: "774", b: "784", c: "794", d: "804" }, correct: "b" },
        { question: "29^2 канча болот?", options: { a: "831", b: "841", c: "851", d: "861" }, correct: "b" },
        { question: "30^2 канча болот?", options: { a: "890", b: "900", c: "910", d: "920" }, correct: "b" },
        { question: "31^2 канча болот?", options: { a: "951", b: "961", c: "971", d: "981" }, correct: "b" },
        { question: "32^2 канча болот?", options: { a: "1014", b: "1024", c: "1034", d: "1044" }, correct: "b" }
    ],
    kyrgyz_part1: [
        { question: "Кыргыз тилинде 'күн' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "c" },
        { question: "Кыргыз тилинде 'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Тоо", c: "Токой", d: "Жол" }, correct: "b" },
        { question: "Кыргыз тилинде 'китеп' деген эмне?", options: { a: "Калем", b: "Китеп", c: "Дептер", d: "Сумка" }, correct: "b" },
        { question: "Кыргыз тилинде 'үй' деген эмне?", options: { a: "Мектеп", b: "Үй", c: "Көчө", d: "Бакча" }, correct: "b" },
        { question: "Кыргыз тилинде 'суу' деген эмне?", options: { a: "Аба", b: "Жер", c: "Суу", d: "От" }, correct: "c" },
        { question: "Кыргыз тилинде 'бала' деген эмне?", options: { a: "Чоң киши", b: "Бала", c: "Ата", d: "Эне" }, correct: "b" },
        { question: "Кыргыз тилинде 'мектеп' деген эмне?", options: { a: "Оорукана", b: "Мектеп", c: "Дүкөн", d: "Парк" }, correct: "b" },
        { question: "Кыргыз тилинде 'жол' деген эмне?", options: { a: "Дарыя", b: "Тоо", c: "Жол", d: "Токой" }, correct: "c" },
        { question: "Кыргыз тилинде 'гүл' деген эмне?", options: { a: "Жаныбар", b: "Гүл", c: "Жемиш", d: "Жашылча" }, correct: "b" },
        { question: "Кыргыз тилинде 'көк' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'ата' деген ким?", options: { a: "Эне", b: "Бала", c: "Ата", d: "Чоң ата" }, correct: "c" },
        { question: "Кыргыз тилинде 'эне' деген ким?", options: { a: "Ата", b: "Эне", c: "Бала", d: "Чоң эне" }, correct: "b" },
        { question: "Кыргыз тилинде 'жаз' деген эмне?", options: { a: "Мезгил", b: "Түс", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'кыш' деген эмне?", options: { a: "Мезгил", b: "Түс", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'жай' деген эмне?", options: { a: "Мезгил", b: "Түс", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'күз' деген эмне?", options: { a: "Мезгил", b: "Түс", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'асман' деген эмне?", options: { a: "Жер", b: "Асман", c: "Суу", d: "От" }, correct: "b" },
        { question: "Кыргыз тилинде 'жер' деген эмне?", options: { a: "Асман", b: "Жер", c: "Суу", d: "От" }, correct: "b" },
        { question: "Кыргыз тилинде 'от' деген эмне?", options: { a: "Асман", b: "Жер", c: "Суу", d: "От" }, correct: "d" },
        { question: "Кыргыз тилинде 'аба' деген эмне?", options: { a: "Асман", b: "Аба", c: "Суу", d: "От" }, correct: "b" },
        { question: "Кыргыз тилинде 'дарыя' деген эмне?", options: { a: "Тоо", b: "Дарыя", c: "Токой", d: "Жол" }, correct: "b" },
        { question: "Кыргыз тилинде 'токой' деген эмне?", options: { a: "Тоо", b: "Дарыя", c: "Токой", d: "Жол" }, correct: "c" },
        { question: "Кыргыз тилинде 'жаныбар' деген эмне?", options: { a: "Гүл", b: "Жаныбар", c: "Жемиш", d: "Жашылча" }, correct: "b" },
        { question: "Кыргыз тилинде 'жемиш' деген эмне?", options: { a: "Гүл", b: "Жаныбар", c: "Жемиш", d: "Жашылча" }, correct: "c" },
        { question: "Кыргыз тилинде 'жашылча' деген эмне?", options: { a: "Гүл", b: "Жаныбар", c: "Жемиш", d: "Жашылча" }, correct: "d" },
        { question: "Кыргыз тилинде 'кызыл' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'сары' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'жашыл' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'кара' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" },
        { question: "Кыргыз тилинде 'ак' деген эмне?", options: { a: "Түс", b: "Жер", c: "Аба", d: "Суу" }, correct: "a" }
    ],
    kyrgyz_part2: [
        { question: "Кыргыз тилинде 'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Тоо", c: "Токой", d: "Жол" }, correct: "b" },
        { question: "Кыргыз тилинде 'көл' деген эмне?", options: { a: "Дарыя", b: "Көл", c: "Токой", d: "Жол" }, correct: "b" },
        { question: "Кыргыз тилинде 'чөл' деген эмне?", options: { a: "Дарыя", b: "Көл", c: "Чөл", d: "Жол" }, correct: "c" },
        { question: "Кыргыз тилинде 'шамал' деген эмне?", options: { a: "Аба", b: "Шамал", c: "Суу", d: "От" }, correct: "b" },
        { question: "Кыргыз тилинде 'жаан' деген эмне?", options: { a: "Кар", b: "Жаан", c: "Шамал", d: "Күн" }, correct: "b" },
        { question: "Кыргыз тилинде 'кар' деген эмне?", options: { a: "Кар", b: "Жаан", c: "Шамал", d: "Күн" }, correct: "a" },
        { question: "Кыргыз тилинде 'күндүз' деген эмне?", options: { a: "Түн", b: "Күндүз", c: "Эртең", d: "Кеч" }, correct: "b" },
        { question: "Кыргыз тилинде 'түн' деген эмне?", options: { a: "Түн", b: "Күндүз", c: "Эртең", d: "Кеч" }, correct: "a" },
        { question: "Кыргыз тилинде 'эртең' деген эмне?", options: { a: "Түн", b: "Күндүз", c: "Эртең", d: "Кеч" }, correct: "c" },
        { question: "Кыргыз тилинде 'кеч' деген эмне?", options: { a: "Түн", b: "Күндүз", c: "Эртең", d: "Кеч" }, correct: "d" },
        { question: "Кыргыз тилинде 'жылуу' деген эмне?", options: { a: "Суук", b: "Жылуу", c: "Ысык", d: "Муздак" }, correct: "b" },
        { question: "Кыргыз тилинде 'суук' деген эмне?", options: { a: "Суук", b: "Жылуу", c: "Ысык", d: "Муздак" }, correct: "a" },
        { question: "Кыргыз тилинде 'ысык' деген эмне?", options: { a: "Суук", b: "Жылуу", c: "Ысык", d: "Муздак" }, correct: "c" },
        { question: "Кыргыз тилинде 'муздак' деген эмне?", options: { a: "Суук", b: "Жылуу", c: "Ысык", d: "Муздак" }, correct: "d" },
        { question: "Кыргыз тилинде 'чоң' деген эмне?", options: { a: "Чоң", b: "Кичине", c: "Узун", d: "Кыска" }, correct: "a" },
        { question: "Кыргыз тилинде 'кичине' деген эмне?", options: { a: "Чоң", b: "Кичине", c: "Узун", d: "Кыска" }, correct: "b" },
        { question: "Кыргыз тилинде 'узун' деген эмне?", options: { a: "Чоң", b: "Кичине", c: "Узун", d: "Кыска" }, correct: "c" },
        { question: "Кыргыз тилинде 'кыска' деген эмне?", options: { a: "Чоң", b: "Кичине", c: "Узун", d: "Кыска" }, correct: "d" },
        { question: "Кыргыз тилинде 'бийик' деген эмне?", options: { a: "Бийик", b: "Төмөн", c: "Жогору", d: "Төмөндө" }, correct: "a" },
        { question: "Кыргыз тилинде 'төмөн' деген эмне?", options: { a: "Бийик", b: "Төмөн", c: "Жогору", d: "Төмөндө" }, correct: "b" },
        { question: "Кыргыз тилинде 'жогору' деген эмне?", options: { a: "Бийик", b: "Төмөн", c: "Жогору", d: "Төмөндө" }, correct: "c" },
        { question: "Кыргыз тилинде 'төмөндө' деген эмне?", options: { a: "Бийик", b: "Төмөн", c: "Жогору", d: "Төмөндө" }, correct: "d" },
        { question: "Кыргыз тилинде 'оң' деген эмне?", options: { a: "Оң", b: "Сол", c: "Алдыда", d: "Артта" }, correct: "a" },
        { question: "Кыргыз тилинде 'сол' деген эмне?", options: { a: "Оң", b: "Сол", c: "Алдыда", d: "Артта" }, correct: "b" },
        { question: "Кыргыз тилинде 'алдыда' деген эмне?", options: { a: "Оң", b: "Сол", c: "Алдыда", d: "Артта" }, correct: "c" },
        { question: "Кыргыз тилинде 'артта' деген эмне?", options: { a: "Оң", b: "Сол", c: "Алдыда", d: "Артта" }, correct: "d" },
        { question: "Кыргыз тилинде 'жакшы' деген эмне?", options: { a: "Жакшы", b: "Жаман", c: "Сулуу", d: "Кубарып" }, correct: "a" },
        { question: "Кыргыз тилинде 'жаман' деген эмне?", options: { a: "Жакшы", b: "Жаман", c: "Сулуу", d: "Кубарып" }, correct: "b" },
        { question: "Кыргыз тилинде 'сулуу' деген эмне?", options: { a: "Жакшы", b: "Жаман", c: "Сулуу", d: "Кубарып" }, correct: "c" },
        { question: "Кыргыз тилинде 'кубарып' деген эмне?", options: { a: "Жакшы", b: "Жаман", c: "Сулуу", d: "Кубарып" }, correct: "d" }
    ],
    manas_part1: [
        { question: "Манас эпосунда ким башкы каарман?", options: { a: "Алтай", b: "Манас", c: "Каныкей", d: "Семетей" }, correct: "b" },
        { question: "Манас эпосунда Каныкей ким?", options: { a: "Манастын аялы", b: "Манастын уулу", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Семетей ким?", options: { a: "Манастын аялы", b: "Манастын уулу", c: "Манастын душманы", d: "Манастын атасы" }, correct: "b" },
        { question: "Манас эпосу кандай жанрга кирет?", options: { a: "Роман", b: "Поэма", c: "Эпос", d: "Аңгеме" }, correct: "c" },
        { question: "Манас эпосунда Манастын душманы ким?", options: { a: "Алтай", b: "Жолой", c: "Каныкей", d: "Семетей" }, correct: "b" },
        { question: "Манас эпосунда Манастын атасы ким?", options: { a: "Жакып", b: "Алтай", c: "Жолой", d: "Семетей" }, correct: "a" },
        { question: "Манас эпосунда Манастын энеси ким?", options: { a: "Чыйырды", b: "Каныкей", c: "Айчүрөк", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын атты кандай атайт?", options: { a: "Аккула", b: "Карагул", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Каныкейдин атасы ким?", options: { a: "Темир", b: "Жакып", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын досору кимдер?", options: { a: "Кошой жана Алмамбет", b: "Жолой жана Алтай", c: "Семетей жана Каныкей", d: "Темир жана Жакып" }, correct: "a" },
        { question: "Манас эпосунда Алмамбет ким?", options: { a: "Манастын дос", b: "Манастын душманы", c: "Манастын уулу", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Кошой ким?", options: { a: "Манастын дос", b: "Манастын душманы", c: "Манастын уулу", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Манастын туулган жери кайда?", options: { a: "Алтай", b: "Талас", c: "Бишкек", d: "Ош" }, correct: "b" },
        { question: "Манас эпосунда Манастын өлүмү кандай болгон?", options: { a: "Согушта", b: "Оорудан", c: "Кырсыктан", d: "Ууланган" }, correct: "a" },
        { question: "Манас эпосунда Каныкейдин уулу ким?", options: { a: "Семетей", b: "Алмамбет", c: "Кошой", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Манастын куралы кандай?", options: { a: "Найза", b: "Кылыч", c: "Жаа", d: "Балта" }, correct: "a" },
        { question: "Манас эпосунда Манастын душмандары кайдан?", options: { a: "Кытайдан", b: "Орусиядан", c: "Казакстандан", d: "Түркиядан" }, correct: "a" },
        { question: "Манас эпосунда Манастын уулунун аялы ким?", options: { a: "Айчүрөк", b: "Каныкей", c: "Чыйырды", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын жашоо максаты эмне?", options: { a: "Элди бириктирүү", b: "Байлык топтоо", c: "Саякаттоо", d: "Окуу" }, correct: "a" },
        { question: "Манас эпосунда Манастын өлүмүнөн кийин ким башкарат?", options: { a: "Семетей", b: "Каныкей", c: "Алмамбет", d: "Кошой" }, correct: "a" },
        { question: "Манас эпосунда Манастын эң жакын досу ким?", options: { a: "Алмамбет", b: "Кошой", c: "Семетей", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Манастын атасынын аты эмне?", options: { a: "Жакып", b: "Темир", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын энесинин аты эмне?", options: { a: "Чыйырды", b: "Каныкей", c: "Айчүрөк", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын аты кандай мааниде?", options: { a: "Баатыр", b: "Падыша", c: "Жоокер", d: "Акылман" }, correct: "a" },
        { question: "Манас эпосунда Манастын аялынын аты эмне?", options: { a: "Каныкей", b: "Чыйырды", c: "Айчүрөк", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын уулунун аты эмне?", options: { a: "Семетей", b: "Алмамбет", c: "Кошой", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Манастын аттынын аты эмне?", options: { a: "Аккула", b: "Карагул", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Манастын душманынын аты эмне?", options: { a: "Жолой", b: "Алмамбет", c: "Кошой", d: "Семетей" }, correct: "a" },
        { question: "Манас эпосунда Манастын туулган жери кайда?", options: { a: "Талас", b: "Алтай", c: "Бишкек", d: "Ош" }, correct: "a" },
        { question: "Манас эпосунда Манастын жашоо максаты эмне?", options: { a: "Элди бириктирүү", b: "Байлык топтоо", c: "Саякаттоо", d: "Окуу" }, correct: "a" }
    ],
    manas_part2: [
        { question: "Манас эпосунда Семетей ким?", options: { a: "Манастын уулу", b: "Манастын аялы", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Айчүрөк ким?", options: { a: "Семетейдин аялы", b: "Манастын аялы", c: "Манастын энеси", d: "Манастын душманы" }, correct: "a" },
        { question: "Манас эпосунда Күлчоро ким?", options: { a: "Семетейдин дос", b: "Семетейдин душманы", c: "Манастын уулу", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин душманы ким?", options: { a: "Абыке", b: "Каныкей", c: "Алмамбет", d: "Кошой" }, correct: "a" },
        { question: "Манас эпосунда Семетей кайда жашайт?", options: { a: "Талас", b: "Бухара", c: "Алтай", d: "Бишкек" }, correct: "b" },
        { question: "Манас эпосунда Семетейдин атасы ким?", options: { a: "Манас", b: "Жакып", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин энеси ким?", options: { a: "Каныкей", b: "Чыйырды", c: "Айчүрөк", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин атты кандай атайт?", options: { a: "Тайбуурул", b: "Аккула", c: "Карагул", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Айчүрөк кайдан келген?", options: { a: "Бухара", b: "Талас", c: "Алтай", d: "Кытай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин досору кимдер?", options: { a: "Күлчоро жана Чубак", b: "Жолой жана Алтай", c: "Каныкей жана Алмамбет", d: "Темир жана Жакып" }, correct: "a" },
        { question: "Манас эпосунда Чубак ким?", options: { a: "Семетейдин дос", b: "Семетейдин душманы", c: "Манастын уулу", d: "Манастын атасы" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин өлүмү кандай болгон?", options: { a: "Согушта", b: "Оорудан", c: "Кырсыктан", d: "Ууланган" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин уулу ким?", options: { a: "Сейтек", b: "Алмамбет", c: "Кошой", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин куралы кандай?", options: { a: "Найза", b: "Кылыч", c: "Жаа", d: "Балта" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин душмандары кайдан?", options: { a: "Кытайдан", b: "Орусиядан", c: "Казакстандан", d: "Түркиядан" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин жашоо максаты эмне?", options: { a: "Атасынын өчүн алуу", b: "Байлык топтоо", c: "Саякаттоо", d: "Окуу" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин өлүмүнөн кийин ким башкарат?", options: { a: "Сейтек", b: "Айчүрөк", c: "Күлчоро", d: "Чубак" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин эң жакын досу ким?", options: { a: "Күлчоро", b: "Чубак", c: "Сейтек", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин атасынын аты эмне?", options: { a: "Манас", b: "Темир", c: "Жолой", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин энесинин аты эмне?", options: { a: "Каныкей", b: "Чыйырды", c: "Айчүрөк", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин аты кандай мааниде?", options: { a: "Баатыр", b: "Падыша", c: "Жоокер", d: "Акылман" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин аялынын аты эмне?", options: { a: "Айчүрөк", b: "Каныкей", c: "Чыйырды", d: "Алтай" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин уулунун аты эмне?", options: { a: "Сейтек", b: "Алмамбет", c: "Кошой", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин аттынын аты эмне?", options: { a: "Тайбуурул", b: "Аккула", c: "Карагул", d: "Жолой" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин душманынын аты эмне?", options: { a: "Абыке", b: "Алмамбет", c: "Кошой", d: "Сейтек" }, correct: "a" },
        { question: "Манас эпосунда Семетей кайда туулган?", options: { a: "Талас", b: "Бухара", c: "Алтай", d: "Бишкек" }, correct: "a" },
        { question: "Манас эпосунда Айчүрөк кимге үйлөнгөн?", options: { a: "Семетей", b: "Манас", c: "Күлчоро", d: "Чубак" }, correct: "a" },
        { question: "Манас эпосунда Күлчоро кандай ролду ойнойт?", options: { a: "Дос", b: "Душман", c: "Жоокер", d: "Падыша" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин уулунун атасы ким?", options: { a: "Семетей", b: "Манас", c: "Күлчоро", d: "Чубак" }, correct: "a" },
        { question: "Манас эпосунда Семетейдин жашоо максаты эмне?", options: { a: "Атасынын өчүн алуу", b: "Байлык топтоо", c: "Саякаттоо", d: "Окуу" }, correct: "a" }
    ]
};

// Быстрый выбор предмета для теста
function quickSelectSubject(subject, type = 'ort_prob') {
    if (subject) {
        testType = type;
        selectSubject(subject);
    }
}

// Предметти тандоо
function selectSubject(subject) {
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Бөлүктү тандоо
function selectPart(part) {
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Бөлүк жөнүндө маалыматты жаңылоо
function updatePartDetails() {
    const time = currentPart == 1 ? 30 : 60;
    document.getElementById('part-description').textContent = currentLang === 'ky' 
        ? `Суроолордун саны: 30, Убакыт: ${time} мүнөт` 
        : `Количество вопросов: 30, Время: ${time} минут`;
}

// Тестти баштоо
function startTest() {
    window.location.href = 'test.html';
}

// Тестти жүктөө
function loadTest() {
    const key = `${currentSubject}_part${currentPart}`;
    if (!questions[key] || questions[key].length !== 30) {
        alert(currentLang === 'ky' ? "Суроолор толук эмес! 30 суроо болушу керек." : "Вопросы неполные! Должно быть 30 вопросов.");
        return;
    }
    currentTest = questions[key];
    currentQuestionIndex = 0;
    userAnswers = Array(30).fill(null);
    displayQuestion();
}

// Учурдагы суроону көрсөтүү
function displayQuestion() {
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');
    const questionCounter = document.getElementById('question-counter');

    const q = currentTest[currentQuestionIndex];
    questionsDiv.innerHTML = `
        <div class="question">
            <p>${currentQuestionIndex + 1}. ${q.question}</p>
            <p>a) ${q.options.a}</p>
            <p>b) ${q.options.b}</p>
            <p>c) ${q.options.c}</p>
            <p>d) ${q.options.d}</p>
        </div>
    `;
    answersDiv.innerHTML = `
        <div class="answer-row">
            <span>${currentQuestionIndex + 1}.</span>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="a" ${userAnswers[currentQuestionIndex] === 'a' ? 'checked' : ''}> a</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="b" ${userAnswers[currentQuestionIndex] === 'b' ? 'checked' : ''}> b</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="c" ${userAnswers[currentQuestionIndex] === 'c' ? 'checked' : ''}> c</label>
            <label><input type="radio" name="ans${currentQuestionIndex}" value="d" ${userAnswers[currentQuestionIndex] === 'd' ? 'checked' : ''}> d</label>
        </div>
    `;
    questionCounter.textContent = `${currentQuestionIndex + 1}/30`;

    answersDiv.querySelectorAll(`input[name="ans${currentQuestionIndex}"]`).forEach(input => {
        input.addEventListener('change', () => {
            userAnswers[currentQuestionIndex] = input.value;
        });
    });
}

// Мурунку суроого өтүү
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Кийинки суроого өтүү
function nextQuestion() {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Таймер
function startTimer() {
    const timeLimit = currentPart == 1 ? 30 * 60 : 60 * 60;
    let timeLeft = timeLimit;
    const timerDiv = document.getElementById('timer');
    timerInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDiv.textContent = currentLang === 'ky' 
            ? `Калган убакыт: ${mins}:${secs < 10 ? '0' : ''}${secs}` 
            : `Оставшееся время: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

// Тестти тапшыруу
function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / 30 * 100).toFixed(2);
    const knowledge = percentage >= 80 ? (currentLang === 'ky' ? 'Жогорку' : 'Высокий') : 
                      percentage >= 50 ? (currentLang === 'ky' ? 'Орточо' : 'Средний') : 
                      (currentLang === 'ky' ? 'Төмөн' : 'Низкий');

    localStorage.setItem('score', score);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);

    // Сохранение результатов в профиль пользователя
    if (currentUser) {
        const testKey = `${testType}_${currentSubject}_part${currentPart}`;
        userData.testResults[testKey] = { score, percentage, knowledge, date: new Date().toLocaleString() };
        userData.knowledgeAreas[currentSubject] = knowledge;
        saveUserData(currentUser);
    }

    window.location.href = 'results.html';
}

// Башкы бетке кайтуу
function backToMain() {
    localStorage.removeItem('subject');
    localStorage.removeItem('part');
    window.location.href = 'index.html';
}

// Курстар
function quickSelectCourse(subject) {
    if (subject) {
        localStorage.setItem('courseSubject', subject);
        window.location.href = 'courses.html';
    }
}

function startCourseLesson() {
    const subject = localStorage.getItem('courseSubject');
    if (currentUser) {
        userData.courseProgress[subject] = { progress: 50, lastLesson: currentLang === 'ky' ? 'Тема 1' : 'Тема 1' }; // Пример прогресса
        saveUserData(currentUser);
    }
    alert(currentLang === 'ky' ? 'Урок башталды!' : 'Урок начат!');
}

// Показ результатов
function showResults(subject) {
    const resultsDiv = document.getElementById('results-content');
    if (!subject) {
        resultsDiv.innerHTML = '';
        return;
    }
    if (userData && userData.testResults) {
        let html = '';
        for (let key in userData.testResults) {
            if (key.includes(subject)) {
                const result = userData.testResults[key];
                html += `<p>${key}: ${currentLang === 'ky' ? 'Балл' : 'Баллы'}: ${result.score}/30, ${currentLang === 'ky' ? 'Пайыз' : 'Процент'}: ${result.percentage}%, ${currentLang === 'ky' ? 'Билим деңгээли' : 'Уровень знаний'}: ${result.knowledge}, ${currentLang === 'ky' ? 'Күнү' : 'Дата'}: ${result.date}</p>`;
            }
        }
        resultsDiv.innerHTML = html || (currentLang === 'ky' ? 'Жыйынтыктар жок.' : 'Результатов нет.');
    }
}

// Продолжение курсов
function showContinueContent() {
    const continueDiv = document.getElementById('continue-content');
    if (userData && userData.courseProgress) {
        let html = '';
        for (let subject in userData.courseProgress) {
            const progress = userData.courseProgress[subject];
            const subjectName = subject === 'math' ? (currentLang === 'ky' ? 'Математика' : 'Математика') :
                                subject === 'kyrgyz' ? (currentLang === 'ky' ? 'Кыргыз тили' : 'Кыргызский язык') :
                                subject === 'manas' ? (currentLang === 'ky' ? 'Манас таануу' : 'Манасоведение') : '';
            html += `<p>${subjectName}: ${currentLang === 'ky' ? 'Прогресс' : 'Прогресс'}: ${progress.progress}%, ${currentLang === 'ky' ? 'Акыркы урок' : 'Последний урок'}: ${progress.lastLesson}</p>`;
        }
        continueDiv.innerHTML = html || (currentLang === 'ky' ? 'Улантуу үчүн курстар жок.' : 'Нет курсов для продолжения.');
    }
}