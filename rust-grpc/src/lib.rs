use wasm_bindgen::prelude::*;
use web_sys::{WebSocket, MessageEvent, console};
use js_sys::Function;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CustomMessage {
    message_type: String,
    content: String,
}

#[wasm_bindgen]
pub struct WasmSocket {
    ws: WebSocket,
    _onmessage_callback: Option<Closure<dyn FnMut(MessageEvent)>>,
}

#[wasm_bindgen]
impl WasmSocket {
    #[wasm_bindgen(constructor)]
    pub fn new(url: &str) -> Result<WasmSocket, JsValue> {
        let ws = WebSocket::new(url)?;
        
        Ok(WasmSocket { 
            ws,
            _onmessage_callback: None,
        })
    }

    pub fn set_onmessage(&mut self, callback: Function) {
        let ws_clone = self.ws.clone();
        
        let onmessage = Closure::wrap(Box::new(move |e: MessageEvent| {
            let _ = callback.call1(&JsValue::NULL, &e.data());
            
            if let Some(text) = e.data().as_string() {
                match serde_json::from_str::<CustomMessage>(&text) {
                    Ok(received_msg) => {
                        if received_msg.message_type == "chat" {
                            let content = received_msg.content.clone();
                            
                            for i in 1..=2 {
                                let response = CustomMessage {
                                    message_type: "response".to_string(),
                                    content: format!("WASM Response {} to: {}", i, content),
                                };

                                match serde_json::to_string(&response) {
                                    Ok(response_str) => {
                                        if let Err(e) = ws_clone.send_with_str(&response_str) {
                                            console::error_1(&format!("Failed to send message: {:?}", e).into());
                                        }
                                    }
                                    Err(e) => console::error_1(&format!("Failed to serialize response: {:?}", e).into()),
                                }
                            }
                        }
                    }
                    Err(e) => {
                        console::error_2(
                            &"Failed to parse message:".into(),
                            &format!("Error: {:?}, Message: {}", e, text).into()
                        );
                    }
                }
            }
        }) as Box<dyn FnMut(MessageEvent)>);
        
        self.ws.set_onmessage(Some(onmessage.as_ref().unchecked_ref()));
        self._onmessage_callback = Some(onmessage);
    }

    pub fn send(&self, message: &str) -> Result<(), JsValue> {
        match self.ws.send_with_str(message) {
            Ok(_) => Ok(()),
            Err(e) => {
                console::error_1(&format!("Failed to send message: {:?}", e).into());
                Err(e)
            }
        }
    }
}

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    Ok(())
}