// Mood button highlight
const moodButtons = document.querySelectorAll(".mood-btn");
const selectedFeelingInput = document.getElementById("selectedFeeling");

moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    moodButtons.forEach(b => b.classList.remove("bg-cyan-600", "text-white"));
    btn.classList.add("bg-cyan-600", "text-white");
    selectedFeelingInput.value = btn.dataset.feeling;
  });
});

// Intensity slider
const intensitySlider = document.getElementById("intensity");
const intensityValue = document.getElementById("intensityValue");
intensitySlider.addEventListener("input", () => {
  intensityValue.textContent = intensitySlider.value;
});

// Stars rating
const starsContainer = document.getElementById("stars");
const enjoymentInput = document.getElementById("enjoymentRating");
for (let i = 1; i <= 5; i++) {
  const star = document.createElement("span");
  star.textContent = "★";
  star.classList.add("text-gray-500", "select-none");
  star.addEventListener("click", () => {
    enjoymentInput.value = i;
    [...starsContainer.children].forEach((s, index) => {
      s.classList.toggle("text-yellow-400", index < i);
      s.classList.toggle("text-gray-500", index >= i);
    });
  });
  starsContainer.appendChild(star);
}

// Chart.js setup
const ctx = document.getElementById("progressChart").getContext("2d");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Progress",
      data: [70, 80, 60, 90, 75, 85, 95],
      borderColor: "#b9d8c0",
      backgroundColor: "rgba(74, 222, 128, 0.2)",
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#333" } }
    }
  }
});

// ---- Redirect to localhost:/app on submit ----
const feedbackForm = document.getElementById("feedbackForm");
const REDIRECT_URL = "http://localhost:5173/app"; // change to "/app" if you want same-origin

feedbackForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // (optional) store the feedback locally before leaving the page
  try {
    const formData = new FormData(feedbackForm);
    const payload = Object.fromEntries(formData.entries());
    payload.submittedAt = new Date().toISOString();
    localStorage.setItem("lastFeedback", JSON.stringify(payload));
  } catch {}

  // Go to the app
  window.location.replace(REDIRECT_URL);
});
