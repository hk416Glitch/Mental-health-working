const backgrounds = [
  'bg-ocean-1.jpg',
  'bg-ocean-2.jpg',
  'bg-snow-2.jpg'
];

// Preload images
const preloadedImages = [];
backgrounds.forEach(src => {
  const img = new Image();
  img.src = src;
  preloadedImages.push(img);
});

let currentBg = 0;
function changeBackground() {
  document.body.style.backgroundImage = `url('${backgrounds[currentBg]}')`;
  currentBg = (currentBg + 1) % backgrounds.length;
}
setInterval(changeBackground, 8000);
changeBackground();

// Positive quotes
const quotes = [
  "You are stronger than you think.",
  "Take it one day at a time.",
  "Breathe. Everything will be okay.",
  "Your story isn't over yet."
];
document.getElementById("quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

// Sobriety tracker
let sobrietyStart = localStorage.getItem("sobrietyStart");
if (!sobrietyStart) {
  sobrietyStart = Date.now();
  localStorage.setItem("sobrietyStart", sobrietyStart);
}
function updateSobriety() {
  const days = Math.floor((Date.now() - sobrietyStart) / (1000 * 60 * 60 * 24));
  document.getElementById("sobriety-days").textContent = `${days} days`;
}
function resetSobriety() {
  sobrietyStart = Date.now();
  localStorage.setItem("sobrietyStart", sobrietyStart);
  updateSobriety();
}
updateSobriety();

// Sleep tracker
function saveSleep() {
  const sleep = document.getElementById("sleep-time").value;
  const wake = document.getElementById("wake-time").value;
  localStorage.setItem("sleep", sleep);
  localStorage.setItem("wake", wake);
  alert("Sleep schedule saved!");
}

// Fitness tracker
function saveWorkout() {
  const workout = document.getElementById("workout").value;
  localStorage.setItem("workout", workout);
  alert("Workout saved!");
}
