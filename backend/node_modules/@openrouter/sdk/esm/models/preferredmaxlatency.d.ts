import * as z from "zod/v4";
import { PercentileLatencyCutoffs, PercentileLatencyCutoffs$Outbound } from "./percentilelatencycutoffs.js";
/**
 * Preferred maximum latency (in seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. Endpoints above the threshold(s) may still be used, but are deprioritized in routing. When using fallback models, this may cause a fallback model to be used instead of the primary model if it meets the threshold.
 */
export type PreferredMaxLatency = number | PercentileLatencyCutoffs | any;
/** @internal */
export type PreferredMaxLatency$Outbound = number | PercentileLatencyCutoffs$Outbound | any;
/** @internal */
export declare const PreferredMaxLatency$outboundSchema: z.ZodType<PreferredMaxLatency$Outbound, PreferredMaxLatency>;
export declare function preferredMaxLatencyToJSON(preferredMaxLatency: PreferredMaxLatency): string;
//# sourceMappingURL=preferredmaxlatency.d.ts.map