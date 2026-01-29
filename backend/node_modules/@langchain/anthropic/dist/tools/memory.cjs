const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_types = require('./types.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));

//#region src/tools/memory.ts
/**
* Creates an Anthropic memory tool that can be used with ChatAnthropic.
*
* The memory tool enables Claude to store and retrieve information across conversations
* through a memory file directory. Claude can create, read, update, and delete files that
* persist between sessions, allowing it to build knowledge over time without keeping
* everything in the context window.
*
* @example
* ```typescript
* import { ChatAnthropic, memory_20250818 } from "@langchain/anthropic";
*
* const llm = new ChatAnthropic({
*   model: "claude-sonnet-4-5-20250929"
* });
*
* const memory = memory_20250818({
*   execute: async (args) => {
*     // handle memory command execution
*     // ...
*   },
* });
* const llmWithMemory = llm.bindTools([memory]);
*
* const response = await llmWithMemory.invoke("Remember that I like Python");
* ```
*
* @param options - Optional configuration for the memory tool (currently unused)
* @param options.execute - Optional execute function that handles memory command execution.
* @returns The memory tool object that can be passed to `bindTools`
*
* @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool
*/
function memory_20250818(options) {
	const memoryTool = (0, __langchain_core_tools.tool)(options?.execute, {
		name: "memory",
		schema: require_types.Memory20250818CommandSchema
	});
	memoryTool.extras = {
		...memoryTool.extras ?? {},
		providerToolDefinition: {
			type: "memory_20250818",
			name: "memory"
		}
	};
	return memoryTool;
}

//#endregion
exports.memory_20250818 = memory_20250818;
//# sourceMappingURL=memory.cjs.map