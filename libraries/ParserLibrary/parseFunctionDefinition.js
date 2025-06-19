import { consumeToken } from "./consumeToken";
import { parseDefUserDeclaration } from "./parseDefUserDeclaration";
import { parseDefUserGroupDeclaration } from "./parseDefUserGroupDeclaration";
import { parseDefRouteDeclaration } from "./parseDefRouteDeclaration";
import { parseDefRouteGroupDeclaration } from "./parseRouteGroupDeclaration";
import { parseDefRoleDeclaration } from "./parseDefRoleDeclaration";
import { parseAssignStatement } from "./parseAssignStatement";
import { parseRevokeStatement } from "./parseRevokeStatement";
import { parsePushStatement } from "./parsePushStatement";
import { parsePopStatement } from "./parsePopStatement";

import { parseGrantStatement } from "./parseGrantStatement";
import { parseBlockStatement } from "./parseBlockStatement";
import { parseAuthStatement } from "./parseAuthStatement";
import { parseRedirectStatement } from "./parseRedirectStatement";
import { parseForEachStatement } from "./parseForEachStatement";
import { parseIfStatement } from "./parseIfStatement";

import { parseParamList } from "./parseParamList";

export function parseFunctionDefition(tokens, errors) {
    let functionToken = null;
    let functionName = null;
    let paramList = null;

    while (tokens.length > 0) {
        const token = tokens[0];



        // Parsing a function definition or the body
        if (token.type === "KEYWORD" && token.category === "FUNCTION") {
            consumeToken(tokens, "function", "KEYWORD", errors);
        } else if (token.type === "IDENTIFIER"){
            functionToken = consumeToken(tokens, null, "IDENTIFIER", errors);
            functionName = functionToken.value;


            paramList = parseParamList(tokens, errors);

        } else if (token.value === "{") {
            consumeToken(tokens, "{", "OPEN_CURLY", errors);
            const statements = parseStatements(tokens, errors);
            consumeToken(tokens, "}", "CLOSE_CURLY", errors);

            return {
                type: "Function Definition",
                name: functionName,
                params: paramList,
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
        type: "Function Definition",
        name: functionName,
        params: paramList,
        body: [],
        error: "Function Definition is not valid",
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

