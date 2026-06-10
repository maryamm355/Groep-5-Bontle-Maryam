const KLEUREN  = ["rood", "blauw", "groen", "geel", "paars"];
const SNELHEID = 600; // ms per knop in de reeks

let reeks, spelerReeks, ronde, bezig;

function startGame() {
  reeks       = [];
  spelerReeks = [];
  ronde       = 0;
  bezig       = false;

  document.getElementById("score").textContent   = "Ronde: 0";
  document.getElementById("message").textContent = "";
  document.getElementById("start").textContent   = "Opnieuw";

  setKnoppen(false);
  volgendeRonde();
}

function volgendeRonde() {
  ronde++;
  spelerReeks = [];
  bezig       = true;

  document.getElementById("score").textContent   = "Ronde: " + ronde;
  document.getElementById("message").textContent = "Kijk goed...";

  // voeg random kleur toe aan reeks
  const willekeurig = KLEUREN[Math.floor(Math.random() * KLEUREN.length)];
  reeks.push(willekeurig);

  setKnoppen(false);
  speelReeks();
}

function speelReeks() {
  let i = 0;
  const interval = setInterval(() => {
    lichtOp(reeks[i]);
    i++;
    if (i >= reeks.length) {
      clearInterval(interval);
      setTimeout(() => {
        bezig = false;
        setKnoppen(true);
        document.getElementById("message").textContent = "Jouw beurt!";
      }, SNELHEID);
    }
  }, SNELHEID + 200);
}

function lichtOp(kleur) {
  const knop = document.getElementById(kleur);
  knop.classList.add("actief");
  setTimeout(() => knop.classList.remove("actief"), SNELHEID - 100);
}

function setKnoppen(aan) {
  KLEUREN.forEach(kleur => {
    const knop = document.getElementById(kleur);
    knop.disabled = !aan;
    if (!aan) knop.style.cursor = "default";
    else      knop.style.cursor = "pointer";
  });
}

function klikKnop(index) {
  if (bezig) return;

  const kleur = KLEUREN[index];
  lichtOp(kleur);
  spelerReeks.push(kleur);

  const i = spelerReeks.length - 1;

  // fout geraden
  if (spelerReeks[i] !== reeks[i]) {
    setKnoppen(false);
    bezig = true;
    document.getElementById("message").textContent = "Fout! Je haalde ronde " + ronde + " 😢";
    foutAnimatie();
    return;
  }

  // hele reeks goed
  if (spelerReeks.length === reeks.length) {
    setKnoppen(false);
    document.getElementById("message").textContent = "Goed! ✅";
    setTimeout(volgendeRonde, 1000);
  }
}

function foutAnimatie() {
  let flits = 0;
  const interval = setInterval(() => {
    KLEUREN.forEach(k => {
      const knop = document.getElementById(k);
      if (flits % 2 === 0) knop.classList.add("actief");
      else                  knop.classList.remove("actief");
    });
    flits++;
    if (flits > 5) {
      clearInterval(interval);
      KLEUREN.forEach(k => document.getElementById(k).classList.remove("actief"));
    }
  }, 200);
}

// klik events
KLEUREN.forEach((kleur, i) => {
  document.getElementById(kleur).addEventListener("click", () => klikKnop(i));
});