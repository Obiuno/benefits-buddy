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
    minute: "2-digit"
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
    messages: []
  };

  allChats.unshift(chat);
  currentChatId = chat.id;

  saveAllChats();
  renderCurrentChat();
}

function getCurrentChat() {
  return allChats.find(chat => chat.id === currentChatId);
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

  current.messages.forEach(msg => {
    addMessage(
      msg.role === "user" ? "user" : "bot",
      msg.content,
      msg.time
    );
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =====================================================
   MESSAGE BUBBLES
===================================================== */
function addMessage(sender, text, time = getTime()) {
  const row = document.createElement("div");
  row.className = `chat-row ${sender}`;

  row.innerHTML = `
    <div class="avatar">
      ${sender === "user" ? "🧑" : "🤖"}
    </div>

    <div class="msg ${sender}">
      <div>${text}</div>
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
    time: getTime()
  };

  current.messages.push(userMsg);
  saveAllChats();
  renderCurrentChat();

  input.value = "";
  input.disabled = true;

  const loading = addTyping();

  try {
    const response = await fetch("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: current.messages
      })
    });

    const data = await response.json();

    loading.remove();

    renderAssistantResponse(data);

    current.messages.push({
      role: "assistant",
      content: data.message || "No response.",
      time: getTime()
    });

    saveAllChats();

  } catch (error) {
    console.error(error);

    loading.remove();
    addMessage("bot", "❌ Server error.");

    current.messages.push({
      role: "assistant",
      content: "❌ Server error.",
      time: getTime()
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
function renderAssistantResponse(data) {
  addMessage("bot", data.message || "No response.");

  /* Benefits Cards */
  if (data.benefits_suggested?.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "cards-wrap";

    data.benefits_suggested.forEach(item => {
      const card = document.createElement("div");
      card.className = "info-card";

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
  if (data.glossary_terms?.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "cards-wrap";

    data.glossary_terms.forEach(term => {
      const card = document.createElement("div");
      card.className = "info-card glossary-card";

      card.innerHTML = `
        <h3>📘 Helpful Term</h3>
        <p>${term}</p>
      `;

      wrap.appendChild(card);
    });

    chatBox.appendChild(wrap);
  }

  /* Next Question */
  if (data.next_question) {
    addMessage("bot", `<strong>Next:</strong> ${data.next_question}`);
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
    .filter(chat =>
      chat.title.toLowerCase().includes(query)
    )
    .forEach(chat => {
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
  const chat = allChats.find(c => c.id === id);
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
    allChats = allChats.filter(c => c.id !== id);

    if (allChats.length === 0) {
      createNewChatSession();
    } else {
      currentChatId = allChats[0].id;
      renderCurrentChat();
    }

    saveAllChats();
    overlay.remove();
  };

  overlay.addEventListener("click", e => {
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
  const chat = allChats.find(c => c.id === id);
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

  inputBox.addEventListener("keydown", e => {
    if (e.key === "Enter") saveBtn.click();
    if (e.key === "Escape") overlay.remove();
  });

  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.remove();
  });
}

function pinChat(id) {
  const chat = allChats.find(c => c.id === id);
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

  doc.setFontSize(18);
  doc.text("Benefit Buddy Chat", 14, y);

  y += 12;
  doc.setFontSize(11);

  current.messages.forEach(msg => {
    const sender = msg.role === "user" ? "You" : "Benefit Buddy";
    const line = `[${msg.time}] ${sender}: ${msg.content}`;

    const lines = doc.splitTextToSize(line, 180);

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, 14, y);
    y += lines.length * 7;
  });

  doc.save(`${current.title}.pdf`);
}

/* =====================================================
   ENTER KEY
===================================================== */
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});