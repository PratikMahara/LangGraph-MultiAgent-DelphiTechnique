import * as z from "zod/v4";
/**
 * Percentile-based latency cutoffs. All specified cutoffs must be met for an endpoint to be preferred.
 */
export type PercentileLatencyCutoffs = {
    /**
     * Maximum p50 latency (seconds)
     */
    p50?: number | null | undefined;
    /**
     * Maximum p75 latency (seconds)
     */
    p75?: number | null | undefined;
    /**
     * Maximum p90 latency (seconds)
     */
    p90?: number | null | undefined;
    /**
     * Maximum p99 latency (seconds)
     */
    p99?: number | null | undefined;
};
/** @internal */
export type PercentileLatencyCutoffs$Outbound = {
    p50?: number | null | undefined;
    p75?: number | null | undefined;
    p90?: number | null | undefined;
    p99?: number | null | undefined;
};
/** @internal */
export declare const PercentileLatencyCutoffs$outboundSchema: z.ZodType<PercentileLatencyCutoffs$Outbound, PercentileLatencyCutoffs>;
export declare function percentileLatencyCutoffsToJSON(percentileLatencyCutoffs: PercentileLatencyCutoffs): string;
//# sourceMappingURL=percentilelatencycutoffs.d.ts.map