const yesBtn = document.querySelector(".js-yes");
const noBtn = document.querySelector(".js-no");
const playArea = document.querySelector(".play-area");
const teaseLine = document.querySelector(".tease-line");
const typingTarget = document.querySelector(".typing");

const noMessages = [
  "please love me",
  "please no",
  "that could be a mistake",
  "please think about me",
];

const yesMessages = [
  "Yes is shy today.",
  "You are the cutest yes.",
  "Say yes, my sunshine.",
  "My heart is cheering yes.",
];

let remainingMs = 15000;
let activeStart = null;
let teaseTimer = null;
let unlockTimer = null;
let unlocked = false;

function setTeaseLine(text, x, y) {
  teaseLine.textContent = text;
  teaseLine.classList.add("show");
  if (typeof x === "number" && typeof y === "number") {
    teaseLine.style.left = `${x}px`;
    teaseLine.style.top = `${y}px`;
    teaseLine.style.transform = "translate(-50%, -6px)";
  }
  clearTimeout(teaseTimer);
  teaseTimer = setTimeout(() => {
    teaseLine.classList.remove("show");
  }, 1800);
}

function randomPosition(button) {
  const padding = 12;
  const areaWidth = playArea.clientWidth;
  const areaHeight = playArea.clientHeight;
  const btnWidth = button.offsetWidth;
  const btnHeight = button.offsetHeight;

  const maxX = Math.max(padding, areaWidth - btnWidth - padding);
  const maxY = Math.max(padding, areaHeight - btnHeight - padding);
  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

function maybeMove(event) {
  if (!unlocked) {
    const target = event?.currentTarget;
    if (!target) return;
    randomPosition(target);
    const lines = target.classList.contains("js-no") ? noMessages : yesMessages;
    const line = lines[Math.floor(Math.random() * lines.length)];
    const areaRect = playArea.getBoundingClientRect();
    const x = event ? event.clientX - areaRect.left : areaRect.width / 2;
    const y = event ? event.clientY - areaRect.top : areaRect.height / 2;
    setTeaseLine(line, x, y);
  }
}

function unlockPlay() {
  unlocked = true;
  noBtn.classList.add("ready");
  yesBtn.classList.add("ready");
  noBtn.style.left = "70%";
  noBtn.style.top = "32px";
  yesBtn.style.left = "30%";
  yesBtn.style.top = "32px";
  noBtn.removeEventListener("mouseenter", maybeMove);
  noBtn.removeEventListener("click", maybeMove);
  yesBtn.removeEventListener("mouseenter", maybeMove);
  yesBtn.removeEventListener("click", maybeMove);
  setTeaseLine("Okay, you win. Tap yes or no now.", playArea.clientWidth / 2, 120);
}

function tickTimer() {
  if (!activeStart) return;
  const now = Date.now();
  const elapsed = now - activeStart;
  activeStart = now;
  remainingMs = Math.max(0, remainingMs - elapsed);

  if (remainingMs === 0 && !unlocked) {
    unlockPlay();
    clearInterval(unlockTimer);
  }
}

function startTimer() {
  if (unlocked || activeStart) return;
  activeStart = Date.now();
  unlockTimer = unlockTimer || setInterval(tickTimer, 120);
}

function pauseTimer() {
  if (!activeStart) return;
  tickTimer();
  activeStart = null;
}

noBtn.addEventListener("mouseenter", maybeMove);
yesBtn.addEventListener("mouseenter", maybeMove);
noBtn.addEventListener("click", (event) => {
  if (!unlocked) {
    event.preventDefault();
    maybeMove(event);
    return;
  }

  navigateWithFade("no.html");
});

yesBtn.addEventListener("click", () => {
  if (!unlocked) {
    maybeMove({ currentTarget: yesBtn, clientX: 0, clientY: 0 });
    return;
  }
  navigateWithFade("yes.html");
});

playArea.addEventListener("mouseenter", startTimer);
playArea.addEventListener("mouseleave", pauseTimer);

function typeText() {
  if (!typingTarget) return;
  const text = typingTarget.dataset.text || "";
  let i = 0;
  const speed = 55;
  const timer = setInterval(() => {
    typingTarget.textContent = text.slice(0, i);
    i += 1;
    if (i > text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function navigateWithFade(url) {
  window.location.href = url;
}

typeText();
