import { StreamerClient } from './proto-duplex/stream-duplex.client';
import { Message } from './proto-duplex/stream-duplex';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

// Initialize the transport
const transport = new GrpcWebFetchTransport({
    baseUrl: 'http://localhost:8080',
});

// Initialize the client
const client = new StreamerClient(transport);

// Function to start bidirectional streaming
async function startBiStream() {
    try {
        // Create a new message
        const message: Message = {
            content: 'Hello from TypeScript client!'
        };

        // Create stream
        const stream = client.biStream();

        // Handle the stream
        for await (const response of client.biStream().responses) {
            console.log('Received:', response.content);
            const responseDiv = document.getElementById('response');
            if (responseDiv) {
                responseDiv.innerText += `Received: ${response.content}\n`;
            }
        }

        // Send a message
        await stream.requests.send(message);

        // Close the stream when done
        await stream.requests.complete();

    } catch (error) {
        console.error('Error:', error);
        const responseDiv = document.getElementById('response');
        if (responseDiv) {
            responseDiv.innerText = `Error: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
}

// Export for use in HTML
(window as any).startBiStream = startBiStream;
