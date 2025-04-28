const questions = {
    math: {
        part1: [
            {
                id: 1,
                text: "2 + 2 * 3 = ?",
                options: ["8", "12", "10", "7"],
                correct: "8",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 2,
                text: "Эгерде бир алма 20 сом турса, 3 алма канча сом болот?",
                options: ["50 сом", "60 сом", "40 сом", "70 сом"],
                correct: "60 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 3,
                text: "5тин квадраты канчага барабар?",
                options: ["20", "25", "15", "30"],
                correct: "25",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 4,
                text: "10дун 20% канча?",
                options: ["2", "4", "1", "5"],
                correct: "2",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 5,
                text: "Эгерде унаа 2 саатта 120 км жүрсө, анын ылдамдыгы канча?",
                options: ["50 км/саат", "60 км/саат", "70 км/саат", "80 км/саат"],
                correct: "60 км/саат",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 6,
                text: "12дин 50% канча?",
                options: ["5", "6", "7", "8"],
                correct: "6",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 7,
                text: "Эгерде китептин баасы 150 сом болсо, ал эми 20% арзандатуу берилсе, китеп канча сом болот?",
                options: ["120 сом", "130 сом", "140 сом", "110 сом"],
                correct: "120 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 8,
                text: "3 + 5 * 2 = ?",
                options: ["16", "13", "11", "10"],
                correct: "13",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 9,
                text: "15тин 10% канча?",
                options: ["1", "1.5", "2", "2.5"],
                correct: "1.5",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 10,
                text: "Эгерде бир бала саатына 5 км басса, 2 саатта канча км басат?",
                options: ["8 км", "10 км", "12 км", "15 км"],
                correct: "10 км",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 11,
                text: "7 * 8 = ?",
                options: ["54", "56", "58", "60"],
                correct: "56",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 12,
                text: "20 сомго 4 карандаш сатып алса, 1 карандаш канча сом турат?",
                options: ["4 сом", "5 сом", "6 сом", "7 сом"],
                correct: "5 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 13,
                text: "25тин 40% канча?",
                options: ["8", "10", "12", "15"],
                correct: "10",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 14,
                text: "Эгерде поезд 3 саатта 240 км жүрсө, анын ылдамдыгы канча?",
                options: ["70 км/саат", "80 км/саат", "90 км/саат", "100 км/саат"],
                correct: "80 км/саат",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 15,
                text: "9 + 4 * 3 = ?",
                options: ["21", "23", "25", "27"],
                correct: "21",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 16,
                text: "30дун 25% канча?",
                options: ["5", "7.5", "10", "12.5"],
                correct: "7.5",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 17,
                text: "Эгерде бир сумка 500 сом болсо, ал эми 10% арзандатуу берилсе, сумка канча сом болот?",
                options: ["450 сом", "460 сом", "470 сом", "480 сом"],
                correct: "450 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 18,
                text: "6 * 7 = ?",
                options: ["40", "42", "44", "46"],
                correct: "42",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 19,
                text: "50 сомго 5 кг алма сатып алса, 1 кг алма канча сом турат?",
                options: ["8 сом", "9 сом", "10 сом", "11 сом"],
                correct: "10 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 20,
                text: "40тин 15% канча?",
                options: ["4", "5", "6", "7"],
                correct: "6",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 21,
                text: "Эгерде бала 4 саатта 20 км басса, анын ылдамдыгы канча?",
                options: ["4 км/саат", "5 км/саат", "6 км/саат", "7 км/саат"],
                correct: "5 км/саат",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 22,
                text: "8 + 3 * 4 = ?",
                options: ["20", "22", "24", "26"],
                correct: "20",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 23,
                text: "60тин 30% канча?",
                options: ["15", "18", "20", "22"],
                correct: "18",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 24,
                text: "Эгерде 1 кг конфет 200 сом болсо, 3 кг конфет канча сом болот?",
                options: ["500 сом", "600 сом", "700 сом", "800 сом"],
                correct: "600 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 25,
                text: "5 * 9 = ?",
                options: ["40", "45", "50", "55"],
                correct: "45",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 26,
                text: "80тин 10% канча?",
                options: ["6", "7", "8", "9"],
                correct: "8",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 27,
                text: "Эгерде 1 литр суу 50 сом болсо, 4 литр суу канча сом болот?",
                options: ["150 сом", "200 сом", "250 сом", "300 сом"],
                correct: "200 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            },
            {
                id: 28,
                text: "10 + 2 * 5 = ?",
                options: ["20", "22", "24", "26"],
                correct: "20",
                category: "арифметика",
                difficulty: "easy"
            },
            {
                id: 29,
                text: "90тин 20% канча?",
                options: ["16", "18", "20", "22"],
                correct: "18",
                category: "проценты",
                difficulty: "easy"
            },
            {
                id: 30,
                text: "Эгерде 1 кг картошка 40 сом болсо, 5 кг картошка канча сом болот?",
                options: ["180 сом", "200 сом", "220 сом", "240 сом"],
                correct: "200 сом",
                category: "текстовые задачи",
                difficulty: "easy"
            }
        ],
        part2: []
    },
    kyrgyz: {
        part1: [],
        part2: []
    }
};ory: "тест",
                difficulty: "hard"
            },
            {
                id: 102,
                text: "ТЕСТОВЫЙ ВОПРОС 102",
                options: ["Ответ A", "Ответ B", "Ответ C", "Ответ D"],
                correct: "Ответ A",
                category: "тест",
                difficulty: "hard"
            }
        ]
    },
    kyrgyz: {
        part1: [
            {
                id: 201,
                text: "ТЕСТОВЫЙ ВОПРОС 201",
                options: ["Ответ A", "Ответ B", "Ответ C", "Ответ D"],
                correct: "Ответ A",
                category: "тест",
                difficulty: "easy"
            },
            {
                id: 202,
                text: "ТЕСТОВЫЙ ВОПРОС 202",
                options: ["Ответ A", "Ответ B", "Ответ C", "Ответ D"],
                correct: "Ответ A",
                category: "тест",
                difficulty: "easy"
            }
        ],
        part2: []
    }
};        text: "«Ыйман» сөзүнүн мааниси эмне?",
                options: ["Акыл", "Адеп", "Сабыр", "Кайрат"],
                correct: "Адеп",
                category: "лексика",
                difficulty: "easy"
            }
        ],
        part2: []
    }
};