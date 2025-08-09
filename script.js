// Background fade
const backgrounds = ["bg-ocean-1.jpg", "bg-ocean-2.jpg", "bg-snow-2.jpg"];
let bgIndex = 0;
function changeBackground() {
    document.querySelector(".background").style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    bgIndex = (bgIndex + 1) % backgrounds.length;
}
setInterval(changeBackground, 5000);
changeBackground();

// Mood Quotes
const quotes = {
    happy: "Happiness is not something ready-made. It comes from your own actions.",
    sad: "This too shall pass. You are stronger than you think.",
    anxious: "Take a deep breath. You are safe and in control.",
    angry: "Peace begins with a smile.",
    motivated: "Push yourself, because no one else is going to do it for you."
};
document.getElementById("moodBtn").addEventListener("click", () => {
    const mood = document.getElementById("moodSelect").value;
    document.getElementById("quote").textContent = quotes[mood] || "Select a mood to get a quote.";
});

// Sobriety Tracker
const sobrietyDaysEl = document.getElementById("sobrietyDays");
document.getElementById("saveSobriety").addEventListener("click", () => {
    const startDate = document.getElementById("sobrietyStart").value;
    localStorage.setItem("sobrietyStart", startDate);
    updateSobriety();
});
function updateSobriety() {
    const startDate = localStorage.getItem("sobrietyStart");
    if (startDate) {
        const diff = Math.floor((new Date() - new Date(startDate)) / (1000*60*60*24));
        sobrietyDaysEl.textContent = `Days sober: ${diff}`;
    }
}
updateSobriety();

// Sleep Tracker
let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
const sleepChart = new Chart(document.getElementById("sleepChart"), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Sleep Hours', data: [], borderColor: 'lightblue', fill: false }] },
});
document.getElementById("saveSleep").addEventListener("click", () => {
    const hours = parseInt(document.getElementById("sleepHours").value);
    if (!isNaN(hours)) {
        sleepData.push(hours);
        if (sleepData.length > 7) sleepData.shift();
        localStorage.setItem("sleepData", JSON.stringify(sleepData));
        updateSleepChart();
    }
});
function updateSleepChart() {
    sleepChart.data.labels = sleepData.map((_, i) => `Day ${i+1}`);
    sleepChart.data.datasets[0].data = sleepData;
    sleepChart.update();
}
updateSleepChart();

// Fitness Tracker
let fitnessData = JSON.parse(localStorage.getItem("fitnessData")) || [];
const fitnessChart = new Chart(document.getElementById("fitnessChart"), {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Minutes Exercised', data: [], backgroundColor: 'lightgreen' }] },
});
document.getElementById("saveFitness").addEventListener("click", () => {
    const minutes = parseInt(document.getElementById("fitnessMinutes").value);
    if (!isNaN(minutes)) {
        fitnessData.push(minutes);
        if (fitnessData.length > 7) fitnessData.shift();
        localStorage.setItem("fitnessData", JSON.stringify(fitnessData));
        updateFitnessChart();
    }
});
function updateFitnessChart() {
    fitnessChart.data.labels = fitnessData.map((_, i) => `Day ${i+1}`);
    fitnessChart.data.datasets[0].data = fitnessData;
    fitnessChart.update();
}
updateFitnessChart();

// Calendar
let calendarEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
document.getElementById("saveCalendar").addEventListener("click", () => {
    const date = document.getElementById("calendarDate").value;
    const note = document.getElementById("calendarNote").value;
    if (date && note) {
        calendarEvents.push({ date, note });
        localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
        updateCalendar();
    }
});
function updateCalendar() {
    const list = document.getElementById("calendarList");
    list.innerHTML = "";
    calendarEvents.forEach(event => {
        const li = document.createElement("li");
        li.textContent = `${event.date}: ${event.note}`;
        list.appendChild(li);
    });
}
updateCalendar();
