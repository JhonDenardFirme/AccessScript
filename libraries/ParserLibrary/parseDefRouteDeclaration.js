import { consumeToken } from "./consumeToken";

export function parseDefRouteDeclaration(tokens, errors) {
    // Consume 'defRoute' keyword (type and value must match)
    consumeToken(tokens, "defRoute", "KEYWORD", errors);

    // Consume IDENTIFIER
    let routeToken = consumeToken(tokens, null, "IDENTIFIER", errors);

    // If IDENTIFIER is missing, return an error structure but continue parsing
    if (!routeToken) {

        errors.push("Expected IDENTIFIER after 'defRoute'");
        console.warn("Expected IDENTIFIER after 'defRoute'");
        return {
            type: "DefRouteDeclaration",
            route: null,
            routeValue: null,
            error: "Expected IDENTIFIER after 'defRoute'"
        };
    }

    const route = routeToken.value;
    let routeValue = null; // Ensure routeValue is always defined

    let nextToken = tokens[0];

    if (nextToken?.type === "STAT_TERMINATOR") {
        consumeToken(tokens, ";", "STAT_TERMINATOR", errors);
        return {
            type: "DefRouteDeclaration",
            route: route,
            routeValue: null,
            error: null
        };
    } else if (nextToken?.type === "ASSIGNMENT") {
        consumeToken(tokens, "=", "ASSIGNMENT", errors);

        let nextToken2 = tokens[0];

        if (nextToken2?.type === "STRING_LITERAL" || nextToken2?.type === "ROUTESTR_LITERAL") {
            const routeValueToken = consumeToken(tokens, null, nextToken2.type, errors);
            routeValue = routeValueToken.value;
        }
    }

    let statTerminatorToken = consumeToken(tokens, ";", "STAT_TERMINATOR", errors);
    if (!statTerminatorToken) {
        errors.push(`[Line ${routeToken.line ?? 'Unknown'}]: Expected ';' but not found.`);
    }

    return {
        type: "DefRouteDeclaration",
        route: route,
        routeValue: routeValue,
        error: statTerminatorToken ? null : "Missing statement terminator ';'"
    };
}


