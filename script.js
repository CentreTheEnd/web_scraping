const API_STATUS = "https://www.vercel-status.com/api/v2/status.json";
const API_COMPONENTS = "https://www.vercel-status.com/api/v2/components.json";

const icon = document.getElementById("status-icon");
const desc = document.getElementById("status-description");
const updated = document.getElementById("last-updated");
const globalStatus = document.getElementById("global-status");
const componentsList = document.getElementById("components-list");

async function fetchVercelStatus() {
  try {
    const [statusRes, compRes] = await Promise.all([
      fetch(API_STATUS),
      fetch(API_COMPONENTS)
    ]);

    const statusData = await statusRes.json();
    const compsData = await compRes.json();

    const { status, indicator, description } = statusData;

    // Update global section
    const now = new Date().toLocaleString('en-US', {
       dateStyle: 'medium',
       timeStyle: 'short'
    });
    updated.textContent = `Last updated: ${now}`;

    desc.textContent = description;
    globalStatus.textContent = `Overall Status: ${status.description}`;

    document.querySelector(".overall").classList.remove("status-ok", "status-warning", "status-critical");

    switch (indicator) {
      case "none":
        icon.className = "fa-solid fa-circle-check";
        document.querySelector(".overall").classList.add("status-ok");
        break;
      case "minor":
      case "major":
        icon.className = "fa-solid fa-triangle-exclamation";
        document.querySelector(".overall").classList.add("status-warning");
        break;
      case "critical":
        icon.className = "fa-solid fa-circle-xmark";
        document.querySelector(".overall").classList.add("status-critical");
        break;
      default:
        icon.className = "fa-solid fa-circle-question";
    }

    // Render components
    renderComponents(compsData.components);
  } catch (err) {
    console.error("Error fetching Vercel status:", err);
    globalStatus.textContent = "Error fetching Vercel status data.";
  }
}

function renderComponents(components) {
  componentsList.innerHTML = "";
  components.forEach((comp) => {
    const div = document.createElement("div");
    div.classList.add("component");

    let statusClass = "status-ok";
    let iconType = "fa-circle-check";

    if (comp.status === "operational") {
      statusClass = "status-ok";
      iconType = "fa-circle-check";
    } else if (comp.status.includes("partial")) {
      statusClass = "status-warning";
      iconType = "fa-triangle-exclamation";
    } else if (comp.status.includes("outage")) {
      statusClass = "status-critical";
      iconType = "fa-circle-xmark";
    }

    div.classList.add(statusClass);
    div.innerHTML = `
      <h3><i class="fa-solid ${iconType}"></i>${comp.name}</h3>
      <p>Status: ${comp.status.replace(/_/g, " ")}</p>
    `;

    componentsList.appendChild(div);
  });
}

// Initial fetch + auto refresh every 5 mins
fetchVercelStatus();
setInterval(fetchVercelStatus, 300000);
