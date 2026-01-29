import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod/v4";

//#region src/tools/types.d.ts

/**
 * Memory tool command types as defined by Anthropic's memory tool API.
 * @beta
 * @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool
 */
declare const Memory20250818ViewCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"view">;
  path: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818CreateCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"create">;
  path: z.ZodString;
  file_text: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818StrReplaceCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"str_replace">;
  path: z.ZodString;
  old_str: z.ZodString;
  new_str: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818InsertCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"insert">;
  path: z.ZodString;
  insert_line: z.ZodNumber;
  insert_text: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818DeleteCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"delete">;
  path: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818RenameCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"rename">;
  old_path: z.ZodString;
  new_path: z.ZodString;
}, z.core.$strip>;
declare const Memory20250818CommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  command: z.ZodLiteral<"view">;
  path: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"create">;
  path: z.ZodString;
  file_text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"str_replace">;
  path: z.ZodString;
  old_str: z.ZodString;
  new_str: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"insert">;
  path: z.ZodString;
  insert_line: z.ZodNumber;
  insert_text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"delete">;
  path: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"rename">;
  old_path: z.ZodString;
  new_path: z.ZodString;
}, z.core.$strip>], "command">;
type Memory20250818ViewCommand = z.infer<typeof Memory20250818ViewCommandSchema>;
type Memory20250818CreateCommand = z.infer<typeof Memory20250818CreateCommandSchema>;
type Memory20250818StrReplaceCommand = z.infer<typeof Memory20250818StrReplaceCommandSchema>;
type Memory20250818InsertCommand = z.infer<typeof Memory20250818InsertCommandSchema>;
type Memory20250818DeleteCommand = z.infer<typeof Memory20250818DeleteCommandSchema>;
type Memory20250818RenameCommand = z.infer<typeof Memory20250818RenameCommandSchema>;
type Memory20250818Command = z.infer<typeof Memory20250818CommandSchema>;
/**
 * Options for creating a memory tool.
 */
interface MemoryTool20250818Options {
  /**
   * Optional execute function that handles memory command execution.
   * In LangChain, this is typically handled separately when processing tool calls,
   * but this option is provided for compatibility with the AI SDK pattern.
   * Note: This option is currently unused but reserved for future use.
   */
  execute: (action: Memory20250818Command) => Promise<string> | string;
}
/**
 * Memory tool type definition.
 */
type MemoryTool20250818 = Anthropic.Beta.BetaMemoryTool20250818;
/**
 * Text editor tool command types for Claude 4.x models.
 * @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/text-editor-tool
 */
declare const TextEditor20250728ViewCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"view">;
  path: z.ZodString;
  view_range: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, z.core.$strip>;
declare const TextEditor20250728StrReplaceCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"str_replace">;
  path: z.ZodString;
  old_str: z.ZodString;
  new_str: z.ZodString;
}, z.core.$strip>;
declare const TextEditor20250728CreateCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"create">;
  path: z.ZodString;
  file_text: z.ZodString;
}, z.core.$strip>;
declare const TextEditor20250728InsertCommandSchema: z.ZodObject<{
  command: z.ZodLiteral<"insert">;
  path: z.ZodString;
  insert_line: z.ZodNumber;
  new_str: z.ZodString;
}, z.core.$strip>;
declare const TextEditor20250728CommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  command: z.ZodLiteral<"view">;
  path: z.ZodString;
  view_range: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"str_replace">;
  path: z.ZodString;
  old_str: z.ZodString;
  new_str: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"create">;
  path: z.ZodString;
  file_text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  command: z.ZodLiteral<"insert">;
  path: z.ZodString;
  insert_line: z.ZodNumber;
  new_str: z.ZodString;
}, z.core.$strip>], "command">;
type TextEditor20250728ViewCommand = z.infer<typeof TextEditor20250728ViewCommandSchema>;
type TextEditor20250728StrReplaceCommand = z.infer<typeof TextEditor20250728StrReplaceCommandSchema>;
type TextEditor20250728CreateCommand = z.infer<typeof TextEditor20250728CreateCommandSchema>;
type TextEditor20250728InsertCommand = z.infer<typeof TextEditor20250728InsertCommandSchema>;
type TextEditor20250728Command = z.infer<typeof TextEditor20250728CommandSchema>;
/**
 * Computer use tool action types for Claude Opus 4.5.
 * Includes zoom action which is not available in earlier versions.
 * @see https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
 */
