const STATUS_URL = "https://www.vercel-status.com/api/v2/status.json";
const card = document.getElementById("status-card");
const icon = document.getElementById("status-icon");
const text = document.getElementById("status-text");
const desc = document.getElementById("status-description");
const updated = document.getElementById("last-updated");

async function checkVercelStatus() {
  try {
    const res = await fetch(STATUS_URL);
    const data = await res.json();
    const { status, indicator, description } = data;

    const now = new Date().toLocaleString();

    updated.textContent = `Last updated: ${now}`;
    desc.textContent = description;

    // Reset classes
    card.classList.remove("ok", "warning", "critical");

    switch (indicator) {
      case "none":
        icon.className = "fa-solid fa-circle-check";
        card.classList.add("ok");
        text.textContent = " All Systems Operational";
        break;
      case "minor":
      case "major":
        icon.className = "fa-solid fa-triangle-exclamation";
        card.classList.add("warning");
        text.textContent = " Partial Outage or Degraded Performance";
        break;
      case "critical":
        icon.className = "fa-solid fa-circle-xmark";
        card.classList.add("critical");
        text.textContent = " Major Outage Detected";
        break;
      default:
        icon.className = "fa-solid fa-circle-question";
        text.textContent = "Unknown Status";
    }
  } catch (err) {
    icon.className = "fa-solid fa-circle-xmark";
    card.classList.add("critical");
    text.textContent = "Error fetching status";
    desc.textContent = "Failed to contact Vercel API.";
  }
}

// Run immediately and every 5 minutes
checkVercelStatus();
setInterval(checkVercelStatus, 300000);
