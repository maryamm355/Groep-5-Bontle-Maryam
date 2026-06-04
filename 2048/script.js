// --- setup ---
const myElement = document.getElementById('mobilewrap');
const hammertime = new Hammer(myElement);
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammertime.on('swipeleft',  () => moveDirection(37));
hammertime.on('swiperight', () => moveDirection(39));
hammertime.on('swipeup',    () => moveDirection(38));
hammertime.on('swipedown',  () => moveDirection(40));

window.addEventListener('keydown', (e) => moveDirection(e.keyCode));

document.querySelector('.button').addEventListener('click', () => {
  restoreField();
  init();
});

// --- staat ---
let matrix, component, score, best;
best = 0;

// --- starten ---
restoreField();
init();

// --- functies ---
function restoreField() {
  score = 0;
  document.querySelector('.scorefield').textContent = score;

  matrix = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  component = [];

  const container  = document.getElementById('container');
  const oldTiles   = container.querySelector('.tiles');
  if (oldTiles) oldTiles.remove();

  const newTiles = document.createElement('section');
  newTiles.className = 'tiles';
  container.appendChild(newTiles);

  document.querySelector('.over').removeAttribute('hidden');
  document.querySelector('.over').style.visibility = 'hidden';
  document.querySelector('.over').style.opacity    = '0';
}

function random(min, max) {
  return Math.floor(Math.random() * max + min);
}

function twoOrFour() {
  return Math.random() * 10 > 5 ? 4 : 2;
}

function init() {
  let i = 0;
  while (i < 2) {
    const x = random(0, 4);
    const y = random(0, 4);
    if (matrix[x][y] === 0) {
      matrix[x][y] = twoOrFour();
      component.push({ x, y });
      updateTile(x, y);
      i++;
    }
  }
}

function updateTile(x, y) {
  const tiles = document.querySelector('.tiles');

  const old = tiles.querySelector(`.tile-${x}-${y}`);
  if (old) old.remove();

  const tile = document.createElement('article');
  tile.className = `tile tile-${matrix[x][y]} tile-${x}-${y}`;
  tile.style.transform = `translate(${12 * x}vh, ${12 * y}vh)`;

  const content = document.createElement('span');
  content.className = 'tile_content';

  const num = document.createElement('span');
  num.textContent = matrix[x][y];

  content.appendChild(num);
  tile.appendChild(content);
  tiles.appendChild(tile);
}

function moveDirection(code) {
  let change = 0;

  if (code === 37) {
    component.sort((a, b) => a.x - b.x);
    change = move(-1, 0);
  } else if (code === 39) {
    component.sort((a, b) => b.x - a.x);
    change = move(1, 0);
  } else if (code === 38) {
    component.sort((a, b) => a.y - b.y);
    change = move(0, -1);
  } else if (code === 40) {
    component.sort((a, b) => b.y - a.y);
    change = move(0, 1);
  }

  if (change > 0) addTile();
  if (checkDefeat()) showGameOver();
}

function move(dx, dy) {
  let change = 0;
  for (let i = 0; i < component.length; i++) {
    while (isMovePossible(component[i].x, component[i].y, dx, dy)) {
      makeMove(component[i].x, component[i].y, dx, dy, i);
      change++;
      if (component[i].x !== -1 && component[i].y !== -1) {
        component[i].x += dx;
        component[i].y += dy;
      }
    }
  }
  checkTrash();
  return change;
}

function makeMove(x, y, dx, dy, i) {
  const newX     = x + dx;
  const newY     = y + dy;
  const newValue = matrix[x][y] + matrix[newX][newY];

  if (matrix[newX][newY] === matrix[x][y]) {
    component[i] = { x: -1, y: -1 };
    score += newValue;
    document.querySelector('.scorefield').textContent = score;
    if (score > best) {
      best = score;
      document.querySelector('.numbest').textContent = best;
    }
  }

  matrix[newX][newY] = newValue;
  matrix[x][y]       = 0;

  updateTile(newX, newY);
  document.querySelector(`.tile-${x}-${y}`)?.remove();

  if (newValue === 2048) showWon();
}

function addTile() {
  let i = 0;
  while (i < 1) {
    const x = random(0, 4);
    const y = random(0, 4);
    if (matrix[x][y] === 0) {
      matrix[x][y] = twoOrFour();
      component.push({ x, y });
      updateTile(x, y);
      i++;
    }
  }
}

function checkTrash() {
  component = component.filter(c => c.x !== -1 && c.y !== -1);
}

function isMovePossible(x, y, dx, dy) {
  const newX = x + dx;
  const newY = y + dy;
  if (newX < 0 || newX >= 4 || newY < 0 || newY >= 4) return false;
  return matrix[newX][newY] === 0 || matrix[newX][newY] === matrix[x][y];
}

function checkDefeat() {
  if (component.length < 16) return false;
  for (const c of component) {
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      if (isMovePossible(c.x, c.y, dx, dy)) return false;
    }
  }
  return true;
}

function showGameOver() {
  const over = document.querySelector('.over');
  over.style.visibility = 'visible';
  over.style.opacity    = '1';
}

function showWon() {
  const won = document.querySelector('.won');
  won.style.visibility = 'visible';
  won.style.paddingTop = '0px';
  won.style.opacity    = '1';
}