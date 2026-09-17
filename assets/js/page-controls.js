document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((button) => button.addEventListener("click", window.toggleKpzTheme));

document
    .querySelectorAll("[data-direction-toggle]")
    .forEach((button) => button.addEventListener("click", window.toggleKpzDirection));

window.syncKpzControls?.();
