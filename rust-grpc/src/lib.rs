use wasm_bindgen::prelude::*;
use web_sys::{WebSocket, MessageEvent};
use js_sys::Function;

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
        let onmessage = Closure::wrap(Box::new(move |e: MessageEvent| {
            let _ = callback.call1(&JsValue::NULL, &e.data());
        }) as Box<dyn FnMut(MessageEvent)>);
        
        self.ws.set_onmessage(Some(onmessage.as_ref().unchecked_ref()));
        self._onmessage_callback = Some(onmessage);
    }

    pub fn send(&self, message: &str) -> Result<(), JsValue> {
        self.ws.send_with_str(message)
    }
}

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    Ok(())
}