const chartInstances = [];
const chartSources = {
    "parent-visits": [
        "bar",
        ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        [2, 3, 3, 5, 4, 7],
        "Visits",
    ],
    "parent-children": ["doughnut", ["Aarav", "Anaya"], [15, 9], "Bookings"],
    "admin-revenue": [
        "line",
        ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        [26400, 29100, 31800, 30400, 34600, 38420],
        "Revenue ($)",
    ],
    "admin-zones": [
        "bar",
        ["Toddler", "Junior", "Explorer", "Challenge"],
        [56, 88, 64, 40],
        "Occupancy %",
    ],
};

const renderDashboardCharts = () => {
    if (!window.Chart) return;
    chartInstances.splice(0).forEach((chart) => chart.destroy());
    const dark = document.documentElement.dataset.theme === "dark";
    const text = dark ? "#a9b2c3" : "#687083";
    const grid = dark ? "rgba(169,178,195,.16)" : "rgba(23,33,60,.09)";
    document.querySelectorAll("[data-chart]").forEach((canvas) => {
        const [type, labels, data, label] = chartSources[canvas.dataset.chart];
        const circular = type === "doughnut";
        chartInstances.push(
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
                                ? ["#ff735c", "#6277d9"]
                                : type === "line"
                                  ? "rgba(255,115,92,.16)"
                                  : "#ff735c",
                            borderWidth: 2,
                            borderRadius: 7,
                            fill: type === "line",
                            tension: 0.35,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: circular, labels: { color: text } } },
                    scales: circular
                        ? {}
                        : {
                              x: { ticks: { color: text }, grid: { display: false } },
                              y: {
                                  beginAtZero: true,
                                  ticks: { color: text },
                                  grid: { color: grid },
                              },
                          },
                },
            }),
        );
    });
};

renderDashboardCharts();
document.addEventListener("themechange", renderDashboardCharts);
