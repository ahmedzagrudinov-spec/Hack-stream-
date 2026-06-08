const socket = io();

function send() {
    const username = document.getElementById("username").value;
    const code = document.getElementById("code").value;

    socket.emit("guess", { username, code });
}

socket.on("newRound", (hints) => {
    document.getElementById("hints").innerHTML =
        hints.map(h => <p>${h}</p>).join("");
});

socket.on("timer", (t) => {
    document.getElementById("timer").innerText = t;
});

socket.on("correct", (user) => {
    document.getElementById("status").innerText = user + " взломал код!";
    document.getElementById("status").style.color = "lime";
});

socket.on("wrong", () => {
    document.getElementById("status").innerText = "Неверно";
    document.getElementById("status").style.color = "red";
});

socket.on("leaderboard", (data) => {
    const list = document.getElementById("leaderboard");
    list.innerHTML = "";

    data.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = ${name}: ${score};
        list.appendChild(li);
    });
});