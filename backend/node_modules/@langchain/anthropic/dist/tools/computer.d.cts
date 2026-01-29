import { Computer20250124Action, Computer20251124Action } from "./types.cjs";
import { ToolMessage } from "@langchain/core/messages";
import * as zod46 from "zod";
import * as zod_v4_core9 from "zod/v4/core";
import { DynamicStructuredTool, ToolRuntime } from "@langchain/core/tools";

//#region src/tools/computer.d.ts
type ComputerUseReturnType = string | Promise<string> | ToolMessage<any> | Promise<ToolMessage<any>>;
/**
 * Options for the computer use tool (Claude Opus 4.5 only version).
 *
 * @template TState - The type of the state schema (when used with `ReactAgent`)
 * @template TContext - The type of the context schema (when used with `ReactAgent`)
 */
interface Computer20251124Options<TState = any, TContext = any> {
  /**
   * The width of the display in pixels.
   */
  displayWidthPx: number;
  /**
   * The height of the display in pixels.
   */
  displayHeightPx: number;
  /**
   * Optional display number for X11 environments.
   */
  displayNumber?: number;
  /**
   * Enable zoom action for detailed screen region inspection.
   * When enabled, Claude can zoom into specific screen regions.
   * @default false
   */
  enableZoom?: boolean;
  /**
   * Optional execute function that handles computer action execution.
   * This function receives the action input and should return the result
   * (typically a base64-encoded screenshot or action confirmation).
   */
  execute?: (args: Computer20251124Action, runtime: ToolRuntime<TState, TContext>) => ComputerUseReturnType;
}
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
declare function computer_20251124(options: Computer20251124Options): DynamicStructuredTool<zod46.ZodDiscriminatedUnion<[zod46.ZodObject<{
  action: zod46.ZodLiteral<"screenshot">;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"right_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"middle_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"double_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"triple_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_click_drag">;
  start_coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
  end_coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_mouse_down">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_mouse_up">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"scroll">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
  scroll_direction: zod46.ZodEnum<{
    down: "down";
    left: "left";
    right: "right";
    up: "up";
  }>;
  scroll_amount: zod46.ZodNumber;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"type">;
  text: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"key">;
  key: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"mouse_move">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"hold_key">;
  key: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"wait">;
  duration: zod46.ZodOptional<zod46.ZodNumber>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"zoom">;
  region: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber, zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>], "action">, Computer20251124Action, any, ToolMessage<any>, string>;
/**
 * Options for the computer use tool.
 *
 * Supported models: Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, and Sonnet 3.7 versions.
 */
interface Computer20250124Options<TState = any, TContext = any> {
  /**
   * The width of the display in pixels.
   */
  displayWidthPx: number;
  /**
   * The height of the display in pixels.
   */
  displayHeightPx: number;
  /**
   * Optional display number for X11 environments.
   */
  displayNumber?: number;
  /**
   * Optional execute function that handles computer action execution.
   * This function receives the action input and should return the result
   * (typically a base64-encoded screenshot or action confirmation).
   */
  execute?: (args: Computer20250124Action, runtime: ToolRuntime<TState, TContext>) => ComputerUseReturnType;
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
declare function computer_20250124(options: Computer20250124Options): DynamicStructuredTool<zod46.ZodDiscriminatedUnion<[zod46.ZodObject<{
  action: zod46.ZodLiteral<"screenshot">;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"right_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"middle_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"double_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"triple_click">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_click_drag">;
  start_coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
  end_coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_mouse_down">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"left_mouse_up">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"scroll">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
  scroll_direction: zod46.ZodEnum<{
    down: "down";
    left: "left";
    right: "right";
    up: "up";
  }>;
  scroll_amount: zod46.ZodNumber;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"type">;
  text: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"key">;
  key: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"mouse_move">;
  coordinate: zod46.ZodTuple<[zod46.ZodNumber, zod46.ZodNumber], null>;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"hold_key">;
  key: zod46.ZodString;
}, zod_v4_core9.$strip>, zod46.ZodObject<{
  action: zod46.ZodLiteral<"wait">;
  duration: zod46.ZodOptional<zod46.ZodNumber>;
}, zod_v4_core9.$strip>], "action">, Computer20250124Action, any, ComputerUseReturnType, string>;
//#endregion
export { Computer20250124Options, Computer20251124Options, ComputerUseReturnType, computer_20250124, computer_20251124 };
//# sourceMappingURL=computer.d.cts.map