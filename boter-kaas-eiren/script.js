const canvas  = document.getElementById("canvas");
const ctx     = canvas.getContext("2d");

const GROOTTE = canvas.width / 3;
const PAD     = 15;

let bord, beurt, gameOver, scores;
scores = { X: 0, O: 0, gelijk: 0 };

function startGame() {
  bord    = Array(9).fill(null);
  beurt   = "X";
  gameOver = false;

  document.getElementById("message").textContent = "";
  document.getElementById("beurt").textContent   = "Speler X is aan de beurt";

  draw();
}

function resetScore() {
  scores = { X: 0, O: 0, gelijk: 0 };
  updateScore();
  startGame();
}

function updateScore() {
  document.getElementById("score-x").textContent     = scores.X;
  document.getElementById("score-o").textContent     = scores.O;
  document.getElementById("score-gelijk").textContent = scores.gelijk;
}

canvas.addEventListener("click", (e) => {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const schaalX = canvas.width  / rect.width;
  const schaalY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * schaalX;
  const my = (e.clientY - rect.top)  * schaalY;

  const col = Math.floor(mx / GROOTTE);
  const row = Math.floor(my / GROOTTE);
  const idx = row * 3 + col;

  if (bord[idx]) return;

  bord[idx] = beurt;
  draw();

  const winnaar = checkWinnaar();
  if (winnaar) {
    gameOver = true;
    scores[winnaar]++;
    updateScore();
    document.getElementById("beurt").textContent   = "";
    document.getElementById("message").textContent = "Speler " + winnaar + " wint! 🎉";
    drawWinLijn(winnaar);
    return;
  }

  if (bord.every(v => v !== null)) {
    gameOver = true;
    scores.gelijk++;
    updateScore();
    document.getElementById("beurt").textContent   = "";
    document.getElementById("message").textContent = "Gelijkspel! 🤝";
    return;
  }

  beurt = beurt === "X" ? "O" : "X";
  document.getElementById("beurt").textContent = "Speler " + beurt + " is aan de beurt";
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // achtergrond
  ctx.fillStyle = "#B0BEC5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // grid lijnen
  ctx.strokeStyle = "#90A4AE";
  ctx.lineWidth   = 4;
  ctx.lineCap     = "round";

  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GROOTTE, PAD);
    ctx.lineTo(i * GROOTTE, canvas.height - PAD);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(PAD, i * GROOTTE);
    ctx.lineTo(canvas.width - PAD, i * GROOTTE);
    ctx.stroke();
  }

  // X en O tekenen
  bord.forEach((waarde, idx) => {
    if (!waarde) return;
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cx  = col * GROOTTE + GROOTTE / 2;
    const cy  = row * GROOTTE + GROOTTE / 2;

    if (waarde === "X") drawX(cx, cy);
    else                drawO(cx, cy);
  });
}

function drawX(cx, cy) {
  const offset = GROOTTE / 2 - PAD - 5;
  ctx.strokeStyle = "#1565c0";
  ctx.lineWidth   = 8;
  ctx.lineCap     = "round";

  ctx.beginPath();
  ctx.moveTo(cx - offset, cy - offset);
  ctx.lineTo(cx + offset, cy + offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + offset, cy - offset);
  ctx.lineTo(cx - offset, cy + offset);
  ctx.stroke();
}

function drawO(cx, cy) {
  const r = GROOTTE / 2 - PAD - 5;
  ctx.strokeStyle = "#b71c1c";
  ctx.lineWidth   = 8;
  ctx.lineCap     = "round";

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

const WINLIJNEN = [
  [0,1,2], [3,4,5], [6,7,8], // rijen
  [0,3,6], [1,4,7], [2,5,8], // kolommen
  [0,4,8], [2,4,6]            // diagonalen
];

function checkWinnaar() {
  for (const [a, b, c] of WINLIJNEN) {
    if (bord[a] && bord[a] === bord[b] && bord[a] === bord[c]) {
      return bord[a];
    }
  }
  return null;
}

function drawWinLijn(winnaar) {
  for (const [a, b, c] of WINLIJNEN) {
    if (bord[a] && bord[a] === bord[b] && bord[a] === bord[c]) {
      const colA = a % 3, rowA = Math.floor(a / 3);
      const colC = c % 3, rowC = Math.floor(c / 3);

      const x1 = colA * GROOTTE + GROOTTE / 2;
      const y1 = rowA * GROOTTE + GROOTTE / 2;
      const x2 = colC * GROOTTE + GROOTTE / 2;
      const y2 = rowC * GROOTTE + GROOTTE / 2;

      ctx.strokeStyle = winnaar === "X" ? "#1565c0" : "#b71c1c";
      ctx.lineWidth   = 6;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.globalAlpha = 1;
      break;
    }
  }
}

startGame();