type Computer20251124Action = Computer20250124Action | ComputerZoomAction;
/**
 * Computer use tool action types for Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, and Sonnet 3.7 versions.
 * @see https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
 */
type Computer20250124Action = ComputerScreenshotAction | ComputerLeftClickAction | ComputerRightClickAction | ComputerMiddleClickAction | ComputerDoubleClickAction | ComputerTripleClickAction | ComputerLeftClickDragAction | ComputerLeftMouseDownAction | ComputerLeftMouseUpAction | ComputerScrollAction | ComputerTypeAction | ComputerKeyAction | ComputerMouseMoveAction | ComputerHoldKeyAction | ComputerWaitAction;
declare const ComputerScreenshotActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"screenshot">;
}, z.core.$strip>;
declare const ComputerLeftClickActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"left_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerRightClickActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"right_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerMiddleClickActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"middle_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerDoubleClickActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"double_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerTripleClickActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"triple_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerLeftClickDragActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"left_click_drag">;
  start_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  end_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerLeftMouseDownActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_down">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerLeftMouseUpActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_up">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerScrollActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"scroll">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  scroll_direction: z.ZodEnum<{
    down: "down";
    left: "left";
    right: "right";
    up: "up";
  }>;
  scroll_amount: z.ZodNumber;
}, z.core.$strip>;
declare const ComputerTypeActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"type">;
  text: z.ZodString;
}, z.core.$strip>;
declare const ComputerKeyActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"key">;
  key: z.ZodString;
}, z.core.$strip>;
declare const ComputerMouseMoveActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"mouse_move">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const ComputerHoldKeyActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"hold_key">;
  key: z.ZodString;
}, z.core.$strip>;
declare const ComputerWaitActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"wait">;
  duration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const ComputerZoomActionSchema: z.ZodObject<{
  action: z.ZodLiteral<"zoom">;
  region: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
declare const Computer20250124ActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  action: z.ZodLiteral<"screenshot">;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"right_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"middle_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"double_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"triple_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_click_drag">;
  start_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  end_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_down">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_up">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"scroll">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  scroll_direction: z.ZodEnum<{
    down: "down";
    left: "left";
    right: "right";
    up: "up";
  }>;
  scroll_amount: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"type">;
  text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"key">;
  key: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"mouse_move">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"hold_key">;
  key: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"wait">;
  duration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>], "action">;
declare const Computer20251124ActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  action: z.ZodLiteral<"screenshot">;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"right_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"middle_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"double_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"triple_click">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_click_drag">;
  start_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  end_coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_down">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"left_mouse_up">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"scroll">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
  scroll_direction: z.ZodEnum<{
    down: "down";
    left: "left";
    right: "right";
    up: "up";
  }>;
  scroll_amount: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"type">;
  text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"key">;
  key: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"mouse_move">;
  coordinate: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"hold_key">;
  key: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"wait">;
  duration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
  action: z.ZodLiteral<"zoom">;
  region: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>], "action">;
