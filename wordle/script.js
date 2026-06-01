const WORDS = [
  "PLANT", "KAART", "TREIN", "WATER", "BROOD",
  "STOEL", "TAFEL", "KLEUR", "ZWART", "GROEN",
  "BLAUW", "VLIEG", "APPEL", "WORST", "FIETS",
  "FIETS", "BOEK",  "DROOM", "VRIEND","VOGEL",
  "MUZIEK","SPORT", "LICHT", "NACHT", "STORM",
  "BLOEM", "REGEN", "SNEEUW","ZOMER", "HERFST"
];

const ROWS = 6;
const COLS = 5;
const secret = WORDS[Math.floor(Math.random() * WORDS.length)];

let current = { row: 0, col: 0 };
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(""));

const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"]
];

function buildGrid() {
  const container = document.getElementById("grid");
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement("article");
    row.className = "row";
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("span");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
}

function buildKeyboard() {
  const kb = document.getElementById("keyboard");
  KB_ROWS.forEach(keys => {
    const row = document.createElement("nav");
    row.className = "kb-row";
    keys.forEach(k => {
      const btn = document.createElement("button");
      btn.className = "kb-key";
      btn.id = `key-${k}`;
      btn.textContent = k;
      if (k === "ENTER" || k === "⌫") btn.style.minWidth = "52px";
      btn.addEventListener("click", () => handleKey(k));
      row.appendChild(btn);
    });
    kb.appendChild(row);
  });
}

function checkGuess(guess) {
  const result = Array(COLS).fill("absent");
  const secretArr = secret.split("");

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === secretArr[i]) {
      result[i] = "correct";
      secretArr[i] = null;
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (result[i] === "correct") continue;
    const j = secretArr.indexOf(guess[i]);
    if (j !== -1) {
      result[i] = "present";
      secretArr[j] = null;
    }
  }

  return result;
}

function updateKeyboard(letter, state) {
  const btn = document.getElementById(`key-${letter}`);
  if (!btn) return;
  const priority = { correct: 2, present: 1, absent: 0 };
  const current = [...btn.classList].find(c => priority[c] !== undefined);
  if (!current || priority[state] > priority[current]) {
    btn.classList.remove(current);
    btn.classList.add(state);
  }
}

function handleKey(key) {
  if (key === "⌫") {
    if (current.col > 0) {
      current.col--;
      grid[current.row][current.col] = "";
      document.getElementById(`cell-${current.row}-${current.col}`).textContent = "";
    }
    return;
  }

  if (key === "ENTER") {
    if (current.col < COLS) return;
    const guess = grid[current.row].join("");
    const result = checkGuess(guess);

    result.forEach((state, i) => {
      document.getElementById(`cell-${current.row}-${i}`).classList.add(state);
      updateKeyboard(guess[i], state);
    });

    if (guess === secret) {
      document.getElementById("message").textContent = "Goed gedaan! 🎉";
      return;
    }

    current.row++;
    current.col = 0;

    if (current.row >= ROWS) {
      document.getElementById("message").textContent = "Het woord was: " + secret;
    }
    return;
  }

  if (/^[A-Z]$/.test(key) && current.col < COLS) {
    grid[current.row][current.col] = key;
    document.getElementById(`cell-${current.row}-${current.col}`).textContent = key;
    current.col++;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace")       handleKey("⌫");
  else if (e.key === "Enter")      handleKey("ENTER");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

buildGrid();
buildKeyboard();