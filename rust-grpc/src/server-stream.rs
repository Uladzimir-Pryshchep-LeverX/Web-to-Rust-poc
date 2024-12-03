use tonic::{transport::Server, Request, Response, Status};
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use futures_core::Stream;
use std::pin::Pin;
use std::time::Duration;
use tower_http::cors::{CorsLayer, Any};
use tonic_web::GrpcWebLayer;

pub mod stream_server {
    tonic::include_proto!("stream_server");
}

use stream_server::streamer_server::{Streamer, StreamerServer};
use stream_server::Message;

#[derive(Debug, Default)]
pub struct MyStreamer {}

#[tonic::async_trait]
impl Streamer for MyStreamer {
    type ServerStreamStream = Pin<Box<dyn Stream<Item = Result<Message, Status>> + Send + Sync + 'static>>;

    async fn server_stream(
        &self,
        request: Request<Message>,
    ) -> Result<Response<Self::ServerStreamStream>, Status> {
        println!("Got a request: {:?}", request);

        let (tx, rx) = mpsc::channel(4);
        let message = request.into_inner();

        tokio::spawn(async move {
            for i in 0..5 {
                let reply = Message {
                    content: format!("RUST Reply {} to {}", i, message.content),
                };

                tx.send(Ok(reply))
                    .await
                    .unwrap();

                tokio::time::sleep(Duration::from_secs(1)).await;
            }
        });

        let stream = ReceiverStream::new(rx);
        Ok(Response::new(
            Box::pin(stream) as Self::ServerStreamStream
        ))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let streamer = MyStreamer::default();

    println!("Server listening on {}", addr);

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers(Any)
        .allow_methods(Any)
        .expose_headers(Any);

    Server::builder()
        .accept_http1(true)
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .add_service(StreamerServer::new(streamer))
        .serve(addr)
        .await?;

    Ok(())
}