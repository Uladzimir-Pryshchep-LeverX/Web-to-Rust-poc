import init, { WasmSocket } from '../../rust-grpc/pkg/rust_grpc.js';

let wasmWs: WasmSocket | null = null;

async function startWasmWebSocket() {
    try {
        await init();
        const ws = new WasmSocket('ws://localhost:8081');
        
        ws.set_onmessage((data: any) => {
            console.log('Received via WASM:', data);
            const responseDiv = document.getElementById('response');
            if (responseDiv) {
                responseDiv.innerText += `Received via WASM: ${data}\n`;
            }
        });

        wasmWs = ws;
        console.log('WASM WebSocket initialized');
    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
    }
}

function sendWebSocketMessage() {
    if (!wasmWs) {
        console.error('WebSocket is not initialized');
        return;
    }

    const message = {
        message_type: "chat",
        content: `Message from WASM WebSocket`
    };
    
    try {
        wasmWs.send(JSON.stringify(message));
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

(window as any).startWebSocket = startWasmWebSocket;
(window as any).sendWebSocketMessage = sendWebSocketMessage;