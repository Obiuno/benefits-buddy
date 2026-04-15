const lettersBox = document.getElementById('letters');
const search = document.getElementById('searchInput');

/* GET CARDS */
let cards = document.querySelectorAll('.term-card');

/* CREATE NOT FOUND MESSAGE */
const termsBox = document.getElementById('terms');

const notFound = document.createElement('p');
notFound.textContent = "No results found.";
notFound.style.textAlign = "center";
notFound.style.fontSize = "20px";
notFound.style.color = "#666";
notFound.style.gridColumn = "1 / -1";
notFound.style.display = "none";

termsBox.appendChild(notFound);

/* FULL A-Z */
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

alphabet.forEach(letter => {
  const btn = document.createElement('button');
  btn.textContent = letter;

  btn.onclick = () => filterLetter(letter, btn);

  lettersBox.appendChild(btn);
});

/* FILTER LETTER */
function filterLetter(letter, btn) {
  document.querySelectorAll('.letters button')
    .forEach(x => x.classList.remove('active'));

  btn.classList.add('active');

  let found = false;

  cards.forEach(card => {
    if (card.dataset.letter === letter) {
      card.classList.remove('hidden');
      found = true;
    } else {
      card.classList.add('hidden');
    }
  });

  notFound.style.display = found ? "none" : "block";
}

/* SEARCH */
function searchTerms() {
  const q = search.value.toLowerCase().trim();

  document.querySelectorAll('.letters button')
    .forEach(x => x.classList.remove('active'));

  let found = false;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(q) || q === "") {
      card.classList.remove('hidden');
      found = true;
    } else {
      card.classList.add('hidden');
    }
  });

  notFound.style.display = found ? "none" : "block";
}

/* LIVE SEARCH */
search.addEventListener('input', searchTerms);

/* ENTER KEY */
search.addEventListener('keypress', function(e){
  if(e.key === "Enter"){
    searchTerms();
  }
});