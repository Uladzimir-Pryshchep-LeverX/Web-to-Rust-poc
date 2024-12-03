import { StreamerClient } from './proto-server/stream-server.client';
import { Message } from './proto-server/stream-server';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

// Initialize the transport
const transport = new GrpcWebFetchTransport({
    baseUrl: 'http://localhost:50051',
    credentials: 'omit',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

// Initialize the client
const client = new StreamerClient(transport);

// Function to start server streaming
async function startServerStream() {
    try {
        // Create a new message
        const message: Message = {
            content: 'Message from Web Client'
        };

        const stream = client.serverStream(message);

        const responseDiv = document.getElementById('response');
        
        for await (const response of stream.responses) {
            console.log('Received:', response.content);
            if (responseDiv) {
                responseDiv.innerText += `Received: ${response.content}\n`;
            }
        }

    } catch (error) {
        console.error('Error:', error);
        const responseDiv = document.getElementById('response');
        if (responseDiv) {
            responseDiv.innerText = `Error: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
}

// Export for use in HTML
(window as any).startServerStream = startServerStream;