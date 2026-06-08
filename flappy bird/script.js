const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// --- kleuren ---
const LUCHT_BOVEN = "#87CEEB";
const LUCHT_ONDER = "#b8e4f7";
const GROND_KLEUR = "#8B6914";
const GRAS_KLEUR  = "#5d8a3c";
const PIJP_KLEUR  = "#3ea832";
const PIJP_RAND   = "#2d7a24";

const GROND_H  = 80;
const SPEEL_H  = H - GROND_H;

// --- vogel ---
const VOGEL_X  = 80;
const VOGEL_R  = 18;

// --- pijpen ---
const PIJP_B        = 60;
const PIJP_GAT      = 200;
const PIJP_SNELHEID = 1.8;

// --- physics ---
const ZWAARTEKRACHT = 0.25;
const FLAP_KRACHT   = -7;

let vogel, pijpen, score, highscore, gameState, animFrame;
highscore = 0;

let wolken = [
  { x: 80,  y: 60,  r: 25 },
  { x: 200, y: 40,  r: 20 },
  { x: 320, y: 80,  r: 30 },
  { x: 150, y: 120, r: 18 },
];

function startGame() {
  vogel = {
    y:       SPEEL_H / 2,
    vy:      0,
    hoek:    0,
    vleugel: 0
  };
  pijpen    = [];
  score     = 0;
  gameState = "wacht";
  cancelAnimationFrame(animFrame);
  gameLoop();
}

function flap() {
  if (gameState === "dood") {
    startGame();
    return;
  }
  if (gameState === "wacht") gameState = "speel";
  vogel.vy      = FLAP_KRACHT;
  vogel.vleugel = 1;
}

document.addEventListener("keydown",   (e) => { if (e.code === "Space") { e.preventDefault(); flap(); } });
document.addEventListener("touchstart", (e) => { e.preventDefault(); flap(); });
canvas.addEventListener("click", flap);

function update() {
  if (gameState !== "speel") return;

  vogel.vy    += ZWAARTEKRACHT;
  vogel.y     += vogel.vy;
  vogel.hoek   = Math.min(Math.PI / 2, vogel.vy * 0.08);
  vogel.vleugel = Math.max(0, vogel.vleugel - 0.15);

  wolken.forEach(w => {
    w.x -= 0.4;
    if (w.x < -50) w.x = W + 50;
  });

  if (pijpen.length === 0 || pijpen[pijpen.length - 1].x < W - 280) {
    const top = 60 + Math.random() * (SPEEL_H - PIJP_GAT - 80);
    pijpen.push({ x: W, top, geteld: false });
  }

  pijpen.forEach(p => p.x -= PIJP_SNELHEID);
  pijpen = pijpen.filter(p => p.x > -PIJP_B - 10);

  pijpen.forEach(p => {
    if (!p.geteld && p.x + PIJP_B < VOGEL_X) {
      p.geteld = true;
      score++;
      if (score > highscore) highscore = score;
    }
  });

  if (vogel.y + VOGEL_R >= SPEEL_H || vogel.y - VOGEL_R <= 0) {
    gameState = "dood";
  }

  pijpen.forEach(p => {
    if (
      VOGEL_X + VOGEL_R - 5 > p.x &&
      VOGEL_X - VOGEL_R + 5 < p.x + PIJP_B &&
      (vogel.y - VOGEL_R + 5 < p.top || vogel.y + VOGEL_R - 5 > p.top + PIJP_GAT)
    ) {
      gameState = "dood";
    }
  });
}

