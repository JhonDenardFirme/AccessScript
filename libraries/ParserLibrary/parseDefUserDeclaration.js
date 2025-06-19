import { consumeToken } from "./consumeToken";

export function parseDefUserDeclaration(tokens, errors) {
    // Consume 'defUser' keyword (type and value must match)
    consumeToken(tokens, "defUser", "KEYWORD", errors);

    // Consume IDENTIFIER
    let userToken = consumeToken(tokens, null, "IDENTIFIER", errors);

    // If IDENTIFIER is missing, return an error structure but continue parsing
    if (!userToken) {
        errors.push("Expected IDENTIFIER after 'defUser'");
        console.warn("Expected IDENTIFIER after 'defUser'");
        return {
            type: "DefUserDeclaration",
            user: null,
            roles: null,
            error: "Expected IDENTIFIER after 'defUser'"
        };
    }

    // Now 'userToken' is correctly assigned before using it

    // If IDENTIFIER is found, proceed with parsing
    const user = userToken.value;

    // Consume '=' symbol (only type should match)
    consumeToken(tokens, "=", "ASSIGNMENT", errors);

    // Peek next token without consuming
    let nextToken = tokens[0];
    console.log(nextToken);


    let roles = null;
    let error = null;

    if (nextToken?.type === "OPEN_CURLY") {

        consumeToken(tokens, "{", "OPEN_CURLY", errors);

        consumeToken(tokens, null, "EMAILSTR_LITERAL", errors);

        consumeToken(tokens, ",", "COMMA", errors);

        roles = parseRoles(tokens, errors);

        consumeToken(tokens, "}", "CLOSE_CURLY", errors);

    } else if (nextToken?.type === "IDENTIFIER") {
        // Case 2: Function call ( getUser() )
        let functionToken = consumeToken(tokens, "getUser", "IDENTIFIER", errors);
        consumeToken(tokens, "(", "OPEN_PAREN", errors);
        consumeToken(tokens, ")", "CLOSE_PAREN", errors);
        roles = "JWT Token";

    } else {
        error = `Unexpected token '${nextToken?.value}' after '='. Expected '{' or function call.`;
        errors.push(error);
        console.warn(error);
    }

    // Check for statement terminator (';')
    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);

    if (!statTerminatorToken) {
        const errorMessage = `[Line ${userToken.line ?? 'Unknown'}]: Expected ';' but not found.`;
        errors.push(errorMessage);
        console.warn(errorMessage);
    }

    // Return the valid structure
    return {
        type: "DefUserDeclaration",
        user: user,  // Store email as 'user'
        roles: roles,  // Parsed roles or function call
        error: error || (statTerminatorToken ? null : "Missing statement terminator ';'")
    };
}

function parseRoles(tokens, errors) {
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
            errors.push("Roles list must end with a STRING_LITERAL, not a comma.");
        }

        if (tokens.length > 0 && tokens[0].value === "]") {
            consumeToken(tokens, "]", "CLOSE_BRACKET", errors);
        } else {
            errors.push("Expected closing bracket ']' for roles.");
        }
    } else {
        errors.push("Roles should be wrapped in square brackets [].");
    }

    return roles;
}





