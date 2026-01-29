import { ClaudeContentBlockType, NonClaudeMessageRole, } from "./claude-constants.js";
function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isNonClaudeRole(role) {
    return (role === NonClaudeMessageRole.System ||
        role === NonClaudeMessageRole.Developer ||
        role === NonClaudeMessageRole.Tool);
}
function isClaudeToolResultBlock(block) {
    if (!isRecord(block))
        return false;
    return block["type"] === ClaudeContentBlockType.ToolResult;
}
function isClaudeImageBlockWithSource(block) {
    if (!isRecord(block))
        return false;
    return (block["type"] === ClaudeContentBlockType.Image &&
        "source" in block &&
        isRecord(block["source"]));
}
function isClaudeToolUseBlockWithId(block) {
    if (!isRecord(block))
        return false;
    return (block["type"] === ClaudeContentBlockType.ToolUse &&
        "id" in block &&
        typeof block["id"] === "string");
}
function hasClaudeSpecificBlocks(content) {
    for (const block of content) {
        if (isClaudeToolResultBlock(block))
            return true;
        if (isClaudeImageBlockWithSource(block))
            return true;
        if (isClaudeToolUseBlockWithId(block))
            return true;
    }
    return false;
}
/**
 * Check if input is in Claude message format
 * Uses structural analysis to detect Claude-specific patterns
 *
 * @param input - Input to check
 * @returns True if input appears to be Claude format
 */
export function isClaudeStyleMessages(input) {
    if (!Array.isArray(input) || input.length === 0) {
        return false;
    }
    for (const msg of input) {
        if (!isRecord(msg))
            continue;
        if (!("role" in msg))
            continue;
        if ("type" in msg)
            continue; // Claude messages don't have top-level "type"
        // If we find a non-Claude role, it's not Claude format
        if (isNonClaudeRole(msg["role"])) {
            return false;
        }
        // If we find Claude-specific content blocks, it's Claude format
        const content = msg["content"];
        if (Array.isArray(content) && hasClaudeSpecificBlocks(content)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=claude-type-guards.js.map