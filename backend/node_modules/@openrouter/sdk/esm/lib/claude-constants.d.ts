/**
 * Claude-specific content block types
 * Used for detecting Claude message format
 */
export declare const ClaudeContentBlockType: {
    readonly Text: "text";
    readonly Image: "image";
    readonly ToolUse: "tool_use";
    readonly ToolResult: "tool_result";
};
export type ClaudeContentBlockType = (typeof ClaudeContentBlockType)[keyof typeof ClaudeContentBlockType];
/**
 * Message roles that are NOT supported in Claude format
 * Used for distinguishing Claude vs OpenAI format
 */
export declare const NonClaudeMessageRole: {
    readonly System: "system";
    readonly Developer: "developer";
    readonly Tool: "tool";
};
export type NonClaudeMessageRole = (typeof NonClaudeMessageRole)[keyof typeof NonClaudeMessageRole];
//# sourceMappingURL=claude-constants.d.ts.map