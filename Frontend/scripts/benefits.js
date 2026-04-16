let allBenefits = [];

async function loadBenefits() {
  try {
    const response = await fetch("http://localhost:3000/api/benefits");
    const data = await response.json();

    allBenefits = data.benefits;
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

  list.forEach(item => {
    const name = highlight(item.name, searchText);
    const desc = highlight(item.description || "", searchText);

    grid.innerHTML += `
      <article class="benefit-card">

        <img
          src="${item.image || 'Images/default.jpg'}"
          class="card-img"
          alt="${item.name}"
        >

        <div class="card-content">
          <span class="tag">${formatCategory(item.category)}</span>

          <h2>${name}</h2>
          <p>${desc}</p>

          <div class="card-actions">
            <button class="btn secondary"
              onclick="openModal('${item.slug}')">
              Learn More
            </button>

            <a href="${item.urls.apply_url}"
               target="_blank"
               class="btn primary">
               Apply
            </a>
          </div>
        </div>
      </article>
    `;
  });
}

function highlight(text, search) {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, `<mark>$1</mark>`);
}

function formatCategory(text) {
  return text.replaceAll("_", " ");
}

function searchBenefits() {
  const text = document
    .getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

  const filtered = allBenefits.filter(item =>
    item.name.toLowerCase().includes(text) ||
    item.category.toLowerCase().includes(text) ||
    (item.description || "").toLowerCase().includes(text)
  );

  renderBenefits(filtered, text);
}

function openModal(slug) {
  const item = allBenefits.find(b => b.slug === slug);
  const info = item.learn_more;

  document.getElementById("modalContent").innerHTML = `
    <h2>${item.name}</h2>

    <h3>Eligibility</h3>
    <ul>
      <li>Age: ${info.eligibility.age_min} - ${info.eligibility.age_max}</li>
      <li>Savings: £${info.eligibility.savings_threshold}</li>
      <li>Residency: ${info.eligibility.residency}</li>
    </ul>

    <h3>Documents Required</h3>
    <ul>
      ${info.documents_required.map(x => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Things To Know</h3>
    <ul>
      ${info.gotchas.map(x => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Preparation Tips</h3>
    <ul>
      ${info.preparation_tips.map(x => `<li>${x}</li>`).join("")}
    </ul>

    <a href="${item.urls.gov_url}"
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

loadBenefits();