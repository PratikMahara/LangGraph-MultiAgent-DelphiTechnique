import { TextEditor20250728Command } from "./types.cjs";
import * as zod24 from "zod";
import * as zod_v4_core5 from "zod/v4/core";
import { DynamicStructuredTool } from "@langchain/core/tools";

//#region src/tools/textEditor.d.ts
/**
 * Options for the text editor tool (Claude 4.x version).
 */
interface TextEditor20250728Options {
  /**
   * Optional execute function that handles text editor command execution.
   * This function receives the command input and should return the result.
   */
  execute?: (args: TextEditor20250728Command) => string | Promise<string>;
  /**
   * Optional maximum characters to return when viewing files.
   * If the file content exceeds this limit, it will be truncated.
   */
  maxCharacters?: number;
}
/**
 * Creates an Anthropic text editor tool for Claude 4.x models that can view and modify text files.
 *
 * The text editor tool enables Claude to view and modify text files, helping debug, fix,
 * and improve code or other text documents. Claude can directly interact with files,
 * providing hands-on assistance rather than just suggesting changes.
 *
 * Available commands:
 * - `view`: Examine file contents or list directory contents
 * - `str_replace`: Replace specific text in a file
 * - `create`: Create a new file with specified content
 * - `insert`: Insert text at a specific line number
 *
 * @example
 * ```typescript
 * import { ChatAnthropic, tools } from "@langchain/anthropic";
 * import * as fs from "fs";
 *
 * const llm = new ChatAnthropic({
 *   model: "claude-sonnet-4-5-20250929",
 * });
 *
 * const textEditor = tools.textEditor_20250728({
 *   execute: async (args) => {
 *     if (args.command === "view") {
 *       const content = fs.readFileSync(args.path, "utf-8");
 *       return content.split("\n").map((line, i) => `${i + 1}: ${line}`).join("\n");
 *     }
 *     if (args.command === "str_replace") {
 *       let content = fs.readFileSync(args.path, "utf-8");
 *       content = content.replace(args.old_str!, args.new_str!);
 *       fs.writeFileSync(args.path, content);
 *       return "Successfully replaced text.";
 *     }
 *     // Handle other commands...
 *     return "Command executed";
 *   },
 *   maxCharacters: 10000,
 * });
 *
 * const llmWithEditor = llm.bindTools([textEditor]);
 * const response = await llmWithEditor.invoke(
 *   "There's a syntax error in my primes.py file. Can you help me fix it?"
 * );
 * ```
 *
 * @param options - Configuration options for the text editor tool
 * @param options.execute - Function that handles text editor command execution
 * @param options.maxCharacters - Maximum characters to return when viewing files
 * @returns The text editor tool object that can be passed to `bindTools`
 *
 * @see https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/text-editor-tool
 */
declare function textEditor_20250728(options?: TextEditor20250728Options): DynamicStructuredTool<zod24.ZodDiscriminatedUnion<[zod24.ZodObject<{
  command: zod24.ZodLiteral<"view">;
  path: zod24.ZodString;
  view_range: zod24.ZodOptional<zod24.ZodTuple<[zod24.ZodNumber, zod24.ZodNumber], null>>;
}, zod_v4_core5.$strip>, zod24.ZodObject<{
  command: zod24.ZodLiteral<"str_replace">;
  path: zod24.ZodString;
  old_str: zod24.ZodString;
  new_str: zod24.ZodString;
}, zod_v4_core5.$strip>, zod24.ZodObject<{
  command: zod24.ZodLiteral<"create">;
  path: zod24.ZodString;
  file_text: zod24.ZodString;
}, zod_v4_core5.$strip>, zod24.ZodObject<{
  command: zod24.ZodLiteral<"insert">;
  path: zod24.ZodString;
  insert_line: zod24.ZodNumber;
  new_str: zod24.ZodString;
}, zod_v4_core5.$strip>], "command">, {
  command: "view";
  path: string;
  view_range?: [number, number] | undefined;
} | {
  command: "str_replace";
  path: string;
  old_str: string;
  new_str: string;
} | {
  command: "create";
  path: string;
  file_text: string;
} | {
  command: "insert";
  path: string;
  insert_line: number;
  new_str: string;
}, unknown, string | Promise<string>, string>;
//#endregion
export { TextEditor20250728Options, textEditor_20250728 };
//# sourceMappingURL=textEditor.d.cts.map