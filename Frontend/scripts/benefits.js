let allBenefits = [];

async function loadBenefits() {
  try {
    const response = await fetch("/api/benefits/frontend");
    const data = await response.json();

    allBenefits = data.benefits || data || [];
    renderBenefits(allBenefits);
  } catch (error) {
    console.error("Error loading benefits:", error);
  }
}

function renderBenefits(list, searchText = "") {
  const grid = document.getElementById("benefitGrid");
  const noResult = document.getElementById("noResult");

  grid.innerHTML = "";

  if (list.length === 0) {
    noResult.style.display = "block";
    return;
  } else {
    noResult.style.display = "none";
  }

  list.forEach((item, index) => {
    const name = highlight(item.name, searchText);
    const desc = highlight(item.description || "", searchText);

    grid.innerHTML += `
      <article class="benefit-card">

        <img
          src="${item.image || "Images/default.jpg"}"
          class="card-img"
          alt="${item.name}"
        >

        <div class="card-content">
          <span class="tag">${formatCategory(item.category)}</span>

          <h2>${name}</h2>
          <p>${desc}</p>

          <div class="card-actions">

            <button class="btn secondary"
              onclick="openModal(${index})">
              learn more
            </button>

            <a href="${item.urls?.apply_url || "#"}"
               target="_blank"
               class="btn primary">
               Apply at GOV.UK
            </a>

          </div>
        </div>
      </article>
    `;
  });
}

function searchBenefits() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  const filtered = allBenefits.filter((item) => {
    const text = `
      ${item.name}
      ${item.category}
      ${item.description || ""}
    `.toLowerCase();

    return text.includes(keyword);
  });

  renderBenefits(filtered, keyword);
}

function highlight(text, keyword) {
  if (!keyword) return text;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

function formatCategory(text) {
  if (!text) return "General";

  return String(text).replace(/_/g, " ");
}

/* LEARN MORE MODEL*/
function openModal(index) {
  const item = allBenefits[index];
  const info = item.learn_more || {};

  document.getElementById("modalContent").innerHTML = `
    <h2>${item.name}</h2>

    <h3>Eligibility</h3>
    <ul>
      <li>Age: ${info.eligibility?.age_min || "-"} - ${info.eligibility?.age_max || "-"}</li>
      <li>Savings Threshold: £${info.eligibility?.savings_threshold || "-"}</li>
      <li>Residency: ${info.eligibility?.residency || "-"}</li>
    </ul>

    <h3>Documents Required</h3>
    <ul>
      ${(info.documents_required || []).map((x) => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Things To Know</h3>
    <ul>
      ${(info.gotchas || []).map((x) => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Preparation Tips</h3>
    <ul>
      ${(info.preparation_tips || []).map((x) => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Related Benefits</h3>
    <ul>
      ${(info.related_benefits || []).map((x) => `<li>${formatCategory(x)}</li>`).join("")}
    </ul>

    <h3>Questions To Ask</h3>
    <ul>
      ${(info.questions_to_ask || []).map((x) => `<li>${x.question}</li>`).join("")}
    </ul>

    <a href="${info.gov_url || "#"}"
       target="_blank"
       class="gov-btn">
       Visit GOV.UK
    </a>
  `;

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  loadBenefits();

  const input = document.getElementById("searchInput");

  if (input) {
    input.addEventListener("input", searchBenefits);
  }
});


function submitFeedback(answer) {
  const message = document.getElementById("feedbackMessage");

  if (answer === "Yes") {
    message.textContent = "Thank you for your feedback!";
  } else {
    message.textContent = "Thank you for your feedback! Please let us know what can be improved.";
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = "/about.html#contact-form"; 
    }, 2000);
  }
}

