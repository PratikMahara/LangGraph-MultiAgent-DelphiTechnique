import * as z from "zod/v4";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdkvalidationerror.js";
/**
 * Latency percentiles in milliseconds over the last 30 minutes. Latency measures time to first token. Only visible when authenticated with an API key or cookie; returns null for unauthenticated requests.
 */
export type PercentileStats = {
    /**
     * Median (50th percentile)
     */
    p50: number;
    /**
     * 75th percentile
     */
    p75: number;
    /**
     * 90th percentile
     */
    p90: number;
    /**
     * 99th percentile
     */
    p99: number;
};
/** @internal */
export declare const PercentileStats$inboundSchema: z.ZodType<PercentileStats, unknown>;
export declare function percentileStatsFromJSON(jsonString: string): SafeParseResult<PercentileStats, SDKValidationError>;
//# sourceMappingURL=percentilestats.d.ts.map