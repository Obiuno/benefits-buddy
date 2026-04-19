let chatBox;
let input;
let historyBox;

let waitingForReply = false;
let allChats = [];
let currentChatId = null;

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  chatBox = document.getElementById("chatBox");
  input = document.getElementById("messageInput");
  historyBox = document.getElementById("historyBox");

  loadAllChats();

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

/* =====================================================
   USER MODE
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

  allChats = saved ? JSON.parse(saved) : [];

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
  if (!chatBox) return;

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
  if (!chatBox) return;

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
  if (!chatBox) return;

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
  if (waitingForReply || !input) return;

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
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: current.messages
      })
    });

    const data = await response.json();

    if (loading) loading.remove();

    renderAssistantResponse(data);

    current.messages.push({
      role: "assistant",
      content: data.message || "No response.",
      time: getTime()
    });

    saveAllChats();

  } catch (error) {
    console.error(error);

    if (loading) loading.remove();

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

  if (data.next_question) {
    addMessage("bot", `<strong>Next:</strong> ${data.next_question}`);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =====================================================
   HISTORY
===================================================== */
function renderHistoryList() {
  if (!historyBox) return;

  historyBox.innerHTML = "";

  if (allChats.length === 0) {
    historyBox.innerHTML = "<p style='color:white'>No chats yet</p>";
    return;
  }

  const sorted = [...allChats].sort((a, b) => b.pinned - a.pinned);

  sorted.forEach(chat => {
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
  allChats = allChats.filter(c => c.id !== id);

  if (allChats.length === 0) {
    createNewChatSession();
  } else {
    currentChatId = allChats[0].id;
    renderCurrentChat();
  }

  saveAllChats();
}

function renameChat(id) {
  const chat = allChats.find(c => c.id === id);
  if (!chat) return;

  const newName = prompt("Rename chat:", chat.title);
  if (!newName) return;

  chat.title = newName.trim();
  saveAllChats();
}

function pinChat(id) {
  const chat = allChats.find(c => c.id === id);
  if (!chat) return;

  chat.pinned = !chat.pinned;
  saveAllChats();
}

function toggleHistory() {
  if (historyBox) historyBox.classList.toggle("show");
}

/* =====================================================
   NEW CHAT
===================================================== */
function newChat() {
  createNewChatSession();

  if (input) {
    input.value = "";
    input.focus();
  }
}

/* =====================================================
   DOWNLOAD PDF
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