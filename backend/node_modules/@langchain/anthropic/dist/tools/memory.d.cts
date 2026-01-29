import { MemoryTool20250818Options } from "./types.cjs";
import * as zod0 from "zod";
import * as zod_v4_core0 from "zod/v4/core";
import { DynamicStructuredTool } from "@langchain/core/tools";

//#region src/tools/memory.d.ts

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
declare function memory_20250818(options?: MemoryTool20250818Options): DynamicStructuredTool<zod0.ZodDiscriminatedUnion<[zod0.ZodObject<{
  command: zod0.ZodLiteral<"view">;
  path: zod0.ZodString;
}, zod_v4_core0.$strip>, zod0.ZodObject<{
  command: zod0.ZodLiteral<"create">;
  path: zod0.ZodString;
  file_text: zod0.ZodString;
}, zod_v4_core0.$strip>, zod0.ZodObject<{
  command: zod0.ZodLiteral<"str_replace">;
  path: zod0.ZodString;
  old_str: zod0.ZodString;
  new_str: zod0.ZodString;
}, zod_v4_core0.$strip>, zod0.ZodObject<{
  command: zod0.ZodLiteral<"insert">;
  path: zod0.ZodString;
  insert_line: zod0.ZodNumber;
  insert_text: zod0.ZodString;
}, zod_v4_core0.$strip>, zod0.ZodObject<{
  command: zod0.ZodLiteral<"delete">;
  path: zod0.ZodString;
}, zod_v4_core0.$strip>, zod0.ZodObject<{
  command: zod0.ZodLiteral<"rename">;
  old_path: zod0.ZodString;
  new_path: zod0.ZodString;
}, zod_v4_core0.$strip>], "command">, {
  command: "view";
  path: string;
} | {
  command: "create";
  path: string;
  file_text: string;
} | {
  command: "str_replace";
  path: string;
  old_str: string;
  new_str: string;
} | {
  command: "insert";
  path: string;
  insert_line: number;
  insert_text: string;
} | {
  command: "delete";
  path: string;
} | {
  command: "rename";
  old_path: string;
  new_path: string;
}, unknown, string | Promise<string>, string>;
//#endregion
export { memory_20250818 };
//# sourceMappingURL=memory.d.cts.map