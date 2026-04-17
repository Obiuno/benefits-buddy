
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

let chatHistory = [];

/*ADD MESSAGE TO CHAT*/

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
/*send message*/
async function sendMessage() {
  const text = input.value.trim();

  if (!text) return;


  const welcome = chatBox.querySelector(".welcome-title");
  if (welcome) welcome.remove();


  addMessage("user", text);

  chatHistory.push({
    role: "user",
    content: text,
    timestamp: new Date().toISOString()
  });

  input.value = "";


  const loading = addMessage("bot", "Typing...");

  try {
    const response = await fetch("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: chatHistory
      })
    });

    const data = await response.json();

    loading.remove();

    renderAssistantResponse(data);

    chatHistory.push({
      role: "assistant",
      content: data.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(error);
    loading.remove();
    addMessage("bot", "❌ Server error. Make sure backend is running.");
  }
}

/*Render bot response*/
// 
function renderAssistantResponse(data) {
  addMessage("bot", data.message || "No response.");

  // benefits cards
  if (data.benefits_suggested && data.benefits_suggested.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "benefit-results";

    data.benefits_suggested.forEach(item => {
      const card = document.createElement("div");
      card.className = "benefit-mini-card";

      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.reason}</p>
        <a href="${item.gov_url}" target="_blank">Apply / Learn More</a>
      `;

      wrap.appendChild(card);
    });

    chatBox.appendChild(wrap);
  }

  
  if (data.glossary_terms && data.glossary_terms.length > 0) {
    addMessage(
      "bot",
      "<strong>Helpful Terms:</strong><br>" +
        data.glossary_terms.join(", ")
    );
  }

  if (data.next_question) {
    addMessage(
      "bot",
      "<strong>Next Question:</strong><br>" +
        data.next_question
    );
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

/*NEW CHAT*/
function newChat() {
  chatHistory = [];

  chatBox.innerHTML = `
    <div class="welcome-title">
      <h1>Hello 👋 I am Benefit Buddy</h1>
      <h2>How can I assist you today?</h2>
    </div>
  `;

  input.value = "";
}


function toggleHistory() {
  const history = document.getElementById("historyBox");
  if (history) history.classList.toggle("show");
}


input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});