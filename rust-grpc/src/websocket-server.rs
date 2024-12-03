use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;

#[derive(Serialize, Deserialize, Debug)]
struct CustomMessage {
    message_type: String,
    content: String,
}

async fn handle_connection(stream: TcpStream) {
    let ws_stream = accept_async(stream)
        .await
        .expect("Failed to accept WebSocket connection");
    println!("New WebSocket connection established");

    let (mut write, mut read) = ws_stream.split();

    while let Some(msg) = read.next().await {
        let message = match msg {
            Ok(msg) => msg,
            Err(e) => {
                println!("Error receiving message: {}", e);
                break;
            }
        };

        if !message.is_text() {
            continue;
        }

        let text = match message.into_text() {
            Ok(text) => text,
            Err(_) => continue,
        };

        let custom_msg = match serde_json::from_str::<CustomMessage>(&text) {
            Ok(msg) => msg,
            Err(_) => continue,
        };

        println!("Received message: {:?}", custom_msg);

        for i in 0..2 {
            let response = CustomMessage {
                message_type: "response".to_string(),
                content: format!("Rust Response {} to: {}", i + 1, custom_msg.content),
            };

            let response_str = match serde_json::to_string(&response) {
                Ok(str) => str,
                Err(_) => continue,
            };

            if let Err(e) = write.send(Message::Text(response_str)).await {
                println!("Error sending message: {}", e);
                break;
            }

            // Add 500ms delay between messages
            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        }
    }

    println!("WebSocket connection closed");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:8081";
    let listener = TcpListener::bind(addr).await?;
    println!("WebSocket server listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }

    Ok(())
}
