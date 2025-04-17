const chatbox = document.getElementById('chatbox');

async function sendMessage() {
  const input = document.getElementById('userInput');
  const userMessage = input.value;
  if (!userMessage) return;

  // Shfaq mesazhin e përdoruesit
  chatbox.innerHTML += `<p><strong>Ti:</strong> ${userMessage}</p>`;
  input.value = '';

  // Thirr API-në
  const response = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await response.json();
  const aiResponse = data.reply;

  chatbox.innerHTML += `<p><strong>AI:</strong> ${aiResponse}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}
