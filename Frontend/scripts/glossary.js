const lettersBox = document.getElementById("letters");
const search = document.getElementById("searchInput");
const termsBox = document.getElementById("terms");

let allTerms = [];
let currentLetter = "";

const notFound = document.createElement("p");
notFound.textContent = "No results found.";
notFound.style.textAlign = "center";
notFound.style.fontSize = "20px";
notFound.style.color = "#666";
notFound.style.gridColumn = "1 / -1";
notFound.style.display = "none";

termsBox.appendChild(notFound);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

alphabet.forEach((letter) => {
  const btn = document.createElement("button");
  btn.textContent = letter;

  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".letters button")
      .forEach((x) => x.classList.remove("active"));

    btn.classList.add("active");
    currentLetter = letter;

    filterTerms();
  });

  lettersBox.appendChild(btn);
});

async function loadGlossary() {
  try {
    const response = await fetch("/api/glossary");

    if (!response.ok) {
      throw new Error("Failed to fetch glossary");
    }

    const data = await response.json();

    allTerms = data;
    renderTerms(allTerms);
  } catch (error) {
    termsBox.innerHTML = "<p class='not-found'>Failed to load glossary.</p>";
    console.error(error);
  }
}

function highlightText(text, keyword) {
  if (!keyword) return text;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

function renderTerms(list, keyword = "") {
  termsBox.innerHTML = "";

  if (list.length === 0) {
    notFound.style.display = "block";
    termsBox.appendChild(notFound);
    return;
  }

  notFound.style.display = "none";

  list.forEach((item) => {
    const letter = item.term.charAt(0).toUpperCase();

    termsBox.innerHTML += `
      <div class="term-card" data-letter="${letter}">
        <h3>${highlightText(item.term, keyword)}</h3>
        <p>${highlightText(item.definition, keyword)}</p>
      </div>
    `;
  });

  termsBox.appendChild(notFound);
}

function filterTerms() {
  const keyword = search.value.toLowerCase().trim();

  let filtered = allTerms.filter((item) => {
    const matchesLetter =
      currentLetter === "" ||
      item.term.charAt(0).toUpperCase() === currentLetter;

    const text = `${item.term} ${item.definition}`.toLowerCase();

    const matchesSearch = keyword === "" || text.includes(keyword);

    return matchesLetter && matchesSearch;
  });

  renderTerms(filtered, keyword);
}

search.addEventListener("input", () => {
  currentLetter = "";
  document
    .querySelectorAll(".letters button")
    .forEach((x) => x.classList.remove("active"));

  filterTerms();
});

search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    filterTerms();
  }
});

loadGlossary();

function submitFeedback(answer) {
  document.getElementById("feedbackMessage").innerText =
    "Thank you for your feedback.";

  console.log("User selected:", answer);
}
