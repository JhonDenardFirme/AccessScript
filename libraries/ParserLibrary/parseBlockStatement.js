import { consumeToken } from "./consumeToken";

export function parseBlockStatement(tokens, errors) {
    // Consume 'assign' keyword (type and value must match)
    consumeToken(tokens, "block", "KEYWORD", errors);
    consumeToken(tokens, "(", "OPEN_PAREN", errors);

    const routeList = parseRoutes(tokens, errors);

    consumeToken(tokens, ")", "CLOSE_PAREN", errors);

    // Consume the statement terminator ';'
    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);
    if (!statTerminatorToken) {
        errors.push(`[Line ${userToken.line ?? 'Unknown'}]: Expected ';' but not found.`);
    }

    return {
        type: "BlockStatement",
        routeList: routeList,
        error: statTerminatorToken ? null : "Missing statement terminator ';'"
    };
}




function parseRoutes(tokens, errors) {
    const roles = [];
    let errorCount = 0;
    let lastWasString = false; // Track if the last token was a STRING_LITERAL

    if (tokens[0] && tokens[0].value === "[") {
        consumeToken(tokens, "[", "OPEN_BRACKET", errors);

        if (tokens[0] && tokens[0].value === "]") {
            consumeToken(tokens, "]", "CLOSE_BRACKET", errors);
            return roles; // Return empty list
        }

        while (tokens.length > 0 && tokens[0].value !== "]") {
            const roleToken = consumeToken(tokens, null, "STRING_LITERAL", errors);

            if (roleToken.type === "ERROR") {
                errorCount++;
                if (errorCount >= 10) {
                    errors.push("Maximum error limit reached (10 errors). Parsing aborted.");
                    break;
                }
            } else {
                roles.push(roleToken.value);
                lastWasString = true;
            }

            // If there's a comma, ensure it's followed by a STRING_LITERAL
            if (tokens.length > 0 && tokens[0].value === ",") {
                consumeToken(tokens, ",", "COMMA", errors);

                // Next token **must** be a STRING_LITERAL, otherwise it's an error
                if (!tokens[0] || tokens[0].type !== "STRING_LITERAL") {
                    errors.push("Expected STRING_LITERAL after ',' but found something else.");
                    errorCount++;
                    if (errorCount >= 10) {
                        errors.push("Maximum error limit reached (10 errors). Parsing aborted.");
                        break;
                    }
                }

                lastWasString = false; // Reset flag since comma needs a valid string next
            }
        }

        // Validate ending: last token before ']' **must** be STRING_LITERAL
        if (!lastWasString) {
            errors.push("Route List must end with a STRING_LITERAL, not a comma.");
        }

        if (tokens.length > 0 && tokens[0].value === "]") {
            consumeToken(tokens, "]", "CLOSE_BRACKET", errors);
        } else {
            errors.push("Expected closing bracket ']' for routes.");
        }
    } else {
        errors.push("Routes should be wrapped in square brackets [].");
    }

    return roles;
}
