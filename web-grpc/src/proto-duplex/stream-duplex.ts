// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "stream-duplex.proto" (package "stream", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message stream.Message
 */
export interface Message {
    /**
     * @generated from protobuf field: string content = 1;
     */
    content: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Message$Type extends MessageType<Message> {
    constructor() {
        super("stream.Message", [
            { no: 1, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Message>): Message {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.content = "";
        if (value !== undefined)
            reflectionMergePartial<Message>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Message): Message {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string content */ 1:
                    message.content = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Message, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string content = 1; */
        if (message.content !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.content);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message stream.Message
 */
export const Message = new Message$Type();
/**
 * @generated ServiceType for protobuf service stream.Streamer
 */
export const Streamer = new ServiceType("stream.Streamer", [
    { name: "BiStream", serverStreaming: true, clientStreaming: true, options: {}, I: Message, O: Message }
]);
