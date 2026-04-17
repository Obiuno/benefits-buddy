let chatHistory = [];
  if (chatBox.querySelector('.welcome-title')) chatBox.innerHTML = '';

  addMessage('user', text);
  chatHistory.push({ role:'user', content:text, timestamp:new Date().toISOString() });
  input.value = '';

  const loading = addMessage('bot', 'Typing...');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();
    loading.remove();
    renderAssistantResponse(data);
    chatHistory.push({ role:'assistant', content:data, timestamp:new Date().toISOString() });
  } catch (err) {
    loading.remove();
    addMessage('bot', 'Sorry, something went wrong.');
  }
}

function renderAssistantResponse(data) {
  addMessage('bot', data.message || 'No response.');

  if (data.benefits_suggested?.length) {
    const wrap = document.createElement('div');
    wrap.className = 'benefit-results';

    data.benefits_suggested.forEach(item => {
      wrap.innerHTML += `
        <div class="benefit-mini-card">
          <h3>${item.name}</h3>
          <p>${item.reason}</p>
          <a href="${item.gov_url}" target="_blank">Apply / Learn More</a>
        </div>`;
    });
    chatBox.appendChild(wrap);
  }

  if (data.glossary_terms?.length) {
    addMessage('bot', '<strong>Helpful Terms:</strong> ' + data.glossary_terms.join(', '));
  }

  if (data.next_question) {
    addMessage('bot', '<strong>Next Question:</strong><br>' + data.next_question);
  }
}

function newChat(){
  chatHistory = [];
  chatBox.innerHTML = `<div class="welcome-title"><h1>Hello 👋 I am Benefit Buddy</h1><h2>How can I assist you today?</h2></div>`;
  input.value='';
}

function toggleHistory(){
 document.getElementById('historyBox').classList.toggle('show');
}

input.addEventListener('keydown', e => {
 if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});