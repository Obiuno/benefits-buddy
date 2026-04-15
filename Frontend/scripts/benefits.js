const grid = document.querySelector('.category-grid');

async function loadBenefits() {
  try {
    const response = await fetch("http://localhost:3000/api/benefits");

    if (!response.ok) {
      throw new Error("Failed to fetch benefits");
    }

    const data = await response.json();

    const activeBenefits = data.benefits.filter(item => item.active);

    renderBenefits(activeBenefits);

  } catch (error) {
    grid.innerHTML = "<p>Failed to load benefits.</p>";
    console.error(error);
  }
}

function renderBenefits(benefits) {
  grid.innerHTML = "";

  benefits.forEach(item => {
    const ageMin = item.details?.eligibility?.age_min ?? "N/A";
    const ageMax = item.details?.eligibility?.age_max ?? "N/A";
    const savings = item.details?.eligibility?.savings_threshold ?? "N/A";

    grid.innerHTML += `
      <div class="category-card">

        <div class="card-icon">💼</div>

        <h3>${item.name}</h3>

        <p><strong>Category:</strong> ${formatText(item.category)}</p>

        <p><strong>Age:</strong> ${ageMin} - ${ageMax}</p>

        <p><strong>Savings:</strong> £${Number(savings).toLocaleString()}</p>

        <a href="${item.urls.apply_url}" target="_blank" class="apply-btn">
          Apply Now
        </a>

      </div>
    `;
  });
}

function formatText(text) {
  return text.replace(/_/g, " ")
             .replace(/\b\w/g, c => c.toUpperCase());
}

loadBenefits();