const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const zod_v4 = require_rolldown_runtime.__toESM(require("zod/v4"));

//#region src/tools/types.ts
/**
* Memory tool command types as defined by Anthropic's memory tool API.
* @beta
* @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool
*/
const Memory20250818ViewCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("view"),
	path: zod_v4.z.string()
});
const Memory20250818CreateCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("create"),
	path: zod_v4.z.string(),
	file_text: zod_v4.z.string()
});
const Memory20250818StrReplaceCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("str_replace"),
	path: zod_v4.z.string(),
	old_str: zod_v4.z.string(),
	new_str: zod_v4.z.string()
});
const Memory20250818InsertCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("insert"),
	path: zod_v4.z.string(),
	insert_line: zod_v4.z.number(),
	insert_text: zod_v4.z.string()
});
const Memory20250818DeleteCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("delete"),
	path: zod_v4.z.string()
});
const Memory20250818RenameCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("rename"),
	old_path: zod_v4.z.string(),
	new_path: zod_v4.z.string()
});
const Memory20250818CommandSchema = zod_v4.z.discriminatedUnion("command", [
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
const TextEditor20250728ViewCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("view"),
	path: zod_v4.z.string(),
	view_range: zod_v4.z.tuple([zod_v4.z.number(), zod_v4.z.number()]).optional()
});
const TextEditor20250728StrReplaceCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("str_replace"),
	path: zod_v4.z.string(),
	old_str: zod_v4.z.string(),
	new_str: zod_v4.z.string()
});
const TextEditor20250728CreateCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("create"),
	path: zod_v4.z.string(),
	file_text: zod_v4.z.string()
});
const TextEditor20250728InsertCommandSchema = zod_v4.z.object({
	command: zod_v4.z.literal("insert"),
	path: zod_v4.z.string(),
	insert_line: zod_v4.z.number(),
	new_str: zod_v4.z.string()
});
const TextEditor20250728CommandSchema = zod_v4.z.discriminatedUnion("command", [
	TextEditor20250728ViewCommandSchema,
	TextEditor20250728StrReplaceCommandSchema,
	TextEditor20250728CreateCommandSchema,
	TextEditor20250728InsertCommandSchema
]);
const coordinateSchema = zod_v4.z.tuple([zod_v4.z.number(), zod_v4.z.number()]);
const ComputerScreenshotActionSchema = zod_v4.z.object({ action: zod_v4.z.literal("screenshot") });
const ComputerLeftClickActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("left_click"),
	coordinate: coordinateSchema
});
const ComputerRightClickActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("right_click"),
	coordinate: coordinateSchema
});
const ComputerMiddleClickActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("middle_click"),
	coordinate: coordinateSchema
});
const ComputerDoubleClickActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("double_click"),
	coordinate: coordinateSchema
});
const ComputerTripleClickActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("triple_click"),
	coordinate: coordinateSchema
});
const ComputerLeftClickDragActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("left_click_drag"),
	start_coordinate: coordinateSchema,
	end_coordinate: coordinateSchema
});
const ComputerLeftMouseDownActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("left_mouse_down"),
	coordinate: coordinateSchema
});
const ComputerLeftMouseUpActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("left_mouse_up"),
	coordinate: coordinateSchema
});
const ComputerScrollActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("scroll"),
	coordinate: coordinateSchema,
	scroll_direction: zod_v4.z.enum([
		"up",
		"down",
		"left",
		"right"
	]),
	scroll_amount: zod_v4.z.number()
});
const ComputerTypeActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("type"),
	text: zod_v4.z.string()
});
const ComputerKeyActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("key"),
	key: zod_v4.z.string()
});
const ComputerMouseMoveActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("mouse_move"),
	coordinate: coordinateSchema
});
const ComputerHoldKeyActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("hold_key"),
	key: zod_v4.z.string()
});
const ComputerWaitActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("wait"),
	duration: zod_v4.z.number().optional()
});
const ComputerZoomActionSchema = zod_v4.z.object({
	action: zod_v4.z.literal("zoom"),
	region: zod_v4.z.tuple([
		zod_v4.z.number(),
		zod_v4.z.number(),
		zod_v4.z.number(),
		zod_v4.z.number()
	])
});
const Computer20250124ActionSchema = zod_v4.z.discriminatedUnion("action", [
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
const Computer20251124ActionSchema = zod_v4.z.discriminatedUnion("action", [
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
const Bash20250124ExecuteCommandSchema = zod_v4.z.object({ command: zod_v4.z.string().describe("The bash command to run") });
const Bash20250124RestartCommandSchema = zod_v4.z.object({ restart: zod_v4.z.literal(true).describe("Set to true to restart the bash session") });
const Bash20250124CommandSchema = zod_v4.z.union([Bash20250124ExecuteCommandSchema, Bash20250124RestartCommandSchema]);

//#endregion
exports.Bash20250124CommandSchema = Bash20250124CommandSchema;
exports.Computer20250124ActionSchema = Computer20250124ActionSchema;
exports.Computer20251124ActionSchema = Computer20251124ActionSchema;
exports.Memory20250818CommandSchema = Memory20250818CommandSchema;
exports.TextEditor20250728CommandSchema = TextEditor20250728CommandSchema;
//# sourceMappingURL=types.cjs.map