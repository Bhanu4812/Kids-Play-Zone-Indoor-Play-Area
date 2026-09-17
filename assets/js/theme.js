(() => {
    const saved = localStorage.getItem("kpz-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = saved || preferred;
    document.documentElement.dir = localStorage.getItem("kpz-direction") || "ltr";

    const moonIcon =
        '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.7 15.2A8.5 8.5 0 0 1 8.8 3.3 9 9 0 1 0 20.7 15.2Z"/></svg>';
    const sunIcon =
        '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';

    window.syncKpzControls = () => {
        const dark = document.documentElement.dataset.theme === "dark";
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const textStyle = button.closest(".mobile-utilities");
            button.innerHTML = textStyle
                ? dark
                    ? "Light Mode"
                    : "Dark Mode"
                : dark
                  ? sunIcon
                  : moonIcon;
            button.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode",
            );
        });
        const rtl = document.documentElement.dir === "rtl";
        document.querySelectorAll("[data-direction-toggle]").forEach((button) => {
            button.textContent = rtl ? "LTR" : "RTL";
            button.setAttribute(
                "aria-label",
                rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout",
            );
        });
    };

    window.toggleKpzTheme = () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("kpz-theme", next);
        window.syncKpzControls();
        document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
    };

    window.toggleKpzDirection = () => {
        const next = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
        document.documentElement.dir = next;
        localStorage.setItem("kpz-direction", next);
        window.syncKpzControls();
    };

    window.enhanceKpzSelects = (scope = document) => {
        scope.querySelectorAll("select:not([data-customized])").forEach((select) => {
            select.dataset.customized = "true";
            const wrapper = document.createElement("div");
            wrapper.className = "custom-select";
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
            select.classList.add("custom-select__native");

            const trigger = document.createElement("button");
            trigger.className = "custom-select__trigger";
            trigger.type = "button";
            trigger.setAttribute("aria-haspopup", "listbox");
            trigger.setAttribute("aria-expanded", "false");
            wrapper.appendChild(trigger);

            const list = document.createElement("div");
            list.className = "custom-select__menu";
            list.setAttribute("role", "listbox");
            wrapper.appendChild(list);

            const sync = () => {
                const selected = select.options[select.selectedIndex];
                trigger.innerHTML = `<span>${selected?.text || "Choose an option"}</span><span class="custom-select__chevron" aria-hidden="true"></span>`;
                list.querySelectorAll('[role="option"]').forEach((option) => {
                    const active = option.dataset.value === select.value;
                    option.classList.toggle("selected", active);
                    option.setAttribute("aria-selected", String(active));
                });
            };

            [...select.options].forEach((nativeOption) => {
                const option = document.createElement("button");
                option.className = "custom-select__option";
                option.type = "button";
                option.setAttribute("role", "option");
                option.dataset.value = nativeOption.value;
                option.textContent = nativeOption.text;
                option.disabled = nativeOption.disabled;
                option.addEventListener("click", () => {
                    select.value = nativeOption.value;
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                    wrapper.classList.remove("open");
                    trigger.setAttribute("aria-expanded", "false");
                    sync();
                    trigger.focus();
                });
                list.appendChild(option);
            });

            trigger.addEventListener("click", () => {
                document.querySelectorAll(".custom-select.open").forEach((item) => {
                    if (item !== wrapper) item.classList.remove("open");
                });
                const open = wrapper.classList.toggle("open");
                trigger.setAttribute("aria-expanded", String(open));
            });
            trigger.addEventListener("keydown", (event) => {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    wrapper.classList.add("open");
                    list.querySelector(".selected, button:not(:disabled)")?.focus();
                }
                if (event.key === "Escape") wrapper.classList.remove("open");
            });
            select.addEventListener("change", sync);
            sync();
        });

        if (!document.documentElement.dataset.selectDismiss) {
            document.documentElement.dataset.selectDismiss = "true";
            document.addEventListener("click", (event) => {
                document.querySelectorAll(".custom-select.open").forEach((wrapper) => {
                    if (!wrapper.contains(event.target)) {
                        wrapper.classList.remove("open");
                        wrapper
                            .querySelector(".custom-select__trigger")
                            ?.setAttribute("aria-expanded", "false");
                    }
                });
            });
        }
    };
})();
