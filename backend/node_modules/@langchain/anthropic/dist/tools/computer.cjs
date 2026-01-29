const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_types = require('./types.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));

//#region src/tools/computer.ts
const TOOL_NAME = "computer";
/**
* Creates an Anthropic computer use tool for Claude Opus 4.5 that provides
* screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.
*
* The computer use tool enables Claude to interact with desktop environments through:
* - **Screenshot capture**: See what's currently displayed on screen
* - **Mouse control**: Click, drag, and move the cursor
* - **Keyboard input**: Type text and use keyboard shortcuts
* - **Zoom**: View specific screen regions at full resolution (when enabled)
*
* @warning Computer use is a beta feature with unique risks. Use a dedicated virtual machine
* or container with minimal privileges. Avoid giving access to sensitive data.
*
* @see {@link https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool | Anthropic Computer Use Documentation}
*
* @example
* ```typescript
* import { ChatAnthropic, tools } from "@langchain/anthropic";
*
* const llm = new ChatAnthropic({
*   model: "claude-opus-4-5-20251101",
*   clientOptions: {
*     defaultHeaders: {
*       "anthropic-beta": "computer-use-2025-11-24",
*     },
*   },
* });
*
* const computer = tools.computer_20251124({
*   displayWidthPx: 1024,
*   displayHeightPx: 768,
*   displayNumber: 1,
*   enableZoom: true,
*   execute: async (action) => {
*     if (action.action === "screenshot") {
*       // Capture and return base64-encoded screenshot
*       return captureScreenshot();
*     }
*     if (action.action === "left_click") {
*       // Click at the specified coordinates
*       await click(action.coordinate[0], action.coordinate[1]);
*       return captureScreenshot();
*     }
*     // Handle other actions...
*   },
* });
*
* const llmWithComputer = llm.bindTools([computer]);
* const response = await llmWithComputer.invoke(
*   "Save a picture of a cat to my desktop."
* );
* ```
*
* @param options - Configuration options for the computer use tool
* @returns The computer use tool object that can be passed to `bindTools`
*/
function computer_20251124(options) {
	const name = TOOL_NAME;
	const computerTool = (0, __langchain_core_tools.tool)(options.execute, {
		name,
		schema: require_types.Computer20251124ActionSchema
	});
	computerTool.extras = {
		...computerTool.extras ?? {},
		providerToolDefinition: {
			type: "computer_20251124",
			name,
			display_width_px: options.displayWidthPx,
			display_height_px: options.displayHeightPx,
			...options.displayNumber !== void 0 && { display_number: options.displayNumber },
			...options.enableZoom !== void 0 && { enable_zoom: options.enableZoom }
		}
	};
	return computerTool;
}
/**
* Creates an Anthropic computer use tool that provides screenshot capabilities and mouse/keyboard control
* for autonomous desktop interaction.
*
* Supported models: Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, and Sonnet 3.7 versions.
*
* The computer use tool enables Claude to interact with desktop environments through:
* - **Screenshot capture**: See what's currently displayed on screen
* - **Mouse control**: Click, drag, and move the cursor
* - **Keyboard input**: Type text and use keyboard shortcuts
*
* @warning Computer use is a beta feature with unique risks. Use a dedicated virtual machine
* or container with minimal privileges. Avoid giving access to sensitive data.
*
* @see {@link https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool | Anthropic Computer Use Documentation}
*
* @example
* ```typescript
* import { ChatAnthropic, tools } from "@langchain/anthropic";
*
* const llm = new ChatAnthropic({
*   model: "claude-sonnet-4-5-20250929",
*   clientOptions: {
*     defaultHeaders: {
*       "anthropic-beta": "computer-use-2025-01-24",
*     },
*   },
* });
*
* const computer = tools.computer_20250124({
*   displayWidthPx: 1024,
*   displayHeightPx: 768,
*   displayNumber: 1,
*   execute: async (action) => {
*     if (action.action === "screenshot") {
*       // Capture and return base64-encoded screenshot
*       return captureScreenshot();
*     }
*     if (action.action === "left_click") {
*       // Click at the specified coordinates
*       await click(action.coordinate[0], action.coordinate[1]);
*       return captureScreenshot();
*     }
*     // Handle other actions...
*   },
* });
*
* const llmWithComputer = llm.bindTools([computer]);
* const response = await llmWithComputer.invoke(
*   "Save a picture of a cat to my desktop."
* );
* ```
*
* @param options - Configuration options for the computer use tool
* @returns The computer use tool object that can be passed to `bindTools`
*/
function computer_20250124(options) {
	const name = TOOL_NAME;
	const computerTool = (0, __langchain_core_tools.tool)(options.execute, {
		name,
		description: "A tool for interacting with the computer",
		schema: require_types.Computer20250124ActionSchema
	});
	computerTool.extras = {
		...computerTool.extras ?? {},
		providerToolDefinition: {
			type: "computer_20250124",
			name,
			display_width_px: options.displayWidthPx,
			display_height_px: options.displayHeightPx,
			...options.displayNumber !== void 0 && { display_number: options.displayNumber }
		}
	};
	return computerTool;
}

//#endregion
exports.computer_20250124 = computer_20250124;
exports.computer_20251124 = computer_20251124;
//# sourceMappingURL=computer.cjs.map