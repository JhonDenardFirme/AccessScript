export function BNFParser(tokens) {
    const errors = [];
    try {
        const parsedResult = parseMainFunction(tokens, errors);
        console.log("----------------Parsing Completed!");
        console.log("Parsed Result:", JSON.stringify(parsedResult, null, 2));
        if (errors.length > 0) {
            console.log("Parsing Errors:", errors);
        }
    } catch (error) {
        console.error("Critical Parsing Error:", error.message);
    }
}

// Helper function to handle token consumption and error reporting
function consumeToken(tokens, expectedValue, errors, typeCheck = null) {
    const token = tokens[0];
    if (token && (expectedValue ? token.value === expectedValue : typeCheck && token.type === typeCheck)) {
        return tokens.shift();  // Token matches, so consume it
    }

    const errorMessage = `[Line ${token?.line ?? 'Unknown'}]: Expected '${expectedValue || typeCheck}' but found '${token ? token.value : 'undefined'}'`;
    errors.push(errorMessage);
    console.warn(errorMessage);

    return { type: "ERROR", value: `ERROR_${expectedValue || typeCheck}`, line: token?.line ?? "Unknown" };
}



function parseMainFunction(tokens, errors) {
    while (tokens.length > 0) {
        const token = tokens[0];

        // Parsing a function definition or the body
        if (token.type === "KEYWORD" && token.category === "FUNCTION") {
            consumeToken(tokens, "function", errors);
        } else if (token.type === "IDENTIFIER" && token.value === "OnLoad") {
            consumeToken(tokens, "OnLoad", errors);
        } else if (token.value === "{") {
            consumeToken(tokens, "{", errors);
            const statements = parseStatements(tokens, errors);
            consumeToken(tokens, "}", errors);

            return {
                type: "MainFunction",
                name: "OnLoad",
                body: statements,
            };
        } else {
            // Handle unexpected tokens
            const unexpected = tokens.shift();
            errors.push(`[Line ${unexpected.line ?? "Unknown"}]: Skipping unexpected token '${unexpected.value}'`);
            console.warn(`Skipping unexpected token '${unexpected.value}'`);
        }
    }

    return {
        type: "MainFunction",
        name: "OnLoad",
        body: [],
        error: "Function declaration not found",
    };
}




function parseStatements(tokens, errors) {
    const statements = [];

    while (tokens.length > 0 && tokens[0].value !== "}") {
        const token = tokens[0];

        // Handle specific statements
        if (token.type === "KEYWORD" && token.category === "DEFUSER") {
            statements.push(parseDefUserDeclaration(tokens, errors));
        } else {
            const unexpected = tokens.shift();
            errors.push(`[Line ${unexpected.line ?? "Unknown"}]: Skipping unexpected token '${unexpected.value}'`);
            console.warn(`Skipping unexpected token '${unexpected.value}'`);
        }
    }

    return statements;
}


function parseDefUserDeclaration(tokens, errors) {

    while (tokens.length > 0) {
        const token = tokens[0];
        // Parsing a function definition or the body
        if (token.type === "KEYWORD" && token.category === "DEFUSER") {
            consumeToken(tokens, "function", errors);
        } else if (token.type === "IDENTIFIER"){
            consumeToken(tokens,errors);
        } else if (token.type === "ASSIGNMENT") {
            consumeToken(tokens, "=", errors);
        } else if (token.type === "OPEN_CURLY") {
            consumeToken(tokens, "{", errors);
            const statements = null;
            consumeToken(tokens, "}", errors);

            return {
                type: "DefUser Declaration",
                body: statements,
            };
        } else {
            // Handle unexpected tokens
            const unexpected = tokens.shift();
            errors.push(`[Line ${unexpected.line ?? "Unknown"}]: Skipping unexpected token '${unexpected.value}'`);
            console.warn(`Skipping unexpected token '${unexpected.value}'`);
        }
    }


    

    /*
    // Consume the identifier (user name)
    const identifier = consumeToken(tokens, null, errors, "IDENTIFIER");
    if (identifier.type === "ERROR") return { type: "DefUserDeclaration", error: "Invalid or missing identifier" };

    consumeToken(tokens, "=", errors);  // '=' token

    consumeToken(tokens, "{", errors);  // Opening curly brace

    // Parse the email
    const email = parseEmailStr(tokens, errors);
    if (!email) return { type: "DefUserDeclaration", identifier, error: "Invalid or missing email" };

    consumeToken(tokens, ",", errors);  // Comma separator

    // Parse the role list
    const roleList = parseRoleList(tokens, errors);
    if (!roleList) return { type: "DefUserDeclaration", identifier, email, error: "Invalid or missing role list" };

    consumeToken(tokens, "}", errors);  // Closing curly brace

    return {
        type: "DefUserDeclaration",
        defUser: identifier,
        email: email,
        roleList: roleList,
    };
    */
    return {
        type: "DefUserDeclaration",
        defUser: identifier,
        email: email,
        roleList: roleList,
    };
}

function parseEmailStr(tokens, errors) {
    // Check if token is a valid email string
    return tokens.length > 0 && tokens[0].type === "EMAILSTR_LITERAL" ? consumeToken(tokens, tokens[0].value, errors).value : null;
}

function parseRoleList(tokens, errors) {
    consumeToken(tokens, "[", errors);  // Open bracket for role list

    const roles = [];
    while (tokens.length > 0 && tokens[0].type !== "CLOSE_BRACKET") {
        if (tokens[0].type === "IDENTIFIER") {
            roles.push(consumeToken(tokens, tokens[0].value, errors).value);
        } else if (tokens[0].type === "COMMA") {
            consumeToken(tokens, ",", errors);
        } else {
            const unexpected = tokens.shift();
            errors.push(`[Line ${unexpected.line ?? "Unknown"}]: Unexpected token in role list: '${unexpected.value}'`);
            console.warn(`Skipping unexpected token '${unexpected.value}'`);
        }
    }

    consumeToken(tokens, "]", errors);  // Close bracket for role list

    return roles.length > 0 ? roles : null;
}



/*

// Parse an email string
function parseEmailStr(tokens) {
    if (!isEmailStr(tokens[0])) {
        throw new Error("Expected EmailStr");
    }
    return tokens.shift();  // Return the email
}

// Parse role list
function parseRoleList(tokens) {
    consumeToken(tokens, "[");
    const roles = [];
    parseRoles(tokens, roles);
    consumeToken(tokens, "]");
    return roles;
}

// Parse roles inside a list
function parseRoles(tokens, roles) {
    if (!isIdentifier(tokens[0])) {
        throw new Error("Expected a role");
    }
    roles.push(tokens.shift()); // Add the role to the list

    while (tokens[0] === ",") {
        consumeToken(tokens, ",");
        parseRoles(tokens, roles);
    }
}


// Format the tree into a string representation
function formatTree(node, depth = 0) {
    let result = "  ".repeat(depth) + node.type + "\n";
    for (const key in node) {
        if (key !== 'type' && node[key]) {
            if (Array.isArray(node[key])) {
                result += "  ".repeat(depth + 1) + key + "\n";
                node[key].forEach(child => {
                    result += formatTree(child, depth + 2);
                });
            } else {
                result += "  ".repeat(depth + 1) + key + ": " + node[key] + "\n";
            }
        }
    }
    return result;
}


*/