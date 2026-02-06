const yesBtn = document.querySelector(".js-yes");
const noBtn = document.querySelector(".js-no");
const playArea = document.querySelector(".play-area");
const teaseLine = document.querySelector(".tease-line");
const reveal = document.querySelector(".teddy-reveal");
const revealClose = document.querySelector(".teddy-close");
const revealOverlay = document.querySelector(".teddy-overlay");

const funnyLines = [
  "Too slow. My heart is faster!",
  "Nice try, love ninja.",
  "I am a slippery yes today.",
  "Caught feelings, not the button.",
  "Still chasing? I like that.",
  "Almost! One more hug.",
];

let moveUntil = Date.now() + 30000;
let teaseTimer = null;

function setTeaseLine(text) {
  teaseLine.textContent = text;
  teaseLine.classList.add("show");
  clearTimeout(teaseTimer);
  teaseTimer = setTimeout(() => {
    teaseLine.classList.remove("show");
  }, 1800);
}

function randomPosition() {
  const areaRect = playArea.getBoundingClientRect();
  const btnRect = yesBtn.getBoundingClientRect();
  const padding = 16;
  const maxX = areaRect.width - btnRect.width - padding;
  const maxY = areaRect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  yesBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function maybeMove() {
  if (Date.now() < moveUntil) {
    randomPosition();
    const line = funnyLines[Math.floor(Math.random() * funnyLines.length)];
    setTeaseLine(line);
  }
}

function unlockYes() {
  yesBtn.classList.add("ready");
  yesBtn.style.transform = "translate(0, 0)";
  yesBtn.removeEventListener("mouseenter", maybeMove);
  yesBtn.removeEventListener("click", maybeMove);
  setTeaseLine("Okay, you win. Tap yes now.");
}

setTimeout(unlockYes, 30000);

yesBtn.addEventListener("mouseenter", maybeMove);
yesBtn.addEventListener("click", (event) => {
  if (Date.now() < moveUntil) {
    event.preventDefault();
    maybeMove();
    return;
  }

  reveal.classList.add("show");
  revealOverlay.classList.add("show");
});

noBtn.addEventListener("click", () => {
  setTeaseLine("No is not an option today. Try yes.");
});

revealClose.addEventListener("click", () => {
  reveal.classList.remove("show");
  revealOverlay.classList.remove("show");
});

revealOverlay.addEventListener("click", () => {
  reveal.classList.remove("show");
  revealOverlay.classList.remove("show");
});
