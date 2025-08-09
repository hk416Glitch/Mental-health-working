// Background images (existing + new rainy/cloud)
const backgrounds = [
    "bg-ocean-1.jpg",
    "bg-ocean-2.jpg",
    "bg-snow-2.jpg",
    "rain-1.jpg",
    "cloudy-forest.jpg" // replace with actual filename you saved
];

function setRandomBackground() {
    const randomImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundImage = `url('${randomImage}')`;
}

setRandomBackground();
setInterval(setRandomBackground, 15000); // change every 15s

// Mood quotes
const quotes = {
    happy: ["Keep shining, the world needs your light!", "Happiness is contagious—spread it!"],
    sad: ["This too shall pass.", "Your feelings are valid—take it one step at a time."],
    motivated: ["Push yourself, because no one else is going to do it for you.", "Dream it. Wish it. Do it."],
    anxious: ["Breathe in, breathe out. You are in control.", "Focus on what you can control right now."],
    calm: ["Peace comes from within.", "Relax, release, and let go."]
};

document.getElementById("get-quote").addEventListener("click", () => {
    const mood = document.getElementById("mood").value;
    const quoteDisplay = document.getElementById("quote-display");
    if (mood && quotes[mood]) {
        const randomQuote = quotes[mood][Math.floor(Math.random() * quotes[mood].length)];
        quoteDisplay.textContent = randomQuote;
    } else {
        quoteDisplay.textContent = "Please select a mood.";
    }
});

// Sobriety tracker
document.getElementById("sobriety-date").addEventListener("change", () => {
    const startDate = new Date(document.getElementById("sobriety-date").value);
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    localStorage.setItem("sobrietyStart", startDate);
    document.getElementById("sobriety-days").textContent = `You have been sober for ${days} days.`;
});

// Sleep log
document.getElementById("log-sleep").addEventListener("click", () => {
    const hours = document.getElementById("sleep-hours").value;
    if (hours) {
        const log = document.getElementById("sleep-log");
        const li = document.createElement("li");
        li.textContent = `${hours} hours`;
        log.appendChild(li);
        localStorage.setItem("sleepLog", log.innerHTML);
    }
});

// Fitness log
document.getElementById("log-fitness").addEventListener("click", () => {
    const activity = document.getElementById("fitness-activity").value;
    const minutes = document.getElementById("fitness-minutes").value;
    if (activity && minutes) {
        const log = document.getElementById("fitness-log");
        const li = document.createElement("li");
        li.textContent = `${activity} - ${minutes} mins`;
        log.appendChild(li);
        localStorage.setItem("fitnessLog", log.innerHTML);
    }
});

// Calendar log
document.getElementById("log-calendar").addEventListener("click", () => {
    const date = document.getElementById("calendar-date").value;
    const note = document.getElementById("calendar-note").value;
    if (date && note) {
        const log = document.getElementById("calendar-log");
        const li = document.createElement("li");
        li.textContent = `${date}: ${note}`;
        log.appendChild(li);
        localStorage.setItem("calendarLog", log.innerHTML);
    }
});
