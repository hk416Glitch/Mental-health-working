const backgrounds = [
    "images/bg1.jpg",
    "images/bg2.jpg",
    "images/bg3.jpg"
];
let bgIndex = 0;

function changeBackground() {
    bgIndex = (bgIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
}
setInterval(changeBackground, 5000);

// Sobriety tracker
function updateSobriety() {
    const date = document.getElementById('sobrietyDate').value;
    if (date) {
        const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
        document.getElementById('sobrietyResult').innerText = `You have been sober for ${days} days.`;
    }
}

// Sleep tracker
function updateSleep() {
    const hours = document.getElementById('sleepHours').value;
    document.getElementById('sleepResult').innerText = `You slept ${hours} hours last night.`;
}

// Workout tracker
let workoutData = [];
function updateWorkout() {
    const minutes = parseInt(document.getElementById('workoutMinutes').value);
    if (!isNaN(minutes)) {
        workoutData.push(minutes);
        drawWorkoutChart();
    }
}

function drawWorkoutChart() {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: workoutData.map((_, i) => `Day ${i+1}`),
            datasets: [{
                label: 'Workout Minutes',
                data: workoutData
            }]
        }
    });
}
