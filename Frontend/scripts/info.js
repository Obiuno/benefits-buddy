document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll('.faq-item');
  const searchInput = document.querySelector('.search-box input');
  const searchBtn = document.querySelector('.search-box button');
  const faqList = document.querySelector('.faq-list');

  /* FAQ OPEN / CLOSE */
  items.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      item.classList.toggle('active');

      const sign = item.querySelector('span');
      sign.textContent = item.classList.contains('active') ? '−' : '+';
    });
  });

  /* NOT FOUND MESSAGE */
  const notFound = document.createElement('p');
  notFound.textContent = "No FAQ found.";
  notFound.style.textAlign = "center";
  notFound.style.fontSize = "20px";
  notFound.style.color = "#666";
  notFound.style.marginTop = "20px";
  notFound.style.display = "none";
  faqList.appendChild(notFound);

  /* SEARCH */
  function searchFAQ() {
    const keyword = searchInput.value.toLowerCase().trim();
    let found = false;

    items.forEach(item => {
      const question = item.querySelector('.faq-question').innerText.toLowerCase();
      const answer = item.querySelector('.faq-answer').innerText.toLowerCase();

      if (
        keyword === "" ||
        question.includes(keyword) ||
        answer.includes(keyword)
      ) {
        item.style.display = "block";
        found = true;
      } else {
        item.style.display = "none";
      }
    });

    notFound.style.display = found ? "none" : "block";
  }

  /* EVENTS */
  searchInput.addEventListener("input", searchFAQ);
  searchBtn.addEventListener("click", searchFAQ);

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchFAQ();
  });
});


