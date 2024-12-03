let ws: WebSocket | null = null;
let messageCounter = 0;

function startWebSocket() {
    const responseDiv = document.getElementById('response');
    if (responseDiv) {
        responseDiv.innerText = 'Starting WebSocket connection...\n';
    }

    ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {
        console.log('WebSocket server connected...');
        if (responseDiv) {
            responseDiv.innerText += 'WebSocket server connected...\n';
        }
        const message = {
            message_type: "chat", 
            content: "Message from Web client"
        };
        ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
        console.log('Received:', event.data);
        if (responseDiv) {
            responseDiv.innerText += `Received: ${event.data}\n`;
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (responseDiv) {
            responseDiv.innerText += `WebSocket error: ${error}\n`;
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        if (responseDiv) {
            responseDiv.innerText += 'Disconnected from WebSocket server\n';
        }
        ws = null;
    };
}

function sendWebSocketMessage() {
    const responseDiv = document.getElementById('response');
    if (!ws) {
        console.error('WebSocket is not connected');
        if (responseDiv) {
            responseDiv.innerText += 'WebSocket is not connected\n';
        }
        return;
    }

    messageCounter++;
    const message = {
        message_type: "chat",
        content: `Client message #${messageCounter}`
    };
    ws.send(JSON.stringify(message));
    if (responseDiv) {
        responseDiv.innerText += `Sent: ${JSON.stringify(message)}\n`;
    }
}

function clearResponse() {
    const responseDiv = document.getElementById('response');
    if (responseDiv) {
        responseDiv.innerText = '';
    }
}

(window as any).startWebSocket = startWebSocket;
(window as any).sendWebSocketMessage = sendWebSocketMessage;
(window as any).clearResponse = clearResponse;