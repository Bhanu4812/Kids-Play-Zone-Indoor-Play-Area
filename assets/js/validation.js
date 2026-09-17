document.querySelectorAll("[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let valid = true;
        form.querySelectorAll("[required]").forEach((field) => {
            const error = field.closest(".field")?.querySelector(".field-error");
            let message = "";
            if (!field.value.trim()) message = "This field is required.";
            if (field.type === "email" && field.value && !/^\S+@\S+\.\S+$/.test(field.value))
                message = "Enter a valid email address.";
            if (field.name === "password" && field.value.length < 8)
                message = "Use at least 8 characters.";
            if (
                field.name === "confirm" &&
                field.value !== form.querySelector('[name="password"]')?.value
            )
                message = "Passwords do not match.";
            field.setAttribute("aria-invalid", String(Boolean(message)));
            if (error) error.textContent = message;
            if (message) valid = false;
        });
        if (!valid) return;
        const submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        submit.textContent = "Sending…";
        setTimeout(() => {
            const status = document.createElement("p");
            status.className = "form-status";
            status.setAttribute("role", "status");
            status.textContent = form.dataset.success || "Success! Your details have been saved.";
            form.append(status);
            submit.textContent = "Complete";
            form.reset();
        }, 700);
    });
});

document.querySelectorAll("[data-password-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordToggle);
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
    }),
);
