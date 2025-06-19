import { consumeToken } from "./ParserLibrary/consumeToken";
import { parseDefUserDeclaration } from "./ParserLibrary/parseDefUserDeclaration";
import { parseDefUserGroupDeclaration } from "./ParserLibrary/parseDefUserGroupDeclaration";
import { parseDefRouteDeclaration } from "./ParserLibrary/parseDefRouteDeclaration";
import { parseDefRouteGroupDeclaration } from "./ParserLibrary/parseRouteGroupDeclaration";
import { parseDefRoleDeclaration } from "./ParserLibrary/parseDefRoleDeclaration";
import { parseAssignStatement } from "./ParserLibrary/parseAssignStatement";
import { parseRevokeStatement } from "./ParserLibrary/parseRevokeStatement";
import { parsePushStatement } from "./ParserLibrary/parsePushStatement";
import { parsePopStatement } from "./ParserLibrary/parsePopStatement";

import { parseGrantStatement } from "./ParserLibrary/parseGrantStatement";
import { parseBlockStatement } from "./ParserLibrary/parseBlockStatement";
import { parseAuthStatement } from "./ParserLibrary/parseAuthStatement";
import { parseRedirectStatement } from "./ParserLibrary/parseRedirectStatement";

import { parseFunctionDefition } from "./ParserLibrary/parseFunctionDefinition";
import { parseForEachStatement } from "./ParserLibrary/parseForEachStatement";
import { parseIfStatement } from "./ParserLibrary/parseIfStatement";

export async function BNFParser(tokens) {
    const errors = [];
    try {
        const parsedResult = parseMainFunction(tokens, errors);  // parsedResult is a JSON
        const formattedJSON = printJsonStructure(parsedResult);  // Hierarchical format string

        console.log(JSON.stringify(parsedResult, null, 2));
        console.log(formattedJSON);
        console.log(errors);

        return {
            parsedResult,
            formattedJSON,
            errors
        };
    } catch (error) {
        console.error("Critical Parsing Error:", error.message);
        return {
            parsedResult: null,
            formattedJSON: "",
            errors: [error.message]
        };
    }
}



