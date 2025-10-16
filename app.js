const defaultReminders = [
    { time: "08:20", message: "A Claro Pay" },
    { time: "12:00", message: "En Ualá / Fima (tope 1.500.000)" },
    { time: "13:15", message: "A Personal Pay" },
    { time: "14:35", message: "A Ualá FCI" },
    { time: "16:45", message: "A Mercado Pago" },
    { time: "18:45", message: "A Cenco Pay" },
    { time: "22:30", message: "A Ualá" }
];

const form = document.getElementById("reminder-form");
const remindersList = document.getElementById("reminders");

let reminders = JSON.parse(localStorage.getItem("reminders")) || defaultReminders;
localStorage.setItem("reminders", JSON.stringify(reminders));

Notification.requestPermission();
navigator.serviceWorker.register("service-worker.js");

function render() {
    remindersList.innerHTML = reminders.map(r => `<li>${r.time} - ${r.message}</li>`).join("");
}
render();

form.addEventListener("submit", e => {
    e.preventDefault();
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value;
    reminders.push({ time, message });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    render();
    form.reset();
});

// Only run notifications Monday–Friday
function isWeekday() {
    const day = new Date().getDay(); // 0=Sunday, 6=Saturday
    return day >= 1 && day <= 5;
}

async function triggerNotification(reminder) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        registration.showNotification("⏰ Ruleta", {
            body: reminder.message,
            icon: "icon-192.png",
            badge: "icon-192.png"
        });
    }
}

let lastTriggered = {};

// Reset daily at midnight
function resetDaily() {
    const now = new Date();
    const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(() => {
        lastTriggered = {};
        resetDaily();
    }, msUntilMidnight);
}
resetDaily();

function checkReminders() {
    if (!isWeekday()) return;
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    reminders.forEach(r => {
        if (r.time === currentTime && !lastTriggered[r.time]) {
            lastTriggered[r.time] = true;
            triggerNotification(r);
        }
    });
}

// check every 30 seconds
setInterval(checkReminders, 30000);
