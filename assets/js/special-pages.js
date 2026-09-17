document.querySelector("[data-theme-toggle]")?.addEventListener("click", window.toggleKpzTheme);
document
    .querySelector("[data-direction-toggle]")
    ?.addEventListener("click", window.toggleKpzDirection);
window.syncKpzControls?.();

const launchDate = new Date("2026-12-01T10:00:00");
const countdown = document.querySelector("[data-countdown]");

const updateCountdown = () => {
    if (!countdown) return;
    const distance = Math.max(0, launchDate.getTime() - Date.now());
    const values = {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
    };
    Object.entries(values).forEach(([key, value]) => {
        const output = document.querySelector(`[data-${key}]`);
        if (output) output.textContent = String(value).padStart(2, "0");
    });
    if (distance === 0)
        countdown.innerHTML = '<p class="form-status">The new experience is ready!</p>';
};

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelector(".notify-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = '<p class="form-status">You’re on the list. See you soon!</p>';
});
