/* ---------- Backgrounds & home quote (random) ---------- */
const BG_IMAGES = ["bg-ocean-1.jpg","bg-ocean-2.jpg","bg-snow-2.jpg"];
let bgIndex = 0;
const bgLayer = document.getElementById("bg-layer");
const HOME_QUOTES = [
  "You are stronger than you think.",
  "This too shall pass.",
  "Take it one step at a time.",
  "Breathe in courage, breathe out fear.",
  "Every day is a second chance.",
  "You matter more than you know."
];

function showRandomHomeQuote(){
  const el = document.getElementById("homeQuote");
  el.textContent = HOME_QUOTES[Math.floor(Math.random()*HOME_QUOTES.length)];
}

/* fade change */
function setBackgroundImmediate(idx){
  bgLayer.style.opacity = 0;
  setTimeout(()=>{
    bgLayer.style.backgroundImage = `url('${BG_IMAGES[idx]}')`;
    bgLayer.style.opacity = 1;
  }, 450);
}
function cycleBackgrounds(){
  bgIndex = (bgIndex+1) % BG_IMAGES.length;
  setBackgroundImmediate(bgIndex);
}

/* start */
bgLayer.style.backgroundImage = `url('${BG_IMAGES[0]}')`;
setInterval(cycleBackgrounds, 8000);
showRandomHomeQuote();
setBackgroundImmediate(0);

