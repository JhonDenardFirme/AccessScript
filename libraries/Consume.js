function consumeToken(tokens, expectedToken) {
    if (tokens[0] === expectedToken) {
        return tokens.shift();  // Consume the token
    }
    throw new Error(`Expected '${expectedToken}' but found '${tokens[0]}'`);
}

function isIdentifier(token) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
}

function isEmailStr(token) {
    return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(token);
}

function isRouteStr(token) {
    return /^\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/.test(token);
}
