// Sterren aanmaken
const starsEl = document.getElementById('stars');
for (let i = 0; i < 120; i++) {
  const s = document.createElement('span');
  s.className = 'star';
  s.style.setProperty('--d',     (2 + Math.random() * 4) + 's');
  s.style.setProperty('--delay', (Math.random() * 5) + 's');
  s.style.left = Math.random() * 100 + '%';
  s.style.top  = Math.random() * 100 + '%';
  starsEl.appendChild(s);
}

// Menu openen/sluiten
const menuBtn     = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose   = document.getElementById('menuClose');
menuBtn.addEventListener('click',   () => menuOverlay.classList.add('open'));
menuClose.addEventListener('click', () => menuOverlay.classList.remove('open'));


// Event Bubbling voorbeeld

// Selecteer de elementen
const grandparent = document.getElementById("grandparent");
const parent = document.getElementById("parent");
const child = document.getElementById("child");

// Voeg click-events toe
grandparent.addEventListener("click", () => {
  console.log("Section (grandparent) werd geklikt");
});

parent.addEventListener("click", () => {
  console.log("Article (parent) werd geklikt");
});

child.addEventListener("click", () => {
  console.log("Button (child) werd geklikt");
});
