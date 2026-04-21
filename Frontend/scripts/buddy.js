const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const historyBox = document.getElementById("historyBox");

let waitingForReply = false;
let allChats = [];
let currentChatId = null;

/* =====================================================
   USER MODE
   Guest  -> sessionStorage (clears when browser closes)
   Login  -> localStorage per user
===================================================== */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("buddyLoggedInUser")) || null;
}

function isLoggedIn() {
  return !!getCurrentUser();
}

function getStorageKey() {
  const user = getCurrentUser();
  return user ? `buddyChats_${user.email}` : "buddyChats_guest";
}

function getStorage() {
  return isLoggedIn() ? localStorage : sessionStorage;
}

/* =====================================================
   INIT
===================================================== */
window.onload = () => {
  loadAllChats();
};

/* =====================================================
   TIME
===================================================== */
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =====================================================
   STORAGE
===================================================== */
function loadAllChats() {
  const saved = getStorage().getItem(getStorageKey());

  if (saved) {
    allChats = JSON.parse(saved);
  } else {
    allChats = [];
  }

  if (allChats.length === 0) {
    createNewChatSession();
  } else {
    currentChatId = allChats[0].id;
    renderCurrentChat();
  }

  renderHistoryList();
}

function saveAllChats() {
  getStorage().setItem(getStorageKey(), JSON.stringify(allChats));
  renderHistoryList();
}

function createNewChatSession() {
  const chat = {
    id: Date.now(),
    title: "New Chat",
    pinned: false,
    createdAt: new Date().toISOString(),
    messages: [],
  };

  allChats.unshift(chat);
  currentChatId = chat.id;

  saveAllChats();
  renderCurrentChat();
}

function getCurrentChat() {
  return allChats.find((chat) => chat.id === currentChatId);
}

/* =====================================================
   CHAT UI
===================================================== */
function renderCurrentChat() {
  chatBox.innerHTML = "";

  const current = getCurrentChat();

  if (!current || current.messages.length === 0) {
    chatBox.innerHTML = `
      <div class="welcome-title">
        <h1>Hello 👋 I am Benefit Buddy</h1>
        <h2>How can I assist you today?</h2>
      </div>
    `;
    return;
  }

 current.messages.forEach((msg) => {
  if (msg.role === "assistant") {
    renderAssistantResponse(msg);
  } else {
    addMessage("user", msg.content, msg.time);
  }
});
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =====================================================
   MESSAGE BUBBLES
===================================================== */
function linkify(text) {
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s<]+)/g;

  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
  });
}
function addMessage(sender, text, time = getTime()) {
  const row = document.createElement("div");
  row.className = `chat-row ${sender}`;

  row.innerHTML = `
    <div class="avatar">
      ${sender === "user" ? "🧑" : "🤖"}
    </div>

    <div class="msg ${sender}">
      <div>${linkify(text)}</div>
      <span class="time">${time}</span>
    </div>
  `;

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;

  return row;
}

