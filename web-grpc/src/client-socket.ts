import init, { WasmSocket } from '../../rust-grpc/pkg/rust_grpc.js';

let wasmWs: WasmSocket | null = null;
const responseDiv = document.getElementById('response');

async function startWasmWebSocket() {
    try {
        await init();

        const ws = new WasmSocket('ws://localhost:8081');

        console.log('WASM initialized');
        if (responseDiv) {
          responseDiv.innerText += 'WASM initialized\n';
        }

        ws.set_onmessage((data: any) => {
            console.log('Raw WebSocket message received:', data);
            try {
                const messageText = typeof data === 'string' ? data : data.toString();
                const message = JSON.parse(messageText);
                
                if (message.message_type === "response") {
                    console.log('Received WASM response:', message.content);
                    if (responseDiv) {
                        responseDiv.innerText += `WASM Response: ${message.content}\n`;
                    }
                } else if (message.message_type === "system") {
                    console.log('System message:', message.content);
                    if (responseDiv) {
                        responseDiv.innerText += `System: ${message.content}\n`;
                    }
                }
            } catch (error) {
                console.error('Error parsing message:', error, 'Raw data:', data);
                if (responseDiv) {
                    responseDiv.innerText += `Error parsing message: ${error}\n`;
                }
            }
        });

        wasmWs = ws;
    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        if (responseDiv) {
            responseDiv.innerText += `Failed to initialize WebSocket: ${error}\n`;
        }
    }
}

function sendWebSocketMessage() {
    if (!wasmWs) {
        console.error('WebSocket is not initialized');
        return;
    }

    const message = {
        message_type: "chat",
        content: "Hello from JS"
    };
    
    try {
        const messageStr = JSON.stringify(message);
        console.log('Sending message:', messageStr);
        if (responseDiv) {
            responseDiv.innerText += `Sending message: ${message.content}\n`;
        }
        wasmWs.send(messageStr);
    } catch (error) {
        console.error('Failed to send message:', error);
        if (responseDiv) {
            responseDiv.innerText += `Failed to send message: ${error}\n`;
        }
    }
}

(window as any).startWebSocket = startWasmWebSocket;
(window as any).sendWebSocketMessage = sendWebSocketMessage;