import * as z from "zod/v4";
/**
 * Percentile-based throughput cutoffs. All specified cutoffs must be met for an endpoint to be preferred.
 */
export type PercentileThroughputCutoffs = {
    /**
     * Minimum p50 throughput (tokens/sec)
     */
    p50?: number | null | undefined;
    /**
     * Minimum p75 throughput (tokens/sec)
     */
    p75?: number | null | undefined;
    /**
     * Minimum p90 throughput (tokens/sec)
     */
    p90?: number | null | undefined;
    /**
     * Minimum p99 throughput (tokens/sec)
     */
    p99?: number | null | undefined;
};
/** @internal */
export type PercentileThroughputCutoffs$Outbound = {
    p50?: number | null | undefined;
    p75?: number | null | undefined;
    p90?: number | null | undefined;
    p99?: number | null | undefined;
};
/** @internal */
export declare const PercentileThroughputCutoffs$outboundSchema: z.ZodType<PercentileThroughputCutoffs$Outbound, PercentileThroughputCutoffs>;
export declare function percentileThroughputCutoffsToJSON(percentileThroughputCutoffs: PercentileThroughputCutoffs): string;
//# sourceMappingURL=percentilethroughputcutoffs.d.ts.map