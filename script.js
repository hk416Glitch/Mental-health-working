const backgrounds = ["bg-ocean-1.jpg", "bg-ocean-2.jpg", "bg-snow-2.jpg"];
const quotes = [
    "You are stronger than you think.",
    "This too shall pass.",
    "Take it one step at a time.",
    "Breathe in courage, breathe out fear.",
    "Every day is a second chance.",
    "You matter more than you know."
];

let currentBg = 0;
const bgElement = document.getElementById("background");
const quoteElement = document.getElementById("quote");

// Show random quote
quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Background fade loop
function changeBackground() {
    currentBg = (currentBg + 1) % backgrounds.length;
    bgElement.style.opacity = 0;
    setTimeout(() => {
        bgElement.style.backgroundImage = `url(${backgrounds[currentBg]})`;
        bgElement.style.opacity = 1;
    }, 2000);
}

bgElement.style.backgroundImage = `url(${backgrounds[currentBg]})`;
setInterval(changeBackground, 8000);
