const faqList = document.querySelector('.faq-list');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');

let allFaqs = [];

/* LOAD FAQS FROM BACKEND */
async function loadFaqs() {
  try {
    const response = await fetch('/api/faqs');
    const data = await response.json();

    allFaqs = data.filter(faq => faq.active);
    renderFaqs(allFaqs);

  } catch (error) {
    faqList.innerHTML = "<p>Failed to load FAQs.</p>";
    console.error(error);
  }
}

/* RENDER FAQS */
function renderFaqs(faqs) {
  faqList.innerHTML = "";

  if (faqs.length === 0) {
    faqList.innerHTML = "<p class='not-found'>No results found.</p>";
    return;
  }

  faqs.forEach(faq => {
    faqList.innerHTML += `
      <div class="faq-item">
        <button class="faq-question">
          ${faq.question}
          <span>+</span>
        </button>

        <div class="faq-answer">
          ${faq.answer}
        </div>
      </div>
    `;
  });

  addAccordionEvents();
}

/* OPEN / CLOSE */
function addAccordionEvents() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      item.classList.toggle('active');

      const sign = item.querySelector('span');
      sign.textContent =
        item.classList.contains('active') ? '−' : '+';
    });
  });
}

/* SEARCH */
function searchFaqs() {
  const keyword = searchInput.value.toLowerCase().trim();

  const filtered = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(keyword) ||
    faq.answer.toLowerCase().includes(keyword) ||
    faq.category.toLowerCase().includes(keyword) ||
    faq.benefit_slug.toLowerCase().includes(keyword)
  );

  renderFaqs(filtered);
}

/* EVENTS */
searchInput.addEventListener('input', searchFaqs);
searchBtn.addEventListener('click', searchFaqs);

searchInput.addEventListener('keypress', e => {
  if (e.key === "Enter") searchFaqs();
});

/* START */
loadFaqs();