function parseMainFunction(tokens, errors) {
    while (tokens.length > 0) {
        const token = tokens[0];

        // Parsing a function definition or the body
        if (token.type === "KEYWORD" && token.category === "FUNCTION") {
            consumeToken(tokens, "function", "KEYWORD", errors);
        } else if (token.type === "IDENTIFIER" && token.value === "OnLoad") {
            consumeToken(tokens, "OnLoad", "IDENTIFIER", errors);
        } else if (token.type === "OPEN_PAREN" && token.value === "(") {
            consumeToken(tokens, "(", "OPEN_PAREN", errors);
        } else if (token.type === "CLOSE_PAREN" && token.value === ")") {
            consumeToken(tokens, ")", "CLOSE_PAREN", errors);
        } else if (token.value === "{") {
            consumeToken(tokens, "{", "OPEN_CURLY", errors);
            const statements = parseStatements(tokens, errors);
            consumeToken(tokens, "}", "CLOSE_CURLY", errors);

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

            const errorMessage = `[Line ${unexpected?.line ?? 'Unknown'}]: Unexpected Token with value '${unexpected.value}'`;
            errors.push(errorMessage);
            console.warn(errorMessage);

            
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
        } else if (token.type === "KEYWORD" && token.category === "DEFUSERGROUP") {
            statements.push(parseDefUserGroupDeclaration(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "DEFROUTE") {
            statements.push(parseDefRouteDeclaration(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "DEFROUTEGROUP") {
            statements.push(parseDefRouteGroupDeclaration(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "DEFROLE") {
            statements.push(parseDefRoleDeclaration(tokens, errors));


        } else if (token.type === "KEYWORD" && token.category === "ASSIGN") {
            statements.push(parseAssignStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "REVOKE") {
            statements.push(parseRevokeStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "PUSH") {
            statements.push(parsePushStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "POP") {
            statements.push(parsePopStatement(tokens, errors));
        
        } else if (token.type === "KEYWORD" && token.category === "GRANT") {
            statements.push(parseGrantStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "BLOCK") {
            statements.push(parseBlockStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "AUTH") {
            statements.push(parseAuthStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "REDIRECT") {
            statements.push(parseRedirectStatement(tokens, errors));


        } else if (token.type === "KEYWORD" && token.category === "FUNCTION") {
            statements.push(parseFunctionDefition(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "FOR") {
            statements.push(parseForEachStatement(tokens, errors));
        } else if (token.type === "KEYWORD" && token.category === "IF") {
            statements.push(parseIfStatement(tokens, errors));

        } else {
            const token = tokens[0];
            const errorMessage = `[Line ${token?.line ?? 'Unknown'}]: Unexpected Token with value '${token.value}'`;
            errors.push(errorMessage);
            console.warn(errorMessage);
            const unexpected = tokens.shift();

        }
    }
    return statements;
}





// --------------------

function printJsonStructure(json, level = 0, parentIsLast = false) {
    let result = '';
    const indent = '  '.repeat(level);  // Spaces for structure indentation
    const connector = parentIsLast ? '└── ' : '├── ';  // Use different connectors for last item

    // Check if the current element is an object or an array
    if (typeof json === 'object' && json !== null) {
        // If it's an array, we need to iterate through its elements
        if (Array.isArray(json)) {
            json.forEach((item, index) => {
                result += `${indent}${index === json.length - 1 ? '└── ' : '├── '}`;
                result += printJsonStructure(item, level+1, index === json.length - 1); // child values are not indented
                
            });
        } else {
            // It's an object, iterate through its properties
            const keys = Object.keys(json);
            keys.forEach((key, index) => {
                result += `${indent}${index === keys.length - 1 ? '└── ' : '├── '}${key}: `;
                
                // If the value is an object or array, recursively process it (child values won't have extra indentation)
                if (typeof json[key] === 'object' && json[key] !== null) {
                    result += `\n${printJsonStructure(json[key], level, index === keys.length - 1)}`; // child objects/arrays
                } else {
                    // Otherwise, print the primitive value directly without extra indentation
                    result += `${JSON.stringify(json[key])}\n`;
                }
            });
        }
    } else {
        // If it's a primitive value (string, number, etc.), print it directly with no extra indentation
        result += `${indent}${JSON.stringify(json)}\n`;
    }

    return result;
}



/*


function printJsonStructure(json, level = 0, parentIsLast = false) {
    let result = '';
    const indent = '  '.repeat(level);  // Spaces for structure indentation
    const connector = parentIsLast ? '└── ' : '├── ';  // Use different connectors for last item

    // Check if the current element is an object or an array
    if (typeof json === 'object' && json !== null) {
        // If it's an array, we need to iterate through its elements
        if (Array.isArray(json)) {
            json.forEach((item, index) => {
                result += `${indent}${index === json.length - 1 ? '└── ' : '├── '}`;
                result += printJsonStructure(item, level+1, index === json.length - 1); // child values are not indented
                
            });
        } else {
            // It's an object, iterate through its properties
            const keys = Object.keys(json);
            keys.forEach((key, index) => {
                result += `${indent}${index === keys.length - 1 ? '└── ' : '├── '}${key}: `;
                
                // If the value is an object or array, recursively process it (child values won't have extra indentation)
                if (typeof json[key] === 'object' && json[key] !== null) {
                    result += `\n${printJsonStructure(json[key], level, index === keys.length - 1)}`; // child objects/arrays
                } else {
                    // Otherwise, print the primitive value directly without extra indentation
                    result += `${JSON.stringify(json[key])}\n`;
                }
            });
        }
    } else {
        // If it's a primitive value (string, number, etc.), print it directly with no extra indentation
        result += `${indent}${JSON.stringify(json)}\n`;
    }

    return result;
}

*/