/* =====================================================
   TYPING ANIMATION
===================================================== */
function addTyping() {
  const row = document.createElement("div");
  row.className = "chat-row bot typing-row";

  row.innerHTML = `
    <div class="avatar">🤖</div>

    <div class="msg bot typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;

  return row;
}

/* =====================================================
   SEND MESSAGE
===================================================== */
async function sendMessage() {
  if (waitingForReply) return;

  const text = input.value.trim();
  if (!text) return;

  const current = getCurrentChat();
  if (!current) return;

  waitingForReply = true;

  if (current.messages.length === 0) {
    current.title = text.substring(0, 30);
  }

  const userMsg = {
    role: "user",
    content: text,
    time: getTime(),
  };

  current.messages.push(userMsg);
  saveAllChats();
  renderCurrentChat();

  input.value = "";
  input.disabled = true;

  const loading = addTyping();

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: current.messages,
      }),
    });

    const data = await response.json();

    loading.remove();

   current.messages.push({
  role: "assistant",
  content: data.message || "No response.",
  benefits: data.benefits_suggested || [],
  glossary: data.glossary_terms || [],
  nextQuestion: data.next_question || null,
  time: getTime(),
});

renderAssistantResponse(current.messages[current.messages.length - 1]);

    saveAllChats();
  } catch (error) {
    console.error(error);

    loading.remove();
    addMessage("bot", "❌ Server error.");

    current.messages.push({
      role: "assistant",
      content: "❌ Server error.",
      time: getTime(),
    });

    saveAllChats();
  }

  waitingForReply = false;
  input.disabled = false;
  input.focus();
}

/* =====================================================
   AI RESPONSE
===================================================== */
function renderAssistantResponse(msg) {
 addMessage("bot", msg.content || "No response.");

  /* Benefits Cards */
if (msg.benefits?.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "cards-wrap";

msg.benefits.forEach((item) => {
        const card = document.createElement("div");
     card.className = "info-card benefit-card";

      card.innerHTML = `
        <h3>🎯 ${item.name}</h3>
        <p>${item.reason}</p>
        <a href="${item.gov_url}" target="_blank">Learn More</a>
      `;

      wrap.appendChild(card);
    });

    chatBox.appendChild(wrap);
  }

  /* Glossary Cards */
  if (msg.glossary?.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "cards-wrap";

    msg.glossary.forEach((term) => {
      const card = document.createElement("div");
      card.className = "info-card glossary-card";

      card.innerHTML = `
        <h3>📘 Helpful Term</h3>
        <p>${term.replace(/_/g, " ")}</p>
      `;

      wrap.appendChild(card);
    });

    chatBox.appendChild(wrap);
  }
  //msg.glossary.forEach((item) => {
  //const card = document.createElement("div");
  //card.className = "info-card glossary-card";

  //const term = item.term.replace(/_/g, " ");

  //card.innerHTML = `
   // <h3>📘 ${term}</h3>
  //  <p class="glossary-definition">${item.definition}</p>
 // `;

  //wrap.appendChild(card);
 // });


  /* Next Question */
 if (msg.nextQuestion) {
  const label = msg.nextQuestion
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  addMessage("bot", `<strong>Next:</strong> ${label}`);
}
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =====================================================
   HISTORY SIDEBAR
===================================================== */
function renderHistoryList() {
  historyBox.innerHTML = "";

  const searchInput = document.getElementById("searchChats");
  const query = searchInput ? searchInput.value.toLowerCase() : "";

  if (allChats.length === 0) {
    historyBox.innerHTML = "<p style='color:white'>No chats yet</p>";
    return;
  }

  const sorted = [...allChats].sort((a, b) => b.pinned - a.pinned);

  sorted
    .filter((chat) => chat.title.toLowerCase().includes(query))
    .forEach((chat) => {
      const item = document.createElement("div");
      item.className = "history-item";

      item.innerHTML = `
        <div>
          <strong>${chat.pinned ? "📌 " : ""}${chat.title}</strong>
        </div>

        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
          <button onclick="event.stopPropagation(); renameChat(${chat.id})">✏️</button>
          <button onclick="event.stopPropagation(); deleteChat(${chat.id})">🗑️</button>
          <button onclick="event.stopPropagation(); pinChat(${chat.id})">📌</button>
        </div>
      `;

      item.onclick = () => loadChat(chat.id);
      historyBox.appendChild(item);
    });
}

function loadChat(id) {
  currentChatId = id;
  renderCurrentChat();
}

function deleteChat(id) {
  const chat = allChats.find((c) => c.id === id);
  if (!chat) return;

  const overlay = document.createElement("div");
  overlay.className = "rename-overlay";

  overlay.innerHTML = `
    <div class="rename-modal delete-modal">
      <h2>Delete chat?</h2>
      <p class="delete-text">
        This will permanently delete <strong>${chat.title}</strong>.
      </p>

      <div class="rename-actions">
        <button class="cancel-btn">Cancel</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cancelBtn = overlay.querySelector(".cancel-btn");
  const deleteBtn = overlay.querySelector(".delete-btn");

  cancelBtn.onclick = () => overlay.remove();

  deleteBtn.onclick = () => {
    allChats = allChats.filter((c) => c.id !== id);

    if (allChats.length === 0) {
      createNewChatSession();
    } else {
      currentChatId = allChats[0].id;
      renderCurrentChat();
    }

    saveAllChats();
    overlay.remove();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", esc);
    }
  });
}

function renameChat(id) {
  const chat = allChats.find((c) => c.id === id);
  if (!chat) return;

  const overlay = document.createElement("div");
  overlay.className = "rename-overlay";

  overlay.innerHTML = `
    <div class="rename-modal">
      <h2>Rename chat</h2>

      <input 
        type="text" 
        id="renameInput" 
        value="${chat.title}" 
        maxlength="40"
      >

      <div class="rename-actions">
        <button class="cancel-btn">Cancel</button>
        <button class="save-btn">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const inputBox = overlay.querySelector("#renameInput");
  const cancelBtn = overlay.querySelector(".cancel-btn");
  const saveBtn = overlay.querySelector(".save-btn");

  inputBox.focus();
  inputBox.select();

  cancelBtn.onclick = () => overlay.remove();

  saveBtn.onclick = () => {
    const newName = inputBox.value.trim();
    if (!newName) return;

    chat.title = newName;
    saveAllChats();
    overlay.remove();
  };

  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveBtn.click();
    if (e.key === "Escape") overlay.remove();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function pinChat(id) {
  const chat = allChats.find((c) => c.id === id);
  if (!chat) return;

  chat.pinned = !chat.pinned;
  saveAllChats();
}

function searchChats() {
  renderHistoryList();
}

function toggleHistory() {
  historyBox.classList.toggle("show");
}

/* =====================================================
   NEW CHAT
===================================================== */
function newChat() {
  createNewChatSession();
  input.value = "";
  input.focus();
}

/* =====================================================
   DOWNLOAD CHAT AS PDF

===================================================== */
function downloadChat() {
  const current = getCurrentChat();

  if (!current || current.messages.length === 0) {
    alert("No chat to download.");
    return;
  }

  if (!window.jspdf) {
    alert("jsPDF not loaded.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // auto width

  // =========================
  // PAGE BREAK
  // =========================
  function checkPage(space = 10) {
    if (y + space > pageHeight - 20) {
      addFooter();
      doc.addPage();
      y = 22;
    }
  }

  // =========================
  // FOOTER
  // =========================
  function addFooter() {
    const page = doc.getNumberOfPages();

    doc.setFontSize(8);
    doc.setTextColor(130);

    doc.text("Generated by Benefit Buddy", margin, pageHeight - 8);
    doc.text(`Page ${page}`, pageWidth - 28, pageHeight - 8);

    doc.setTextColor(0);
  }

  // =========================
  // WRAPPED TEXT
  // =========================
  function addWrapped(text, x = margin, size = 10) {
    doc.setFontSize(size);

    const maxWidth = contentWidth - (x - margin);
    const lines = doc.splitTextToSize(text, maxWidth);

    const lineHeight = 5.5;

    checkPage(lines.length * lineHeight);
    doc.text(lines, x, y);

    y += lines.length * lineHeight;
  }

  // =========================
  // SECTION BAR
  // =========================
  function section(title) {
    checkPage(14);

    doc.setFillColor(0, 48, 135);
    doc.roundedRect(margin, y - 4, contentWidth, 8, 2, 2, "F");

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 3, y + 1);

    doc.setTextColor(0);
    doc.setFont(undefined, "normal");

    y += 12;
  }

  // =========================
  // HEADER
  // =========================
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 135);
  doc.setFont(undefined, "bold");
  doc.text("Benefit Buddy Chat Report", margin, y);

  y += 10;

  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.setFont(undefined, "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

  y += 8;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  doc.setTextColor(0);

  // =========================
  // CONTENT
  // =========================
  current.messages.forEach((msg) => {
    const sender = msg.role === "user" ? "You" : "Benefit Buddy";

    section(sender);
    addWrapped(msg.content || "No message");

    // BENEFITS
    if (msg.benefits?.length > 0) {
      section("Suggested Benefits");

      msg.benefits.forEach((item) => {
        addWrapped(`• ${item.name}`, margin + 3, 10);
        addWrapped(`Reason: ${item.reason}`, margin + 3, 10);

        if (item.gov_url) {
          checkPage(8);

          const linkText = "Official Website";

          doc.setFontSize(9);
          doc.setTextColor(0, 0, 255);
          doc.textWithLink(linkText, margin + 8, y, {
            url: item.gov_url,
          });

          const w = doc.getTextWidth(linkText);
          doc.line(margin + 8, y + 1, margin + 8 + w, y + 1);

          doc.setTextColor(0);
          y += 7;
        }

        y += 3;
      });
    }

    // TERMS
    if (msg.glossary?.length > 0) {
      section("Helpful Terms");

      msg.glossary.forEach((term) => {
        const clean = term
          .replace(/_/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase());

        addWrapped(`• ${clean}`, margin + 3, 10);
        y += 1;
      });
    }

    // NEXT STEP
    if (msg.nextQuestion) {
      section("Next Step");

      const next = msg.nextQuestion
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

      addWrapped(next, margin + 3, 10);
    }

    y += 7;
  });

  addFooter();
  doc.save(`${current.title}.pdf`);
}
/* =====================================================
   ENTER KEY
===================================================== */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});