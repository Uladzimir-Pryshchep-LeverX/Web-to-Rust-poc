const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        try {
            const messageStr = message.toString();
            console.log('Received:', messageStr);
            
            const parsedMessage = JSON.parse(messageStr);
            console.log('Parsed message:', parsedMessage);

            if (parsedMessage.message_type === "chat") {
                console.log('Processing chat message from JS client');
                ws.send(messageStr);
            } else if (parsedMessage.message_type === "response") {
                console.log('Received WASM response:', parsedMessage.content);
                ws.send(messageStr);
            }
            
        } catch (error) {
            console.error('Error processing message:', error);
            const errorResponse = {
                message_type: "error",
                content: "Invalid message format"
            };
            ws.send(JSON.stringify(errorResponse));
        }
    });

    const welcomeMessage = {
        message_type: "system",
        content: "Connected to WebSocket server"
    };
    ws.send(JSON.stringify(welcomeMessage));
});

console.log('WebSocket server running on ws://localhost:8081');