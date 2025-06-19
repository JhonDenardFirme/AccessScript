
import { Categorize } from "./Categorizer";

export function tokenize(sourceCode) {
    const tokenTypes = [
       
        
        { type: 'KEYWORD', regex: /\b(defUser|defRoute|defRole|defUserGroup|defRouteGroup|assign|grant|block|auth|redirect|revoke|push|pop|function|if|else|elseif|switch|case|for|while)\b/ }, 
        { type: 'RESERVED_WORD', regex: /\b(in)\b/ }, 

        { type: 'IDENTIFIER', regex: /[a-zA-Z][a-zA-Z0-9_]*/ }, 
        { type: 'COMMENT', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// }, 

        { type: 'OPEN_BRACKET', regex: /\[/ },
        { type: 'CLOSE_BRACKET', regex: /\]/ },
        { type: 'OPEN_CURLY', regex: /\{/ },
        { type: 'CLOSE_CURLY', regex: /\}/ },
        { type: 'OPEN_PAREN', regex: /\(/ },
        { type: 'CLOSE_PAREN', regex: /\)/},        

        { type: 'INCREMENT', regex: /\+\+/ },
        { type: 'DECREMENT', regex: /\-\-/ },
        
        { type: 'COMPOUND_OP', regex: /(\+=|\-=|\*=|\/=|\%=)/},
        { type: 'ARITHMETIC_OP', regex: /[\*\/\%\+\-]/},

        { type: 'EQUALITY_OP', regex: /==|!=/},
        { type: 'NOT_OP', regex: /!/ },

        { type: 'LOGICAL_OP', regex: /&&|\|\|/},
        { type: 'RELATIONAL_OP', regex: />=|<=|>|</},
          
        { type: 'STAT_TERMINATOR', regex: /;/},
        { type: 'ASSIGNMENT', regex: /=/},  
        { type: 'COLON', regex: /:/},
        { type: 'QUESTION', regex: /\?/},
        { type: 'COMMA', regex: /,/},

        { type: 'FLOAT_LITERAL', regex: /\b\d+\.\d+\b/ }, 
        { type: 'INT_LITERAL', regex: /\b\d+\b/ }, 

        { type: 'CHAR_LITERAL', regex: /(['"])[^'"]\1/ },
        { type: 'EMAILSTR_LITERAL', regex: /"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"/ },
        { type: 'ROUTESTR_LITERAL', regex: /^"\/([a-zA-Z0-9-]+(\/\.{3})?)"$/},

       
        { type: 'DOT_OP', regex: /\./},
        { type: 'STRING_LITERAL', regex: /"[^"]*"/},
        { type: 'WHITESPACE', regex: /\s+/ }, // Match whitespace

    ];

    const tokens = [];
    let currentPosition = 0;
    let currentLine = 1;

    
    while (currentPosition < sourceCode.length) {
        let matchFound = false;
        const remainingSource = sourceCode.slice(currentPosition);

        //console.log(`Remaining source: "${remainingSource}" , LENGTH: ${sourceCode.length - currentPosition}`);

        for (let { type, regex } of tokenTypes) {
            const match = regex.exec(remainingSource);

            if (match && match.index === 0) {
                const value = match[0];

                if (type !== 'WHITESPACE') {
                    
                    let token = { type, value, line: currentLine};
                    token = Categorize([token])[0];
                    tokens.push(token);

                }

                
                currentPosition += value.length;
                matchFound = true;

                if (value.includes('\n')) {
                    const newLines = value.split('\n').length - 1;
                    currentLine += newLines;
                }
                
                break; 
            }
        }

        if (!matchFound) {
            console.log(`No match found at position ${currentPosition}: ${sourceCode[currentPosition]}`);
            throw new Error(`Unexpected Character at position ${currentPosition}: ${sourceCode[currentPosition]}`);
        }
    }

    console.log(tokens);

    return tokens; 

}



