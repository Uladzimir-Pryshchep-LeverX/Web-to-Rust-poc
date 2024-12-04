### First time setup. Need to have `protoc` and Rust installed. (I can miss something as fill it at the end)
- in 'rust-grpc' folder (need to have `protoc` and Rust installed):
  - `cargo build`
- in 'web-grpc' folder:
  - `npm install`

### WASM RUST WebSocket
- `wasm-pack build --target web` to build the wasm module 
- `npm run dev` from 'web-grpc' folder to run the web client


### Server proto GRPC (doesn't work in 'wasm' branch)
- `cargo run --bin server-stream` from 'rust-grpc' folder to run Rust server
- `envoy -c envoy.yaml` from 'web-grpc' folder to run the proxy
- `npm run dev` from 'web-grpc' folder to run the web client

### WebSocket (wrapped in WASM in 'wasm' branch)
- `cargo run --bin websocket-server` from 'rust-grpc' folder to run the Rust WebSocket server
- `npm run dev` from 'web-grpc' folder to run the web client

### Duplex proto GRPC
- Unfortunatelly, no sense to run it, as GRPC-Web is not implemented Bi-directional streaming yet (here is their [roadmap](https://github.com/grpc/grpc-web/blob/master/doc/streaming-roadmap.md))

### Dev Utils
- to generate the typescript client files from proto config:
  - `protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=src/proto-server \
    --proto_path=../proto \
    ../proto/stream-server.proto`
