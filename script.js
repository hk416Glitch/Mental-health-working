function showSection(sectionId) {
  document.querySelectorAll('main section').forEach(sec => {
    sec.classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW registration failed", err));
}