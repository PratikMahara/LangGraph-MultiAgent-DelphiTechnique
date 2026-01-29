//#region src/tools/webSearch.ts
/**
* Creates a web search tool that gives Claude direct access to real-time web content,
* allowing it to answer questions with up-to-date information beyond its knowledge cutoff.
* Claude automatically cites sources from search results as part of its answer.
*
* @see {@link https://docs.anthropic.com/en/docs/build-with-claude/tool-use/web-search-tool | Anthropic Web Search Documentation}
* @param options - Configuration options for the web search tool
* @returns A web search tool definition to be passed to the Anthropic API
*
* @example
* ```typescript
* import { ChatAnthropic, tools } from "@langchain/anthropic";
*
* const model = new ChatAnthropic({
*   model: "claude-sonnet-4-5-20250929",
* });
*
* // Basic usage
* const response = await model.invoke("What is the weather in NYC?", {
*   tools: [tools.webSearch_20250305()],
* });
*
* // With options
* const responseWithOptions = await model.invoke("Latest news about AI?", {
*   tools: [tools.webSearch_20250305({
*     maxUses: 5,
*     allowedDomains: ["reuters.com", "bbc.com"],
*     userLocation: {
*       type: "approximate",
*       city: "San Francisco",
*       region: "California",
*       country: "US",
*       timezone: "America/Los_Angeles",
*     },
*   })],
* });
* ```
*/
function webSearch_20250305(options) {
	return {
		type: "web_search_20250305",
		name: "web_search",
		max_uses: options?.maxUses,
		allowed_domains: options?.allowedDomains,
		blocked_domains: options?.blockedDomains,
		cache_control: options?.cacheControl,
		defer_loading: options?.deferLoading,
		strict: options?.strict,
		user_location: options?.userLocation
	};
}

//#endregion
export { webSearch_20250305 };
//# sourceMappingURL=webSearch.js.map