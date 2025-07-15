"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeFromQueue = exports.publishToQueue = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
let connection;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://admin:admin@rabbitmq:5672";
const connectRabbitMQ = async () => {
    try {
        connection = await amqplib_1.default.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ");
    }
    catch (err) {
        const error = err;
        console.error("❌ RabbitMQ connection failed:", error.message);
        process.exit(1);
    }
};
exports.connectRabbitMQ = connectRabbitMQ;
const publishToQueue = async (queue, data) => {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        });
    }
    catch (err) {
        const error = err;
        console.error("❌ Failed to publish:", error.message);
    }
};
exports.publishToQueue = publishToQueue;
const consumeFromQueue = async (queue, callback) => {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                channel.ack(msg);
            }
        });
    }
    catch (err) {
        const error = err;
        console.error("❌ Consumer failed:", error.message);
    }
};
exports.consumeFromQueue = consumeFromQueue;
