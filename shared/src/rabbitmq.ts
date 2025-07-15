import amqp, { Channel, Connection, Message } from "amqplib";

let channel: Channel;
let connection: Connection | any;

const RABBITMQ_URL: string = process.env.RABBITMQ_URL || "amqp://admin:admin@rabbitmq:5672";

const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ");
    } catch (err) {
        const error = err as Error;
        console.error("❌ RabbitMQ connection failed:", error.message);
        process.exit(1);
    }
};

const publishToQueue = async (queue: string, data: unknown): Promise<void> => {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        });
    } catch (err) {
        const error = err as Error;
        console.error("❌ Failed to publish:", error.message);
    }
};

const consumeFromQueue = async (queue: string, callback: (content: any) => void): Promise<void> => {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg: Message | null) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                channel.ack(msg);
            }
        });
    } catch (err) {
        const error = err as Error;
        console.error("❌ Consumer failed:", error.message);
    }
};

export {
    connectRabbitMQ,
    publishToQueue,
    consumeFromQueue,
};