type ComputerScreenshotAction = z.infer<typeof ComputerScreenshotActionSchema>;
type ComputerLeftClickAction = z.infer<typeof ComputerLeftClickActionSchema>;
type ComputerRightClickAction = z.infer<typeof ComputerRightClickActionSchema>;
type ComputerMiddleClickAction = z.infer<typeof ComputerMiddleClickActionSchema>;
type ComputerDoubleClickAction = z.infer<typeof ComputerDoubleClickActionSchema>;
type ComputerTripleClickAction = z.infer<typeof ComputerTripleClickActionSchema>;
type ComputerLeftClickDragAction = z.infer<typeof ComputerLeftClickDragActionSchema>;
type ComputerLeftMouseDownAction = z.infer<typeof ComputerLeftMouseDownActionSchema>;
type ComputerLeftMouseUpAction = z.infer<typeof ComputerLeftMouseUpActionSchema>;
type ComputerScrollAction = z.infer<typeof ComputerScrollActionSchema>;
type ComputerTypeAction = z.infer<typeof ComputerTypeActionSchema>;
type ComputerKeyAction = z.infer<typeof ComputerKeyActionSchema>;
type ComputerMouseMoveAction = z.infer<typeof ComputerMouseMoveActionSchema>;
type ComputerHoldKeyAction = z.infer<typeof ComputerHoldKeyActionSchema>;
type ComputerWaitAction = z.infer<typeof ComputerWaitActionSchema>;
type ComputerZoomAction = z.infer<typeof ComputerZoomActionSchema>;
/**
 * Bash tool command types for Claude 4 models and Claude 3.7.
 * @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/bash-tool
 */
declare const Bash20250124ExecuteCommandSchema: z.ZodObject<{
  command: z.ZodString;
}, z.core.$strip>;
declare const Bash20250124RestartCommandSchema: z.ZodObject<{
  restart: z.ZodLiteral<true>;
}, z.core.$strip>;
declare const Bash20250124CommandSchema: z.ZodUnion<readonly [z.ZodObject<{
  command: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  restart: z.ZodLiteral<true>;
}, z.core.$strip>]>;
type Bash20250124ExecuteCommand = z.infer<typeof Bash20250124ExecuteCommandSchema>;
type Bash20250124RestartCommand = z.infer<typeof Bash20250124RestartCommandSchema>;
type Bash20250124Command = z.infer<typeof Bash20250124CommandSchema>;
//#endregion
export { Bash20250124Command, Bash20250124CommandSchema, Bash20250124ExecuteCommand, Bash20250124ExecuteCommandSchema, Bash20250124RestartCommand, Bash20250124RestartCommandSchema, Computer20250124Action, Computer20250124ActionSchema, Computer20251124Action, Computer20251124ActionSchema, ComputerDoubleClickAction, ComputerDoubleClickActionSchema, ComputerHoldKeyAction, ComputerHoldKeyActionSchema, ComputerKeyAction, ComputerKeyActionSchema, ComputerLeftClickAction, ComputerLeftClickActionSchema, ComputerLeftClickDragAction, ComputerLeftClickDragActionSchema, ComputerLeftMouseDownAction, ComputerLeftMouseDownActionSchema, ComputerLeftMouseUpAction, ComputerLeftMouseUpActionSchema, ComputerMiddleClickAction, ComputerMiddleClickActionSchema, ComputerMouseMoveAction, ComputerMouseMoveActionSchema, ComputerRightClickAction, ComputerRightClickActionSchema, ComputerScreenshotAction, ComputerScreenshotActionSchema, ComputerScrollAction, ComputerScrollActionSchema, ComputerTripleClickAction, ComputerTripleClickActionSchema, ComputerTypeAction, ComputerTypeActionSchema, ComputerWaitAction, ComputerWaitActionSchema, ComputerZoomAction, ComputerZoomActionSchema, Memory20250818Command, Memory20250818CommandSchema, Memory20250818CreateCommand, Memory20250818CreateCommandSchema, Memory20250818DeleteCommand, Memory20250818DeleteCommandSchema, Memory20250818InsertCommand, Memory20250818InsertCommandSchema, Memory20250818RenameCommand, Memory20250818RenameCommandSchema, Memory20250818StrReplaceCommand, Memory20250818StrReplaceCommandSchema, Memory20250818ViewCommand, Memory20250818ViewCommandSchema, MemoryTool20250818, MemoryTool20250818Options, TextEditor20250728Command, TextEditor20250728CommandSchema, TextEditor20250728CreateCommand, TextEditor20250728CreateCommandSchema, TextEditor20250728InsertCommand, TextEditor20250728InsertCommandSchema, TextEditor20250728StrReplaceCommand, TextEditor20250728StrReplaceCommandSchema, TextEditor20250728ViewCommand, TextEditor20250728ViewCommandSchema };
//# sourceMappingURL=types.d.cts.map