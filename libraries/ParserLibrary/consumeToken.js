export function consumeToken(tokens, expectedValue = null, expectedType = null, errors) {
    const token = tokens[0];

    // Check type if expectedType is provided
    if (expectedType && token.type !== expectedType) {
        const errorMessage = `[Line ${token?.line ?? 'Unknown'}]: Expected type '${expectedType}' but found type '${token.type}'`;
        errors.push(errorMessage);
        console.warn(errorMessage);
    }

    // Check value if expectedValue is provided
    if (expectedValue && token.value !== expectedValue) {
        const errorMessage = `[Line ${token?.line ?? 'Unknown'}]: Expected value '${expectedValue}' but found value '${token.value}'`;
        errors.push(errorMessage);
        console.warn(errorMessage);
    }

    // Consume the token and return it if it matches the expected type/value
    if ((!expectedValue || token.value === expectedValue) && (!expectedType || token.type === expectedType)) {
        return tokens.shift();  // Token matches, so consume it
    }

    // If not matching, report the mismatch and return an error token
    const errorMessage = `[Line ${token?.line ?? 'Unknown'}]: Expected '${expectedValue || expectedType}' but found '${token.value}' of type '${token.type}'`;
    errors.push(errorMessage);
    console.warn(errorMessage);

    return { type: "ERROR", value: `ERROR_${expectedValue ?? expectedType}`, line: token?.line ?? "Unknown" };
}
