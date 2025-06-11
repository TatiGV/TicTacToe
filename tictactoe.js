const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['0', '4', '8'],
        ['2', '4', '6']
    ]
};

let scores = JSON.parse(localStorage.getItem("scores")) || {
    deadpool: { wins: 0, losses: 0, total: 0 },
    wolverine: { wins: 0, losses: 0, total: 0 }
};

function updateScoreboard() {
    document.getElementById("deadpool-wins").textContent = scores.deadpool.wins;
    document.getElementById("deadpool-losses").textContent = scores.deadpool.losses;
    document.getElementById("deadpool-total").textContent = scores.deadpool.total;

    document.getElementById("wolverine-wins").textContent = scores.wolverine.wins;
    document.getElementById("wolverine-losses").textContent = scores.wolverine.losses;
    document.getElementById("wolverine-total").textContent = scores.wolverine.total;
}

updateScoreboard();

let board = document.getElementById("game");

const restartContainer = document.querySelector(".restart");
const restartBtn = document.querySelector(".restart button");

restartContainer.classList.remove("hidden");

board.classList.add("hidden");

for (let i = 0; i <= 8; i++) {
    let divCell = document.createElement("div");
    divCell.classList.add("cell");
    divCell.id = i;
    board.appendChild(divCell);
}

let turnText = document.querySelector(".container-text");
let turnSpan = document.querySelector(".text-turn");
turnText.classList.add("hidden");

function showTurn() {
    turnText.classList.remove("hidden");
    if (game.xTurn === true) {
        turnSpan.innerHTML = `<img src="./images/wolver.png" alt="Wolverine"/>`;
    } else {
        turnSpan.innerHTML = `<img src="./images/deadpool.png" alt="Deadpool" />`;
    }
}

board.addEventListener('click', event => {
    const cell = event.target;

    if (!cell.classList.contains("cell")) {
        alert("click on the board!!");
        return;
    }

    if (cell.classList.contains("x") || cell.classList.contains("o")) {
        alert("Click another cell!!!");
        return;
    }

    const cellId = cell.id;

    if (game.xTurn) {
        game.xState.push(cellId);
        cell.classList.add("x");
    } else {
        game.oState.push(cellId);
        cell.classList.add("o");
    }

    let currentPlayer;
    if (game.xTurn === true) {
        currentPlayer = game.xState;
    } else {
        currentPlayer = game.oState;
    }

    if (checkWinner(currentPlayer)) {
        if (game.xTurn === true) {
            showPopup("x");
        } else {
            showPopup("o");
        }
        board.style.pointerEvents = "none";
        restartContainer.classList.remove("hidden");
        turnText.classList.add("hidden");
        return;
    }

    const totalPlays = game.xState.length + game.oState.length;
    if (totalPlays === 9) {
        showPopup("DRAW!!!");
        restartContainer.classList.remove("hidden");
        turnText.classList.add("hidden");
        return;
    }

    if (game.xTurn) {
        game.xTurn = false;
    } else {
        game.xTurn = true;
    }

    showTurn();
});

function checkWinner(playerState) {
    return game.winningStates.some(combinacion => combinacion.every(position => playerState.includes(position)));
}

restartBtn.addEventListener('click', () => {
    const cell = document.querySelectorAll(".cell");
    cell.forEach(cell => cell.classList.remove("x", "o"));

    game.xTurn = Math.random() < 0.5;
    game.xState = [];
    game.oState = [];

    board.style.pointerEvents = "auto";

    board.classList.remove("hidden");
    showTurn();

    restartContainer.classList.add("hidden");
});

function showPopup(winner) {
    const popup = document.querySelector(".popup");
    const popupContent = document.getElementById("popup-content");

    if (winner === "x") {
        scores.wolverine.wins++;
        scores.deadpool.losses++;
        scores.wolverine.total++;
        popupContent.innerHTML = `
        <img src="./images/wolver.png" alt="Wolverine"/>
        <span>Wolvering win!</span>`;
    } else if (winner === "o") {
        scores.deadpool.wins++;
        scores.wolverine.losses++;
        scores.deadpool.total++;
        popupContent.innerHTML = `
        <img src="./images/deadpool.png" alt="Deadpool" />
        <span>Deadpool win!</span>
    `;
    } else {
        popupContent.innerHTML = `<p>DRAW!</p>`;
    }

    localStorage.setItem("scores", JSON.stringify(scores));
    updateScoreboard();

    popup.classList.remove("hidden");
}

document.querySelector(".popup-close").addEventListener("click", () => {
    document.querySelector(".popup").classList.add("hidden");
});

document.getElementById("reset-scores").addEventListener("click", () => {
    scores = {
        wolverine: { wins: 0, losses: 0, total: 0 },
        deadpool: { wins: 0, losses: 0, total: 0 }
    };
    localStorage.setItem("scores", JSON.stringify(scores));
    updateScoreboard();
});