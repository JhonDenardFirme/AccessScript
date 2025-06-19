import { consumeToken } from "./consumeToken";

export function parseDefUserGroupDeclaration(tokens, errors) {
    // Consume 'defUser' keyword (type and value must match)
    consumeToken(tokens, "defUserGroup", "KEYWORD", errors);

    // Consume IDENTIFIER
    let userToken = consumeToken(tokens, null, "IDENTIFIER", errors);

    // If IDENTIFIER is missing, return an error structure but continue parsing
    if (!userToken) {
        errors.push("Expected IDENTIFIER after 'defUserGroup'");
        console.warn("Expected IDENTIFIER after 'defUserGroup'");
        return {
            type: "DefUserGroupDeclaration",
            userGroup: null,
            userList: null,
            error: "Expected IDENTIFIER after 'defUserGroup'"
        };
    }

    // Now 'userToken' is correctly assigned before using it

    // If IDENTIFIER is found, proceed with parsing
    const userGroup = userToken.value;

    // Consume '=' symbol (only type should match)
    consumeToken(tokens, "=", "ASSIGNMENT", errors);

    // Peek next token without consuming

    const userList = parseUserList(tokens, errors);
    // Check for statement terminator (';')
    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);

    if (!statTerminatorToken) {
        const errorMessage = `[Line ${userToken.line ?? 'Unknown'}]: Expected ';' but not found.`;
        errors.push(errorMessage);
        console.warn(errorMessage);
    }

    // Return the valid structure
    return {
        type: "DefUserGroupDeclaration",
        userGroup: userGroup,  // Store email as 'user'
        userList: userList,
        error: null
    };
}





function parseUserList(tokens, errors) {
    const roles = [];
    let errorCount = 0;
    let lastWasEmail = false; // Track last token type to prevent trailing comma

    if (tokens[0] && tokens[0].value === "[") {
        consumeToken(tokens, "[", "OPEN_BRACKET", errors);

        if (tokens[0] && tokens[0].value === "]") {
            consumeToken(tokens, "]", "CLOSE_BRACKET", errors);
            return roles; // Return empty list
        }

        while (tokens.length > 0 && tokens[0].value !== "]") {
            const roleToken = consumeToken(tokens, null, "EMAILSTR_LITERAL", errors);

            if (roleToken.type === "ERROR") {
                errorCount++;
                if (errorCount >= 10) {
                    errors.push("Maximum error limit reached (10 errors). Parsing aborted.");
                    break;
                }
            } else {
                roles.push(roleToken.value);
                lastWasEmail = true; // Last valid token was an EMAILSTR_LITERAL
            }

            // If there's a comma, ensure it's followed by an EMAILSTR_LITERAL
            if (tokens.length > 0 && tokens[0].value === ",") {
                consumeToken(tokens, ",", "COMMA", errors);

                // Next token **must** be an EMAILSTR_LITERAL, otherwise it's an error
                if (!tokens[0] || tokens[0].type !== "EMAILSTR_LITERAL") {
                    errors.push("Expected EMAILSTR_LITERAL after ',' but found something else.");
                    errorCount++;
                    if (errorCount >= 10) {
                        errors.push("Maximum error limit reached (10 errors). Parsing aborted.");
                        break;
                    }
                }

                lastWasEmail = false; // Reset flag since comma needs a valid email next
            }
        }

        // Validate ending: last token before ']' **must** be EMAILSTR_LITERAL
        if (!lastWasEmail) {
            errors.push("User List must end with an EMAILSTR_LITERAL, not a comma.");
        }

        if (tokens.length > 0 && tokens[0].value === "]") {
            consumeToken(tokens, "]", "CLOSE_BRACKET", errors);
        } else {
            errors.push("Expected closing bracket ']' for roles.");
        }
    } else {
        errors.push("User List should be wrapped in square brackets [].");
    }

    return roles;
}
