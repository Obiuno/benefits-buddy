const faqList = document.querySelector(".faq-list");
const searchInput = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");

let allFaqs = [];

async function loadFaqs() {
  try {
    const response = await fetch("/api/faqs");
    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }

    const data = await response.json();

    allFaqs = data.filter((faq) => faq.active);

    renderFaqs(allFaqs);
  } catch (error) {
    faqList.innerHTML = "<p class='not-found'>Failed to load FAQs.</p>";
    console.error(error);
  }
}

function highlightText(text, keyword) {
  if (!keyword) return text;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

function renderFaqs(faqs, keyword = "") {
  faqList.innerHTML = "";

  if (faqs.length === 0) {
    faqList.innerHTML = "<p class='not-found'>No results found.</p>";
    return;
  }

  faqs.forEach((faq) => {
    faqList.innerHTML += `
      <div class="faq-item">
        <button class="faq-question">
          ${highlightText(faq.question, keyword)}
          <span>+</span>
        </button>

        <div class="faq-answer">
          ${highlightText(faq.answer, keyword)}
        </div>
      </div>
    `;
  });

  addAccordionEvents();
}

function addAccordionEvents() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    item.querySelector(".faq-question").addEventListener("click", () => {
      item.classList.toggle("active");

      const sign = item.querySelector("span");
      sign.textContent = item.classList.contains("active") ? "−" : "+";
    });
  });
}

function searchFaqs() {
  const keyword = searchInput.value.toLowerCase().trim();

  const filtered = allFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword) ||
      (faq.category || "").toLowerCase().includes(keyword) ||
      (faq.benefit_slug || "").toLowerCase().includes(keyword),
  );

  renderFaqs(filtered, keyword);
}

searchInput.addEventListener("input", searchFaqs);
searchBtn.addEventListener("click", searchFaqs);

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchFaqs();
  }
});

loadFaqs();

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