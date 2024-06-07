document.getElementById("file-input").addEventListener("change", function() {
    sendFile();
});

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();
    
    if (message !== "") {
        addTextMessage(message, "sender");
        messageInput.value = "";
        scrollToBottom();
        
        setTimeout(function() {
            addTextMessage("Iremos atender.", "receiver");
            scrollToBottom();
        }, 1000); // Resposta automática após 1 segundo
    } else {
        sendFile();
    }
}

document.getElementById('attach-button').onclick = function() {
    document.getElementById('file-input').click();
};

function sendFile() {
    var fileInput = document.getElementById("file-input");
    var file = fileInput.files[0];
    
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            addImageMessage(e.target.result, "sender");
            scrollToBottom();
        };
    }
}

function addTextMessage(message, type) {
    var chatMessages = document.getElementById("chat-messages");
    var messageElement = document.createElement("div");
    var avatar = document.createElement("div");
    var text = document.createElement("div");
    
    messageElement.classList.add("message", type);
    avatar.classList.add("avatar");
    text.classList.add("message-text");
    text.textContent = message;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(text);
    chatMessages.appendChild(messageElement);
}

function addImageMessage(imageData, type) {
    var chatMessages = document.getElementById("chat-messages");
    var messageElement = document.createElement("div");
    var avatar = document.createElement("div");
    var image = document.createElement("img");
    
    messageElement.classList.add("message", type);
    avatar.classList.add("avatar");
    image.classList.add("preview-image");
    
    if (type === "sender") {
        image.src = imageData;
    } else {
        image.src = "receiver-avatar.jpg"; // Adicione um avatar para o destinatário aqui
    }
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(image);
    chatMessages.appendChild(messageElement);
}

function scrollToBottom() {
    var chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
}