function draw() {
  const lucht = ctx.createLinearGradient(0, 0, 0, SPEEL_H);
  lucht.addColorStop(0, LUCHT_BOVEN);
  lucht.addColorStop(1, LUCHT_ONDER);
  ctx.fillStyle = lucht;
  ctx.fillRect(0, 0, W, SPEEL_H);

  wolken.forEach(w => {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(w.x,      w.y,      w.r,       0, Math.PI * 2);
    ctx.arc(w.x + 20, w.y - 8,  w.r * 0.7, 0, Math.PI * 2);
    ctx.arc(w.x - 18, w.y - 4,  w.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  pijpen.forEach(p => {
    tekenPijp(p.x, 0,                  PIJP_B, p.top,                          true);
    tekenPijp(p.x, p.top + PIJP_GAT,  PIJP_B, SPEEL_H - p.top - PIJP_GAT,   false);
  });

  ctx.fillStyle = GROND_KLEUR;
  ctx.fillRect(0, SPEEL_H, W, GROND_H);
  ctx.fillStyle = GRAS_KLEUR;
  ctx.fillRect(0, SPEEL_H, W, 12);
  ctx.fillStyle = "#6b4f10";
  for (let x = 0; x < W; x += 30) {
    ctx.fillRect(x, SPEEL_H + 12, 20, 6);
  }

  ctx.save();
  ctx.translate(VOGEL_X, vogel.y);
  ctx.rotate(vogel.hoek);

  ctx.fillStyle = "#f7c948";
  ctx.beginPath();
  ctx.ellipse(0, 0, VOGEL_R, VOGEL_R - 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const vleugel_y = vogel.vleugel > 0.5 ? -6 : 4;
  ctx.fillStyle = "#e6b800";
  ctx.beginPath();
  ctx.ellipse(-6, vleugel_y, 10, 6, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fde99a";
  ctx.beginPath();
  ctx.ellipse(4, 4, 10, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(8, -5, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(10, -5, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(11, -6, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f4830a";
  ctx.beginPath();
  ctx.moveTo(14, -1);
  ctx.lineTo(22,  2);
  ctx.lineTo(14,  5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  ctx.fillStyle   = "white";
  ctx.font        = "bold 28px Montserrat";
  ctx.textAlign   = "center";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur  = 4;
  ctx.fillText(score, W / 2, 50);
  ctx.shadowBlur  = 0;

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font      = "14px Montserrat";
  ctx.fillText("Best: " + highscore, W / 2, 75);

  if (gameState === "wacht") {
    toonOverlay("Klik of druk SPATIE\nom te beginnen", false);
  }

  if (gameState === "dood") {
    toonOverlay("Game Over!\nScore: " + score + "\n\nKlik om opnieuw te spelen", true);
  }
}

function tekenPijp(x, y, breedte, hoogte, omgekeerd) {
  const rand = 6;

  ctx.fillStyle = PIJP_KLEUR;
  ctx.fillRect(x + rand, y, breedte - rand * 2, hoogte);

  ctx.fillStyle = PIJP_RAND;
  if (omgekeerd) {
    ctx.fillRect(x, y + hoogte - 28, breedte, 28);
    ctx.fillStyle = "#5dc44f";
    ctx.fillRect(x + 4, y + hoogte - 26, 8, 22);
  } else {
    ctx.fillRect(x, y, breedte, 28);
    ctx.fillStyle = "#5dc44f";
    ctx.fillRect(x + 4, y + 4, 8, 22);
  }

  ctx.fillStyle = "#1f5c17";
  ctx.fillRect(x + breedte - rand, y, rand, hoogte);
}

function toonOverlay(tekst, isGameOver) {
  ctx.fillStyle = "rgba(109, 40, 109, 0.82)";
  roundRect(ctx, W / 2 - 150, H / 2 - 80, 300, 160, 12);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  const regels = tekst.split("\n");
  const startY = H / 2 - 30;
  regels.forEach((regel, i) => {
    ctx.font = i === 0 && isGameOver ? "bold 22px Montserrat" : "16px Montserrat";
    ctx.fillText(regel, W / 2, startY + i * 26);
  });
}

function roundRect(ctx, x, y, w, h, r) {
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

function gameLoop() {
  update();
  draw();
  animFrame = requestAnimationFrame(gameLoop);
}

startGame();