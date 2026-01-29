import * as z from "zod/v4";
import { PercentileThroughputCutoffs, PercentileThroughputCutoffs$Outbound } from "./percentilethroughputcutoffs.js";
/**
 * Preferred minimum throughput (in tokens per second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. Endpoints below the threshold(s) may still be used, but are deprioritized in routing. When using fallback models, this may cause a fallback model to be used instead of the primary model if it meets the threshold.
 */
export type PreferredMinThroughput = number | PercentileThroughputCutoffs | any;
/** @internal */
export type PreferredMinThroughput$Outbound = number | PercentileThroughputCutoffs$Outbound | any;
/** @internal */
export declare const PreferredMinThroughput$outboundSchema: z.ZodType<PreferredMinThroughput$Outbound, PreferredMinThroughput>;
export declare function preferredMinThroughputToJSON(preferredMinThroughput: PreferredMinThroughput): string;
//# sourceMappingURL=preferredminthroughput.d.ts.map