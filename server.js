const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let secretCode = generateCode();
let winner = null;
let leaderboard = {};

function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function getHints(code) {
    const digits = code.split('').map(Number);

    return {
        first: digits[0],
        last: digits[3],
        sum: digits.reduce((a, b) => a + b, 0),
        even: digits.filter(x => x % 2 === 0).length,
        odd: digits.filter(x => x % 2 !== 0).length
    };
}

function nextRound() {
    secretCode = generateCode();
    winner = null;

    const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let secretCode = "";
let winner = null;
let leaderboard = {};
let timeLeft = 20;

// 🔥 Банк подсказок
const allHints = [
    (c) => Первая цифра: ${c[0]},
    (c) => Последняя цифра: ${c[3]},
    (c) => Сумма цифр: ${c.split('').reduce((a,b)=>+a+ +b,0)},
    (c) => Чётных цифр: ${c.split('').filter(x=>x%2==0).length},
    (c) => Нечётных цифр: ${c.split('').filter(x=>x%2!=0).length},
    (c) => Цифр всего: ${c.length},
    (c) => Среднее значение: ${Math.floor(c.split('').reduce((a,b)=>+a+ +b,0)/4)}
];

function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// 🔥 выбираем 4 подсказки
function getHints(code) {
    return allHints
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(fn => fn(code));
}

function nextRound() {
    secretCode = generateCode();
    winner = null;
    timeLeft = 20;

    io.emit("newRound", getHints(secretCode));
    io.emit("timer", timeLeft);

    console.log("Код:", secretCode);
}

// ⏱ таймер
setInterval(() => {
    timeLeft--;

    io.emit("timer", timeLeft);

    if (timeLeft <= 0) {
        nextRound();
    }
}, 1000);

io.on("connection", (socket) => {
    socket.emit("newRound", getHints(secretCode));
    socket.emit("timer", timeLeft);

    socket.on("guess", (data) => {
        if (winner) return;

        if (data.code === secretCode) {
            winner = data.username;

            leaderboard[data.username] = (leaderboard[data.username] || 0) + 1;

            const sorted = Object.entries(leaderboard)
                .sort((a,b)=>b[1]-a[1]);

            io.emit("leaderboard", sorted);

            io.emit("correct", data.username);

        } else {
            socket.emit("wrong");
        }
    });
});

server.listen(3000, () => {
    console.log("http://localhost:3000");

    nextRound();
});