const page = document.body.dataset.page || "";

window.syncKpzControls?.();
window.enhanceKpzSelects?.();

document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((button) => button.addEventListener("click", window.toggleKpzTheme));
document
    .querySelectorAll("[data-direction-toggle]")
    .forEach((button) => button.addEventListener("click", window.toggleKpzDirection));
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("[data-dropdown-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
        const dropdown = event.currentTarget.closest("[data-dropdown]");
        document.querySelectorAll("[data-dropdown].open").forEach((item) => {
            if (item !== dropdown) item.classList.remove("open");
        });
        const open = dropdown.classList.toggle("open");
        event.currentTarget.setAttribute("aria-expanded", String(open));
    });
});
const activeRoutes = {
    about: "about.html",
    zones: "play-zones.html",
    birthday: "birthday-parties.html",
    membership: "membership.html",
    safety: "safety.html",
    contact: "contact.html",
};
if (page === "home" || page === "home-2") {
    document.querySelector("[data-dropdown]")?.classList.add("active");
    const activeHome = page === "home" ? "index.html" : "home-2.html";
    const activeHomeLink = document.querySelector(`.dropdown-menu a[href$="${activeHome}"]`);
    activeHomeLink?.classList.add("active");
    activeHomeLink?.setAttribute("aria-current", "page");
} else if (activeRoutes[page]) {
    const activeLink = document.querySelector(`.nav a[href$="${activeRoutes[page]}"]`);
    activeLink?.classList.add("active");
    activeLink?.setAttribute("aria-current", "page");
}
document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("open");
            dropdown
                .querySelector("[data-dropdown-toggle]")
                ?.setAttribute("aria-expanded", "false");
        }
    });
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document
            .querySelectorAll("[data-dropdown]")
            .forEach((dropdown) => dropdown.classList.remove("open"));
    }
});
window.addEventListener("scroll", () =>
    document.querySelector("[data-header]")?.classList.toggle("scrolled", scrollY > 10),
);
document.querySelectorAll(".accordion-button").forEach((button) =>
    button.addEventListener("click", () => {
        const item = button.closest(".accordion-item");
        const open = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
    }),
);
document.querySelectorAll("[data-age-finder] button").forEach((button) =>
    button.addEventListener("click", () => {
        button.parentElement
            .querySelectorAll("button")
            .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const result = document.querySelector("[data-age-result]");
        result.innerHTML = `<strong>Recommended: ${button.dataset.zone}</strong>`;
        const details = document.querySelector("[data-age-details]");
        details.innerHTML = `<p>${button.dataset.zone} offers the right balance of movement, confidence-building and supervised discovery for this age.</p><ul><li>Age-matched equipment</li><li>Comfortable session pacing</li><li>Trained team nearby</li></ul>`;
    }),
);
const ageResult = document.querySelector("[data-age-result]");
if (ageResult) {
    ageResult.insertAdjacentHTML(
        "afterend",
        '<div class="age-recommendation-details" data-age-details><p>Choose an age above and we’ll match your child with a zone designed for their stage.</p><ul><li>Safe age-based challenges</li><li>Clear session availability</li><li>Easy online booking</li></ul></div>',
    );
}
document.querySelectorAll("[data-filters] button").forEach((button) =>
    button.addEventListener("click", () => {
        button.parentElement
            .querySelectorAll("button")
            .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        document.querySelectorAll("[data-filter-grid] [data-age]").forEach((item) => {
            item.hidden =
                button.dataset.filter !== "all" && item.dataset.age !== button.dataset.filter;
        });
    }),
);
document.querySelectorAll("[data-demo-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "parent-dashboard.html#book";
    }),
);
