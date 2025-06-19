import { consumeToken } from "./consumeToken";

export function parseParamList(tokens, errors) {

        const roles = [];
        let errorCount = 0;
        let lastWasString = false; // Track if the last token was a STRING_LITERAL

        let userToken = null;
        let user = null;  // Declare user outside the if/else block
        let nextToken = tokens[0];
        let groupToken = null;
        let group = null;

    
        if (tokens[0] && tokens[0].value === "(") {
            consumeToken(tokens, "(", "OPEN_PAREN", errors);
    
            if (tokens[0] && tokens[0].value === ")") {
                consumeToken(tokens, ")", "CLOSE_PAREN", errors);
                return roles; // Return empty list
            }
    
            while (tokens.length > 0 && tokens[0].value !== ")") {

                const roleToken = consumeToken(tokens, null, "IDENTIFIER", errors);
    
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
                    if (!tokens[0] || tokens[0].type !== "IDENTIFIER") {
                        errors.push("Expected IDENTIFIER after ',' but found something else.");
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
                errors.push("Param List must end with a IDENTIFIER, not a comma.");
            }
    
            if (tokens.length > 0 && tokens[0].value === ")") {
                consumeToken(tokens, ")", "CLOSE_PAREN", errors);
            } else {
                errors.push("Expected closing bracket ')' for Param List.");
            }
        } else {
            errors.push("Param List should be wrapped in parenthesis ().");
        }
    
        return roles;
    
    
    
    
}    