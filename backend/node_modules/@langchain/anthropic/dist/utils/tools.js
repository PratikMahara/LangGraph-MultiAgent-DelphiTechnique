import * as z$1 from "zod/v4";

//#region src/utils/tools.ts
function handleToolChoice(toolChoice) {
	if (!toolChoice) return void 0;
	else if (toolChoice === "any") return { type: "any" };
	else if (toolChoice === "auto") return { type: "auto" };
	else if (toolChoice === "none") return { type: "none" };
	else if (typeof toolChoice === "string") return {
		type: "tool",
		name: toolChoice
	};
	else return toolChoice;
}
const AnthropicToolExtrasSchema = z$1.object({
	cache_control: z$1.custom().optional().nullable(),
	defer_loading: z$1.boolean().optional(),
	input_examples: z$1.array(z$1.unknown()).optional(),
	allowed_callers: z$1.array(z$1.unknown()).optional()
});
/**
* Mapping of Anthropic tool types to their required beta feature flags.
*
* This constant defines which beta header is needed for specific tool types
* when making requests to the Anthropic API. Beta features are experimental
* capabilities that may change or be removed.
*/
const ANTHROPIC_TOOL_BETAS = {
	tool_search_tool_regex_20251119: "advanced-tool-use-2025-11-20",
	tool_search_tool_bm25_20251119: "advanced-tool-use-2025-11-20",
	memory_20250818: "context-management-2025-06-27",
	web_fetch_20250910: "web-fetch-2025-09-10",
	code_execution_20250825: "code-execution-2025-08-25",
	computer_20251124: "computer-use-2025-11-24",
	computer_20250124: "computer-use-2025-01-24",
	mcp_toolset: "mcp-client-2025-11-20"
};

//#endregion
export { ANTHROPIC_TOOL_BETAS, AnthropicToolExtrasSchema, handleToolChoice };
//# sourceMappingURL=tools.js.map