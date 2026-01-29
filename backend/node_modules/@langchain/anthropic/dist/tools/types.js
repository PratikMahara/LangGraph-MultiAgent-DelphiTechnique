import { z } from "zod/v4";

//#region src/tools/types.ts
/**
* Memory tool command types as defined by Anthropic's memory tool API.
* @beta
* @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool
*/
const Memory20250818ViewCommandSchema = z.object({
	command: z.literal("view"),
	path: z.string()
});
const Memory20250818CreateCommandSchema = z.object({
	command: z.literal("create"),
	path: z.string(),
	file_text: z.string()
});
const Memory20250818StrReplaceCommandSchema = z.object({
	command: z.literal("str_replace"),
	path: z.string(),
	old_str: z.string(),
	new_str: z.string()
});
const Memory20250818InsertCommandSchema = z.object({
	command: z.literal("insert"),
	path: z.string(),
	insert_line: z.number(),
	insert_text: z.string()
});
const Memory20250818DeleteCommandSchema = z.object({
	command: z.literal("delete"),
	path: z.string()
});
const Memory20250818RenameCommandSchema = z.object({
	command: z.literal("rename"),
	old_path: z.string(),
	new_path: z.string()
});
const Memory20250818CommandSchema = z.discriminatedUnion("command", [
	Memory20250818ViewCommandSchema,
	Memory20250818CreateCommandSchema,
	Memory20250818StrReplaceCommandSchema,
	Memory20250818InsertCommandSchema,
	Memory20250818DeleteCommandSchema,
	Memory20250818RenameCommandSchema
]);
/**
* Text editor tool command types for Claude 4.x models.
* @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/text-editor-tool
*/
const TextEditor20250728ViewCommandSchema = z.object({
	command: z.literal("view"),
	path: z.string(),
	view_range: z.tuple([z.number(), z.number()]).optional()
});
const TextEditor20250728StrReplaceCommandSchema = z.object({
	command: z.literal("str_replace"),
	path: z.string(),
	old_str: z.string(),
	new_str: z.string()
});
const TextEditor20250728CreateCommandSchema = z.object({
	command: z.literal("create"),
	path: z.string(),
	file_text: z.string()
});
const TextEditor20250728InsertCommandSchema = z.object({
	command: z.literal("insert"),
	path: z.string(),
	insert_line: z.number(),
	new_str: z.string()
});
const TextEditor20250728CommandSchema = z.discriminatedUnion("command", [
	TextEditor20250728ViewCommandSchema,
	TextEditor20250728StrReplaceCommandSchema,
	TextEditor20250728CreateCommandSchema,
	TextEditor20250728InsertCommandSchema
]);
const coordinateSchema = z.tuple([z.number(), z.number()]);
const ComputerScreenshotActionSchema = z.object({ action: z.literal("screenshot") });
const ComputerLeftClickActionSchema = z.object({
	action: z.literal("left_click"),
	coordinate: coordinateSchema
});
const ComputerRightClickActionSchema = z.object({
	action: z.literal("right_click"),
	coordinate: coordinateSchema
});
const ComputerMiddleClickActionSchema = z.object({
	action: z.literal("middle_click"),
	coordinate: coordinateSchema
});
const ComputerDoubleClickActionSchema = z.object({
	action: z.literal("double_click"),
	coordinate: coordinateSchema
});
const ComputerTripleClickActionSchema = z.object({
	action: z.literal("triple_click"),
	coordinate: coordinateSchema
});
const ComputerLeftClickDragActionSchema = z.object({
	action: z.literal("left_click_drag"),
	start_coordinate: coordinateSchema,
	end_coordinate: coordinateSchema
});
const ComputerLeftMouseDownActionSchema = z.object({
	action: z.literal("left_mouse_down"),
	coordinate: coordinateSchema
});
const ComputerLeftMouseUpActionSchema = z.object({
	action: z.literal("left_mouse_up"),
	coordinate: coordinateSchema
});
const ComputerScrollActionSchema = z.object({
	action: z.literal("scroll"),
	coordinate: coordinateSchema,
	scroll_direction: z.enum([
		"up",
		"down",
		"left",
		"right"
	]),
	scroll_amount: z.number()
});
const ComputerTypeActionSchema = z.object({
	action: z.literal("type"),
	text: z.string()
});
const ComputerKeyActionSchema = z.object({
	action: z.literal("key"),
	key: z.string()
});
const ComputerMouseMoveActionSchema = z.object({
	action: z.literal("mouse_move"),
	coordinate: coordinateSchema
});
const ComputerHoldKeyActionSchema = z.object({
	action: z.literal("hold_key"),
	key: z.string()
});
const ComputerWaitActionSchema = z.object({
	action: z.literal("wait"),
	duration: z.number().optional()
});
const ComputerZoomActionSchema = z.object({
	action: z.literal("zoom"),
	region: z.tuple([
		z.number(),
		z.number(),
		z.number(),
		z.number()
	])
});
const Computer20250124ActionSchema = z.discriminatedUnion("action", [
	ComputerScreenshotActionSchema,
	ComputerLeftClickActionSchema,
	ComputerRightClickActionSchema,
	ComputerMiddleClickActionSchema,
	ComputerDoubleClickActionSchema,
	ComputerTripleClickActionSchema,
	ComputerLeftClickDragActionSchema,
	ComputerLeftMouseDownActionSchema,
	ComputerLeftMouseUpActionSchema,
	ComputerScrollActionSchema,
	ComputerTypeActionSchema,
	ComputerKeyActionSchema,
	ComputerMouseMoveActionSchema,
	ComputerHoldKeyActionSchema,
	ComputerWaitActionSchema
]);
const Computer20251124ActionSchema = z.discriminatedUnion("action", [
	ComputerScreenshotActionSchema,
	ComputerLeftClickActionSchema,
	ComputerRightClickActionSchema,
	ComputerMiddleClickActionSchema,
	ComputerDoubleClickActionSchema,
	ComputerTripleClickActionSchema,
	ComputerLeftClickDragActionSchema,
	ComputerLeftMouseDownActionSchema,
	ComputerLeftMouseUpActionSchema,
	ComputerScrollActionSchema,
	ComputerTypeActionSchema,
	ComputerKeyActionSchema,
	ComputerMouseMoveActionSchema,
	ComputerHoldKeyActionSchema,
	ComputerWaitActionSchema,
	ComputerZoomActionSchema
]);
/**
* Bash tool command types for Claude 4 models and Claude 3.7.
* @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/bash-tool
*/
const Bash20250124ExecuteCommandSchema = z.object({ command: z.string().describe("The bash command to run") });
const Bash20250124RestartCommandSchema = z.object({ restart: z.literal(true).describe("Set to true to restart the bash session") });
const Bash20250124CommandSchema = z.union([Bash20250124ExecuteCommandSchema, Bash20250124RestartCommandSchema]);

//#endregion
export { Bash20250124CommandSchema, Computer20250124ActionSchema, Computer20251124ActionSchema, Memory20250818CommandSchema, TextEditor20250728CommandSchema };
//# sourceMappingURL=types.js.map