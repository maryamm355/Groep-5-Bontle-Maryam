const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

const GRID = 20;
const COLS = canvas.width  / GRID;
const ROWS = canvas.height / GRID;

let snake, direction, nextDirection, apple, score, gameLoop;
let slangHoofd = "#1b5e20";
let slangLijf  = "#2e7d32";
let gestart    = false;

function setKleur(hoofd, lijf) {
  slangHoofd = hoofd;
  slangLijf  = lijf;
  document.querySelectorAll(".kleur-btn").forEach(b => b.classList.remove("actief"));
  event.target.classList.add("actief");
  draw();
}

function startGame() {
  snake         = [{ x: 10, y: 10 }];
  direction     = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score         = 0;
  gestart       = false;

  document.getElementById("score").textContent = "Score: 0";

  placeApple();
  clearInterval(gameLoop);
  draw();
  toonOverlay("Druk op een pijltjestoets\nom te starten", "");
}

function toonOverlay(tekst, knopTekst) {
  ctx.fillStyle = "rgba(109, 40, 109, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 18px Montserrat";
  ctx.textAlign = "center";

  const regels = tekst.split("\n");
  regels.forEach((regel, i) => {
    ctx.fillText(regel, canvas.width / 2, canvas.height / 2 - 20 + i * 30);
  });

  if (knopTekst) {
    ctx.fillStyle = "#CFD8DC";
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 70, canvas.height / 2 + 30, 140, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#455A64";
    ctx.font = "14px Montserrat";
    ctx.fillText(knopTekst, canvas.width / 2, canvas.height / 2 + 55);
  }
}

function placeApple() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  apple = pos;
}

function update() {
  direction = { ...nextDirection };

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }

  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  // grid
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#4a7c3f" : "#3d6b34";
      ctx.fillRect(x * GRID, y * GRID, GRID, GRID);
    }
  }

  // appel
  const ax = apple.x * GRID + GRID / 2;
  const ay = apple.y * GRID + GRID / 2;
  const r  = GRID / 2 - 2;

  ctx.fillStyle = "#c62828";
  ctx.beginPath();
  ctx.arc(ax, ay, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e53935";
  ctx.beginPath();
  ctx.arc(ax - 2, ay - 2, r - 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay - r);
  ctx.lineTo(ax + 3, ay - r - 4);
  ctx.stroke();

  // slang
  snake.forEach((segment, i) => {
    const x   = segment.x * GRID;
    const y   = segment.y * GRID;
    const pad = 1;

    if (i === 0) {
      ctx.fillStyle = slangHoofd;
      roundRect(x + pad, y + pad, GRID - pad * 2, GRID - pad * 2, 5);

      let oog1, oog2;
      if      (direction.x === 1)  { oog1 = {x: x+14, y: y+5};  oog2 = {x: x+14, y: y+13}; }
      else if (direction.x === -1) { oog1 = {x: x+4,  y: y+5};  oog2 = {x: x+4,  y: y+13}; }
      else if (direction.y === -1) { oog1 = {x: x+5,  y: y+4};  oog2 = {x: x+13, y: y+4};  }
      else                         { oog1 = {x: x+5,  y: y+14}; oog2 = {x: x+13, y: y+14}; }

      [oog1, oog2].forEach(oog => {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(oog.x, oog.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(oog.x + 0.5, oog.y + 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

    } else {
      const groen = Math.min(180, 100 + i * 3);
      ctx.fillStyle = slangLijf;
      ctx.globalAlpha = Math.max(0.4, 1 - i * 0.03);
      roundRect(x + pad, y + pad, GRID - pad * 2, GRID - pad * 2, 4);
      ctx.globalAlpha = 1;
    }
  });
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function endGame() {
  clearInterval(gameLoop);
  draw();
  toonOverlay("Game over!\nScore: " + score, "Opnieuw spelen");
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  const cx   = canvas.width  / 2;
  const cy   = canvas.height / 2;

  if (!gestart) return;
  if (mx > cx - 70 && mx < cx + 70 && my > cy + 30 && my < cy + 70) {
    startGame();
  }
});

document.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  if (!gestart) {
    gestart = true;
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 120);
  }

  if (e.key === "ArrowUp"    && direction.y === 0) nextDirection = { x: 0,  y: -1 };
  if (e.key === "ArrowDown"  && direction.y === 0) nextDirection = { x: 0,  y:  1 };
  if (e.key === "ArrowLeft"  && direction.x === 0) nextDirection = { x: -1, y:  0 };
  if (e.key === "ArrowRight" && direction.x === 0) nextDirection = { x:  1, y:  0 };
});

startGame();