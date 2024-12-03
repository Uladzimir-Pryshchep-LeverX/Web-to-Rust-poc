use tonic::{transport::Server, Request, Response, Status};
use tokio_stream::StreamExt;
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use stream::streamer_server::{Streamer, StreamerServer};
use stream::Message;

pub mod stream {
    tonic::include_proto!("stream");
}

#[derive(Debug, Default)]
pub struct MyStreamer {}

#[tonic::async_trait]
impl Streamer for MyStreamer {
    type BiStreamStream = ReceiverStream<Result<Message, Status>>;

    async fn bi_stream(
        &self,
        request: Request<tonic::Streaming<Message>>,
    ) -> Result<Response<Self::BiStreamStream>, Status> {
        let mut stream = request.into_inner();
        let (tx, rx) = mpsc::channel(4);

        tokio::spawn(async move {
            while let Some(result) = stream.next().await {
                match result {
                    Ok(msg) => {
                        println!("Received: {}", msg.content);
                        tx.send(Ok(Message {
                            content: format!("Echo: {}", msg.content),
                        }))
                        .await
                        .unwrap();
                    }
                    Err(e) => println!("Error receiving message: {:?}", e),
                }
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let streamer = MyStreamer::default();

    println!("Server listening on {}", addr);

    Server::builder()
        .add_service(StreamerServer::new(streamer))
        .serve(addr)
        .await?;

    Ok(())
}