/* ---------- localStorage helpers ---------- */
const Storage = {
  get(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

/* ---------- Sobriety tracker ---------- */
let sobrietyStart = Storage.get("sobrietyStart", null);

function updateSobrietyDisplay(){
  const el = document.getElementById("sobrietyDays");
  const startEl = document.getElementById("sobrietyStartDisplay");
  if(!sobrietyStart){ el.textContent = "Days sober: 0"; startEl.textContent = "not set"; return; }
  const days = Math.floor((Date.now() - new Date(sobrietyStart)) / (1000*60*60*24));
  el.textContent = `Days sober: ${days}`;
  startEl.textContent = new Date(sobrietyStart).toLocaleDateString();
}
function setSobrietyStartPrompt(){
  const d = prompt("Enter sobriety start date (YYYY-MM-DD) or leave blank for today");
  if(d === null) return;
  sobrietyStart = d.trim() ? new Date(d.trim()).toISOString() : new Date().toISOString();
  Storage.set("sobrietyStart", sobrietyStart);
  updateSobrietyDisplay();
}
function markSoberToday(){
  if(!sobrietyStart){
    sobrietyStart = new Date().toISOString();
    Storage.set("sobrietyStart", sobrietyStart);
  }
  // also add simple log of sober dates
  let log = Storage.get("sobrietyLog", []);
  const today = new Date().toLocaleDateString();
  if(!log.includes(today)){ log.push(today); Storage.set("sobrietyLog", log); }
  updateSobrietyDisplay();
}
function resetSobriety(){
  if(confirm("Reset sobriety start date to today?")){
    sobrietyStart = new Date().toISOString();
    Storage.set("sobrietyStart", sobrietyStart);
    updateSobrietyDisplay();
  }
}
updateSobrietyDisplay();

/* ---------- Sleep tracker ---------- */
let sleepData = Storage.get("sleepData", []);
function renderSleep(){
  const ul = document.getElementById("sleepList"); ul.innerHTML = "";
  sleepData.slice().reverse().forEach(e=>{
    const li = document.createElement("li");
    li.textContent = `${e.date}: ${e.hours} hrs`;
    ul.appendChild(li);
  });
}
function logSleep(){
  const date = document.getElementById("sleepDate").value || new Date().toLocaleDateString();
  const hours = parseFloat(document.getElementById("sleepHours").value);
  if(isNaN(hours)){ alert("Enter valid hours"); return; }
  sleepData.push({date, hours});
  Storage.set("sleepData", sleepData);
  renderSleep();
  document.getElementById("sleepHours").value = "";
}
function clearSleepData(){
  if(confirm("Clear all sleep history?")){ sleepData = []; Storage.set("sleepData", sleepData); renderSleep(); }
}
renderSleep();

/* ---------- Workout tracker (list + chart) ---------- */
let workoutData = Storage.get("workoutData", []);
const workoutListEl = document.getElementById("workoutList");
let workoutChart = null;
function renderWorkouts(){
  workoutListEl.innerHTML = "";
  workoutData.slice().reverse().forEach(w=>{
    const li = document.createElement("li");
    li.textContent = `${w.date}: ${w.minutes} min — ${w.type||"exercise"}`;
    workoutListEl.appendChild(li);
  });
  drawWorkoutChart();
}
function logWorkout(){
  const date = document.getElementById("workoutDate").value || new Date().toLocaleDateString();
  const minutes = parseInt(document.getElementById("workoutMinutes").value);
  const type = document.getElementById("workoutType").value || "";
  if(isNaN(minutes)){ alert("Enter minutes"); return; }
  workoutData.push({date, minutes, type});
  Storage.set("workoutData", workoutData);
  renderWorkouts();
  document.getElementById("workoutMinutes").value = "";
  document.getElementById("workoutType").value = "";
}
function clearWorkoutData(){
  if(confirm("Clear workout history?")){ workoutData=[]; Storage.set("workoutData", workoutData); renderWorkouts(); }
}
function drawWorkoutChart(){
  const ctx = document.getElementById("workoutChart").getContext("2d");
  const labels = workoutData.map((w,i)=>`#${i+1}`);
  const data = workoutData.map(w=>w.minutes);
  if(workoutChart) workoutChart.destroy();
  workoutChart = new Chart(ctx, {
    type: 'line',
    data:{ labels, datasets:[{ label:'Minutes', data, borderColor:'#6fbfbb', backgroundColor:'rgba(111,191,187,0.2)', fill:true }]},
    options:{ responsive:true, maintainAspectRatio:false }
  });
}
renderWorkouts();

/* ---------- Mood selector & mood-based quotes (separate list) ---------- */
const MOOD_QUOTES = {
  stressed: ["Try 4 deep breaths. 'You are doing the best you can.'", "Take a short break — you've earned it."],
  sad: ["It's okay to feel sad. 'Allow yourself small comforts today.'", "This feeling won't last forever."],
  anxious: ["Grounding: name 5 things you can see.", "Breathe slowly for 1 minute."],
  angry: ["Take space and breathe. 'Anger is valid — act gently.'", "Count to 10, then reassess."],
  calm: ["Keep noticing the calmness — you're doing well."],
  happy: ["Share your joy with someone today!", "Savor this moment."]
};
let moodHistory = Storage.get("moodHistory", []);
function getMoodSuggestion(){
  const mood = document.getElementById("moodSelect").value;
  const el = document.getElementById("moodSuggestion");
  if(!mood){ el.textContent = "Choose a mood to get a suggestion."; return; }
  const choices = MOOD_QUOTES[mood] || ["Take a few deep breaths."];
  el.textContent = choices[Math.floor(Math.random()*choices.length)];
}
function saveMoodEntry(){
  const mood = document.getElementById("moodSelect").value;
  if(!mood){ alert("Select a mood first."); return; }
  const note = document.getElementById("moodSuggestion").textContent || "";
  moodHistory.push({date: new Date().toLocaleDateString(), mood, note});
  Storage.set("moodHistory", moodHistory);
  renderMoodHistory();
}
function renderMoodHistory(){
  const ul = document.getElementById("moodHistory"); ul.innerHTML = "";
  moodHistory.slice().reverse().forEach(m=>{
    const li = document.createElement("li");
    li.textContent = `${m.date}: ${m.mood} — ${m.note}`;
    ul.appendChild(li);
  });
}
renderMoodHistory();

/* ---------- Full interactive calendar ---------- */
let calDate = new Date();
let calendarNotes = Storage.get("calendarNotes", {}); // key: YYYY-MM-DD -> note

function startCalendar(){
  renderCalendar();
}
function renderCalendar(){
  const grid = document.getElementById("calendar");
  grid.innerHTML = "";
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  document.getElementById("calendarMonthYear").textContent = first.toLocaleString('default',{month:'long', year:'numeric'});

  // weekday headers
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  weekDays.forEach(d=>{
    const h = document.createElement('div'); h.className = 'day-cell'; h.style.fontWeight='700'; h.style.opacity='0.8'; h.textContent=d; grid.appendChild(h);
  });

  // blank cells before first day
  const startDay = first.getDay();
  for(let i=0;i<startDay;i++){ const c=document.createElement('div'); c.className='day-cell'; grid.appendChild(c); }

  // days
  for(let d=1; d<=last.getDate(); d++){
    const dateKey = new Date(year,month,d).toISOString().slice(0,10);
    const cell = document.createElement('div');
    cell.className='day-cell';
    cell.dataset.date = dateKey;
    cell.innerHTML = `<div class="day-num">${d}</div>`;
    if(calendarNotes[dateKey]) {
      const tag = document.createElement('div'); tag.className='note-indicator'; tag.textContent='note'; cell.appendChild(tag);
    }
    cell.addEventListener('click',()=>openDayEditor(dateKey));
    grid.appendChild(cell);
  }
}

function prevMonth(){ calDate.setMonth(calDate.getMonth()-1); renderCalendar(); }
function nextMonth(){ calDate.setMonth(calDate.getMonth()+1); renderCalendar(); }
function gotoToday(){ calDate = new Date(); renderCalendar(); }

function openDayEditor(dateKey){
  document.getElementById('dayEditor').classList.remove('hidden');
  document.getElementById('dayEditorTitle').textContent = `Notes for ${dateKey}`;
  document.getElementById('dayNote').value = calendarNotes[dateKey] || '';
  document.getElementById('dayEditor').dataset.date = dateKey;
  renderDayNotesList(dateKey);
}

function closeDayEditor(){ document.getElementById('dayEditor').classList.add('hidden'); }
function saveDayNote(){
  const dateKey = document.getElementById('dayEditor').dataset.date;
  const txt = document.getElementById('dayNote').value.trim();
  if(txt){ calendarNotes[dateKey] = txt; } else { delete calendarNotes[dateKey]; }
  Storage.set("calendarNotes", calendarNotes);
  renderCalendar();
  renderDayNotesList(dateKey);
}
function deleteDayNote(){
  const dateKey = document.getElementById('dayEditor').dataset.date;
  if(confirm("Delete note for " + dateKey + "?")) {
    delete calendarNotes[dateKey];
    Storage.set("calendarNotes", calendarNotes);
    closeDayEditor();
    renderCalendar();
  }
}
function renderDayNotesList(dateKey){
  const wrap = document.getElementById('dayNotesList'); wrap.innerHTML = '';
  if(calendarNotes[dateKey]){
    const p = document.createElement('p'); p.textContent = calendarNotes[dateKey]; wrap.appendChild(p);
  } else {
    wrap.textContent = 'No notes for this day yet.';
  }
}

/* ---------- Init & helpers ---------- */
function scrollToSection(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }
showRandomHomeQuote();
startCalendar();
renderSleep();
renderWorkouts();
updateSobrietyDisplay();
renderMoodHistory();
