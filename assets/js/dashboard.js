(() => {
    const side = document.querySelector("[data-sidebar]"),
        back = document.querySelector("[data-sidebar-backdrop]"),
        menu = document.querySelector("[data-dashboard-menu]");
    let lastFocus = null;
    const closeSide = () => {
        side?.classList.remove("open");
        back?.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
    };
    menu?.addEventListener("click", () => {
        const open = !side.classList.contains("open");
        side.classList.toggle("open", open);
        back?.classList.toggle("open", open);
        menu.setAttribute("aria-expanded", String(open));
        if (open) side.querySelector("a")?.focus();
    });
    back?.addEventListener("click", closeSide);
    window.syncKpzControls?.();
    document
        .querySelectorAll("[data-theme-toggle]")
        .forEach((b) => b.addEventListener("click", window.toggleKpzTheme));
    document
        .querySelectorAll("[data-direction-toggle]")
        .forEach((b) => b.addEventListener("click", window.toggleKpzDirection));
    const closeDrops = (except) =>
        document.querySelectorAll("[data-dropdown]").forEach((x) => {
            if (x !== except) x.hidden = true;
        });
    document.querySelectorAll("[data-dropdown-trigger]").forEach((t) =>
        t.addEventListener("click", (e) => {
            e.stopPropagation();
            const d = document.querySelector(`[data-dropdown="${t.dataset.dropdownTrigger}"]`),
                open = d.hidden;
            closeDrops(d);
            d.hidden = !open;
            t.setAttribute("aria-expanded", String(open));
        }),
    );
    document.addEventListener("click", () => closeDrops());
    document
        .querySelectorAll("[data-dropdown]")
        .forEach((d) => d.addEventListener("click", (e) => e.stopPropagation()));
    document.querySelectorAll("[data-mark-read]").forEach((b) =>
        b.addEventListener("click", () => {
            document.querySelectorAll(".notification-count,.notice-dot").forEach((x) => x.remove());
            b.textContent = "All read";
        }),
    );
    const views = [...document.querySelectorAll("[data-dashboard-view]")];
    const showView = (name, hash = true) => {
        const target = views.find((v) => v.dataset.dashboardView === name) || views[0];
        views.forEach((v) => (v.hidden = v !== target));
        document
            .querySelectorAll(".sidebar-link[data-view-link]")
            .forEach((a) =>
                a.classList.toggle("active", a.dataset.viewLink === target.dataset.dashboardView),
            );
        if (hash) history.replaceState(null, "", `#${target.dataset.dashboardView}`);
        closeSide();
        closeDrops();
        scrollTo({ top: 0, behavior: "smooth" });
        window.initVisibleDashboardCharts?.();
    };
    document.querySelectorAll("[data-view-link]").forEach((a) =>
        a.addEventListener("click", (e) => {
            e.preventDefault();
            showView(a.dataset.viewLink);
        }),
    );
    const initial = location.hash.slice(1);
    showView(views.some((v) => v.dataset.dashboardView === initial) ? initial : "overview", false);
    const panes = [...document.querySelectorAll("[data-booking-pane]")];
    let step = 0;
    const showStep = () => {
        panes.forEach((p, i) => p.classList.toggle("active", i === step));
        document
            .querySelectorAll("[data-step-indicator]")
            .forEach((x, i) => x.classList.toggle("active", i <= step));
    };
    document.querySelectorAll("[data-next-step]").forEach((b) =>
        b.addEventListener("click", () => {
            step = Math.min(step + 1, panes.length - 1);
            showStep();
        }),
    );
    document.querySelectorAll("[data-prev-step]").forEach((b) =>
        b.addEventListener("click", () => {
            step = Math.max(step - 1, 0);
            showStep();
        }),
    );
    document.querySelectorAll("[data-choice]").forEach((b) =>
        b.addEventListener("click", () => {
            b.parentElement
                .querySelectorAll("[data-choice]")
                .forEach((x) => x.classList.remove("selected"));
            b.classList.add("selected");
        }),
    );
    const modal = document.querySelector("[data-modal]");
    const openModal = (title) => {
        if (!modal) return;
        lastFocus = document.activeElement;
        modal.querySelector("[data-modal-title]").textContent = title;
        modal.classList.add("open");
        modal.querySelector("button")?.focus();
    };
    const closeModal = () => {
        modal?.classList.remove("open");
        lastFocus?.focus?.();
    };
    document
        .querySelectorAll("[data-open-modal]")
        .forEach((b) => b.addEventListener("click", () => openModal(b.dataset.openModal)));
    document
        .querySelector("[data-confirm-booking]")
        ?.addEventListener("click", () => openModal("Booking Confirmed"));
    document
        .querySelectorAll("[data-close-modal]")
        .forEach((b) => b.addEventListener("click", closeModal));
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeSide();
            closeDrops();
        }
    });
    const filter = (table) => {
        const name = table.dataset.table,
            q = document.querySelector(`[data-table-search="${name}"]`)?.value.toLowerCase() || "",
            s =
                table
                    .closest("section")
                    .querySelector("[data-table-filter=status]")
                    ?.value.toLowerCase() || "";
        table.querySelectorAll("tbody tr").forEach((r) => {
            const rs = r.querySelector("[data-status]")?.dataset.status.toLowerCase() || "";
            r.hidden = !r.textContent.toLowerCase().includes(q) || (s && rs !== s);
        });
    };
    document.querySelectorAll("[data-table]").forEach((t) =>
        t
            .closest("section")
            .querySelectorAll("[data-table-search],[data-table-filter]")
            .forEach((c) => c.addEventListener("input", () => filter(t))),
    );
})();
