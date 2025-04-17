document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const inputField = document.getElementById("chatbot-input");
    const messagesContainer = document.getElementById("chatbot-messages");
    const sendBtn = document.getElementById("send-btn");

    // Toggle chat window
    toggleBtn.addEventListener("click", () => {
        const isVisible = chatbotWindow.style.display === "flex";
        chatbotWindow.style.display = isVisible ? "none" : "flex";
        if (!isVisible) inputField.focus();
    });

    // Message handling system
    function addMessage(text, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handle message sending
    async function sendMessage() {
        const userMessage = inputField.value.trim();
        if (!userMessage) return;

        // Clear input and disable during processing
        inputField.value = "";
        inputField.disabled = true;
        sendBtn.disabled = true;

        addMessage(userMessage, true);

        try {
            const response = await fetch("http://localhost:5000/ask-dostoevsky", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error("API request failed");
            
            const data = await response.json();
            addMessage(data.reply || "Nuk mundem të jap një përgjigje në këtë çast.", false);
        } catch (error) {
            addMessage("Gabim në lidhje me serverin. Ju lutem provoni përsëri.", false);
        } finally {
            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();
        }
    }

    // Event listeners
    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Initial bot message
    setTimeout(() => {
        addMessage("Përshëndetje! Unë jam asistenti virtual për Fjodor Dostoevskin. Çfarë dëshironi të dini?", false);
    }, 1000);
});