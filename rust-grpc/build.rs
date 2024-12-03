fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("../proto/stream-server.proto")?;
    tonic_build::compile_protos("../proto/stream-duplex.proto")?;
    Ok(())
}
