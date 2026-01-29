/**
 * A push-based event broadcaster that supports multiple concurrent consumers.
 * Similar to ReusableReadableStream but for push-based events from tool execution.
 *
 * Each consumer gets their own position in the buffer and receives all events
 * from their join point onward. This enables real-time streaming of generator
 * tool preliminary results to multiple consumers simultaneously.
 *
 * @template T - The event type being broadcast
 */
export declare class ToolEventBroadcaster<T> {
    private buffer;
    private consumers;
    private nextConsumerId;
    private isComplete;
    private completionError;
    /**
     * Push a new event to all consumers.
     * Events are buffered so late-joining consumers can catch up.
     */
    push(event: T): void;
    /**
     * Mark the broadcaster as complete - no more events will be pushed.
     * Optionally pass an error to signal failure to all consumers.
     * Cleans up buffer and consumers after completion.
     */
    complete(error?: Error): void;
    /**
     * Clean up resources after all consumers have finished.
     * Called automatically after complete(), but can be called manually.
     */
    private cleanup;
    /**
     * Create a new consumer that can independently iterate over events.
     * Consumers can join at any time and will receive events from position 0.
     * Multiple consumers can be created and will all receive the same events.
     */
    createConsumer(): AsyncIterableIterator<T>;
    /**
     * Notify all waiting consumers that new data is available or stream completed
     */
    private notifyWaitingConsumers;
}
//# sourceMappingURL=tool-event-broadcaster.d.ts.map