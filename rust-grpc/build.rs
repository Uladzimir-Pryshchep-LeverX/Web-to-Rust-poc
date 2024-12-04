fn main() -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(feature = "grpc")]
    {
        tonic_build::compile_protos("../proto/stream-server.proto")?;
        tonic_build::compile_protos("../proto/stream-duplex.proto")?;
    }
    
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=src/lib.rs");
    
    Ok(())
}
