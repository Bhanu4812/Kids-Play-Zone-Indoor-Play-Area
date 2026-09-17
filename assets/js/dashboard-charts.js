(() => {
    const instances = new Map();
    const defs = {
        "parent-visits": [
            "line",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [2, 3, 2, 5, 4, 6],
            "Visits",
        ],
        "parent-usage": ["doughnut", ["Used", "Remaining"], [5, 7], "Sessions"],
        "parent-zones": [
            "bar",
            ["Toddler", "Junior", "Explorer", "Challenge"],
            [9, 15, 6, 3],
            "Visits",
            true,
        ],
        "membership-monthly": [
            "bar",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [2, 3, 2, 4, 3, 5],
            "Sessions",
        ],
        "membership-zones": [
            "doughnut",
            ["Toddler", "Junior", "Explorer", "Challenge"],
            [9, 15, 6, 3],
            "Visits",
        ],
        "history-visits": [
            "line",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [2, 3, 2, 5, 4, 6],
            "Visits",
        ],
        "admin-bookings": [
            "line",
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            [32, 38, 35, 46, 58, 82, 74],
            "Bookings",
        ],
        "admin-revenue": [
            "bar",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [7.2, 7.8, 8.1, 8.9, 9.4, 10.1],
            "Revenue (₹L)",
        ],
        "admin-zone-popularity": [
            "doughnut",
            ["Toddler", "Junior", "Explorer", "Challenge"],
            [22, 34, 27, 17],
            "Share",
        ],
        "admin-memberships": [
            "doughnut",
            ["Mini Explorer", "Explorer Plus", "Adventure Unlimited"],
            [98, 156, 72],
            "Members",
        ],
        "admin-occupancy": [
            "line",
            ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"],
            [18, 32, 48, 55, 46, 63, 78, 84, 71, 52],
            "Occupancy %",
        ],
        "parent-growth": [
            "line",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [520, 548, 579, 611, 647, 684],
            "Parents",
        ],
        "children-age": ["doughnut", ["1–4", "5–8", "9–12"], [286, 398, 208], "Children"],
        "children-visits": ["bar", ["1–4", "5–8", "9–12"], [612, 948, 521], "Visits"],
        "membership-growth": [
            "line",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [238, 251, 267, 284, 301, 326],
            "Members",
        ],
        "renewal-rate": ["doughnut", ["Renewed", "Due"], [86, 14], "Rate"],
        "party-monthly": [
            "bar",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [14, 18, 20, 22, 24, 26],
            "Parties",
        ],
        "party-packages": [
            "doughnut",
            ["Happy Birthday", "Super Celebration", "Ultimate"],
            [34, 48, 18],
            "Share",
        ],
        "party-themes": [
            "bar",
            ["Space", "Jungle", "Princess", "Superhero"],
            [28, 24, 19, 16],
            "Bookings",
        ],
        "payment-source": [
            "doughnut",
            ["Sessions", "Memberships", "Parties", "Add-ons"],
            [42, 31, 21, 6],
            "Revenue",
        ],
        "birthday-revenue": [
            "bar",
            ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            [1.4, 1.8, 2.0, 2.2, 2.4, 2.64],
            "Revenue (₹L)",
        ],
        "peak-hours": [
            "bar",
            ["9 AM", "11 AM", "1 PM", "3 PM", "5 PM", "7 PM"],
            [18, 42, 36, 78, 66, 28],
            "Bookings",
        ],
    };
    const theme = () => {
        const dark = document.documentElement.dataset.theme === "dark";
        return {
            text: dark ? "#a9b2c3" : "#687083",
            grid: dark ? "rgba(169,178,195,.13)" : "rgba(23,33,60,.08)",
            tip: dark ? "#1b2434" : "#17213c",
        };
    };
    window.getDashboardChartTheme = theme;
    const plugin = {
        id: "centerText",
        afterDraw(chart) {
            if (chart.config.type !== "doughnut") return;
            const {
                    ctx,
                    chartArea: { left, right, top, bottom },
                } = chart,
                total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0),
                remaining =
                    chart.data.labels[1] === "Remaining" ? chart.data.datasets[0].data[1] : total;
            ctx.save();
            ctx.fillStyle = theme().text;
            ctx.textAlign = "center";
            ctx.font = "700 22px Poppins";
            ctx.fillText(String(remaining), (left + right) / 2, (top + bottom) / 2);
            ctx.font = "12px Inter";
            ctx.fillText(
                chart.data.labels[1] === "Remaining" ? "Remaining" : "Total",
                (left + right) / 2,
                (top + bottom) / 2 + 20,
            );
            ctx.restore();
        },
    };
    window.initVisibleDashboardCharts = () => {
        if (!window.Chart) return;
        document.querySelectorAll("[data-chart]").forEach((canvas) => {
            if (canvas.closest("[hidden]") || instances.has(canvas)) return;
            const [type, labels, data, label, horizontal] = defs[canvas.dataset.chart] || [];
            if (!type) return;
            const c = theme(),
                circular = type === "doughnut";
            instances.set(
                canvas,
                new Chart(canvas, {
                    type,
                    data: {
                        labels,
                        datasets: [
                            {
                                label,
                                data,
                                borderColor: "#ff735c",
                                backgroundColor: circular
                                    ? ["#ff735c", "#6475a5", "#9ca9c7", "#d8deea"]
                                    : type === "line"
                                      ? "rgba(255,115,92,.14)"
                                      : ["#ff735c", "#6f7fad", "#9aa6c3", "#c7cedd"],
                                borderWidth: type === "line" ? 2 : 0,
                                borderRadius: 7,
                                fill: type === "line",
                                tension: 0.38,
                            },
                        ],
                    },
                    plugins: [plugin],
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: horizontal ? "y" : "x",
                        cutout: circular ? "72%" : undefined,
                        plugins: {
                            legend: {
                                display: circular,
                                position: "bottom",
                                labels: {
                                    color: c.text,
                                    usePointStyle: true,
                                    boxWidth: 8,
                                    padding: 16,
                                },
                            },
                            tooltip: { backgroundColor: c.tip, padding: 11 },
                        },
                        scales: circular
                            ? {}
                            : {
                                  x: { ticks: { color: c.text }, grid: { display: false } },
                                  y: {
                                      beginAtZero: true,
                                      ticks: { color: c.text },
                                      grid: { color: c.grid },
                                  },
                              },
                    },
                }),
            );
        });
    };
    window.refreshDashboardCharts = () => {
        instances.forEach((c) => c.destroy());
        instances.clear();
        window.initVisibleDashboardCharts();
    };
    document.addEventListener("themechange", window.refreshDashboardCharts);
    document.addEventListener("directionchange", window.refreshDashboardCharts);
    window.initVisibleDashboardCharts();
})();
