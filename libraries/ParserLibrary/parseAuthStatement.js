import { consumeToken } from "./consumeToken";

export function parseAuthStatement(tokens, errors) {
    // Consume 'assign' keyword (type and value must match)
    consumeToken(tokens, "auth", "KEYWORD", errors);
    consumeToken(tokens, "(", "OPEN_PAREN", errors);

    let routeToken = null;
    let route = null;

    let nextToken = tokens[0];

    if (nextToken?.type === "STRING_LITERAL") {
        routeToken = consumeToken(tokens, null, "STRING_LITERAL", errors);
        route = routeToken.value;
    }
    else if (nextToken?.type === "IDENTIFIER") {
        routeToken = consumeToken(tokens, null, "IDENTIFIER", errors);
        route = routeToken.value;
    }

    if (!routeToken) {
        errors.push("Expected STRING or IDENTIFIER inside 'auth'");
        console.warn("Expected STRING or IDENTIFIER inside 'auth'");
        return {
            type: "AuthStatement",
            route: null,
            error: "Expected STRING or IDENTIFIER inside 'auth'"
        };
    }



    consumeToken(tokens, ")", "CLOSE_PAREN", errors);

    // Consume the statement terminator ';'
    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);
    if (!statTerminatorToken) {
        errors.push(`[Line ${userToken.line ?? 'Unknown'}]: Expected ';' but not found.`);
    }

    return {
        type: "AuthStatement",
        route: route,
        error: statTerminatorToken ? null : "Missing statement terminator ';'"
    };
}
