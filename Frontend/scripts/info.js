const items = document.querySelectorAll('.faq-item');
const glossaryItems = document.querySelectorAll('.glossary-item');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');

/* FAQ OPEN / CLOSE */
items.forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    item.classList.toggle('active');

    const sign = item.querySelector('span');
    sign.textContent = item.classList.contains('active') ? '−' : '+';
  });
});

/* CREATE NOT FOUND MESSAGE */
const helpSections = document.querySelector('.glossary-section');

const notFound = document.createElement('p');
notFound.textContent = "No results found.";
notFound.style.textAlign = "center";
notFound.style.fontSize = "20px";
notFound.style.color = "#666";
notFound.style.margin = "30px 0";
notFound.style.display = "none";

helpSections.appendChild(notFound);

/* SEARCH FUNCTION */
function searchAll() {
  const keyword = searchInput.value.toLowerCase().trim();
  let found = false;

  // FAQ Search
  items.forEach(item => {
    const text = item.innerText.toLowerCase();

    if (text.includes(keyword) || keyword === "") {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  // Glossary Search
  glossaryItems.forEach(item => {
    const text = item.innerText.toLowerCase();

    if (text.includes(keyword) || keyword === "") {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  notFound.style.display = found ? "none" : "block";
}

/* LIVE SEARCH WHEN TYPING */
searchInput.addEventListener('input', searchAll);

/* SEARCH BUTTON */
searchBtn.addEventListener('click', searchAll);

/* ENTER KEY */
searchInput.addEventListener('keypress', function(e){
  if(e.key === "Enter"){
    searchAll();
  }
});