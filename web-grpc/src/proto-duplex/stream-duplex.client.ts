// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "stream-duplex.proto" (package "stream", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Streamer } from "./stream-duplex";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Message } from "./stream-duplex";
import type { DuplexStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service stream.Streamer
 */
export interface IStreamerClient {
    /**
     * @generated from protobuf rpc: BiStream(stream stream.Message) returns (stream stream.Message);
     */
    biStream(options?: RpcOptions): DuplexStreamingCall<Message, Message>;
}
/**
 * @generated from protobuf service stream.Streamer
 */
export class StreamerClient implements IStreamerClient, ServiceInfo {
    typeName = Streamer.typeName;
    methods = Streamer.methods;
    options = Streamer.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: BiStream(stream stream.Message) returns (stream stream.Message);
     */
    biStream(options?: RpcOptions): DuplexStreamingCall<Message, Message> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Message, Message>("duplex", this._transport, method, opt);
    }
}
