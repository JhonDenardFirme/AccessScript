import { consumeToken } from "./consumeToken";

export function parsePopStatement(tokens, errors) {
    // Consume 'push' keyword (type and value must match)
    consumeToken(tokens, "pop", "KEYWORD", errors);
    consumeToken(tokens, "(", "OPEN_PAREN", errors);

    let userToken = null;
    let user = null;  // Declare user outside the if/else block
    let nextToken = tokens[0];
    let groupToken = null;
    let group = null;

    // Handle user assignment
    if (nextToken?.type === "IDENTIFIER") {
        userToken = consumeToken(tokens, null, "IDENTIFIER", errors);
        if (!userToken) {
            return {
                type: "PopStatement",
                pop: null,
                popFromGroup: null,
                error: "Expected IDENTIFIER inside 'pop'"
            };
        }
        user = userToken.value;  // Assign value to 'user'

    } else if (nextToken?.type === "EMAILSTR_LITERAL") {
        userToken = consumeToken(tokens, null, "EMAILSTR_LITERAL", errors);
        if (!userToken) {
            return {
                type: "PopStatement",
                pop: null,
                popFromGroup: null,
                error: "Expected EMAILSTR_LITERAL inside 'pop'"
            };
        }
        user = userToken.value;  // Assign value to 'user'
    }

    // Consume the comma (',') and expect the group (which is an IDENTIFIER)
    consumeToken(tokens, ",", "COMMA", errors);

    // Expect group to be an IDENTIFIER
    groupToken = consumeToken(tokens, null, "IDENTIFIER", errors);
    if (!groupToken) {
        return {
            type: "PopStatement",
            pop: user,
            popFromGroup: null,
            error: "Expected IDENTIFIER for group inside 'pop'"
        };
    }
    group = groupToken.value;  // Assign value to 'group'

    consumeToken(tokens, ")", "CLOSE_PAREN", errors);

    // Consume the statement terminator ';'
    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);
    if (!statTerminatorToken) {
        errors.push(`[Line ${userToken.line ?? 'Unknown'}]: Expected ';' but not found.`);
    }

    return {
        type: "PopStatement",
        pop: user,  // The user will now be assigned correctly
        popFromGroup: group,  // The group will now be assigned correctly
        error: statTerminatorToken ? null : "Missing statement terminator ';'"
    };
}
