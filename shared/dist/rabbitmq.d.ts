declare const connectRabbitMQ: () => Promise<void>;
declare const publishToQueue: (queue: string, data: unknown) => Promise<void>;
declare const consumeFromQueue: (queue: string, callback: (content: any) => void) => Promise<void>;
export { connectRabbitMQ, publishToQueue, consumeFromQueue, };
