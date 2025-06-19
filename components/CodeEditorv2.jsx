import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { tokenize } from '@/libraries/Tokenizer'; 
import { BNFParser } from '@/libraries/BNFParser';

const CodeEditorv2 = () => {
    const [code, setCode] = useState("");
    const [tokens, setTokens] = useState([]);
    const [parsedResult, setParsedResult] = useState(null); 
    const [formattedJSON, setFormattedJSON] = useState("");  
    const [errors, setErrors] = useState([]);  

    const lineNumbers = Array.from({ length: code.split("\n").length }, (_, i) => i + 1);

    const handleChange = (e) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const newTokens = tokenize(code); 
            setTokens(newTokens); 

        } catch (error) {
            console.error("Error processing the code:", error);
        }
    };

    useEffect(() => {
        const parseTokens = async () => {
            if (tokens.length > 0) {
                try {
                    const { parsedResult, formattedJSON, errors } = await BNFParser(tokens); 
                    
                    // Only update state if values have changed
                    if (parsedResult !== parsedResult || formattedJSON !== formattedJSON || errors !== errors) {
                        setParsedResult(parsedResult);
                        setFormattedJSON(formattedJSON);
                        setErrors(errors);
                    } 
                } catch (error) {
                    console.error("Error in BNFParser:", error);
                }
            }
        };

        parseTokens();
    }, [tokens]); // Runs when tokens change

    const displayParsedResults = () => {
        console.log("CALLEDDDD");
        console.log(formattedJSON);
        console.log(errors);
        console.log(JSON.stringify(parsedResult, null, 2));  // Pretty print with 2 spaces indentation

    };

    const uploadCode = (e) => {
        setCode("");
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            console.log(`File name: ${fileName}`);

            if (fileName.endsWith('.acx')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const uploadedCode = e.target.result; 
                    console.log(uploadedCode); 
                    setCode(uploadedCode); 
                };
                reader.readAsText(file); 
            } else {
                alert('Please upload a valid .acx file.');
            }
        } else {
            console.log('No file selected.');
        }
    };

    return (
        <div className="w-full min-h-screen h-full bg-neutral-950 flex flex-col justify-center items-center px-16 pb-8">
            {/* Header and buttons */}
            <div className="header h-36 w-full flex justify-between items-center ">
                <Link className="h-20 w-auto flex justify-center items-center" href={'/'}>
                    <img src="ACCESSSCRIPTLOGO.png" className="object-cover h-10 w-auto hover:scale-110 transition-all duration-300 ease-out" />
                    <img src="ACCESSSCRIPTTITLE.png" className="object-cover h-4 w-auto ml-2" />
                </Link>
                <div className='flex flex-row gap-2'>
                    <button className="bg-transparent flex flex-row gap-2 justify-center items-center border-[1px] border-[#FA7527] text-slate-50 py-2 px-8 rounded-lg text-sm hover:cursor-pointer  hover:bg-orange-900 hover:bg-opacity-70 transition-all duration-300"
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <img src='/upload.svg' className='h-4' />
                        UPLOAD CODE
                    </button>
                    <input
                        accept=".acx"
                        id="file-upload"
                        type="file"
                        onChange={uploadCode}
                        style={{ display: 'none' }}
                    />
                    <button className="bg-[#00C0D3] flex flex-row gap-2 justify-center items-center text-slate-50 py-2 px-8 rounded-lg text-sm hover:cursor-pointer" onClick={handleSubmit}>
                        <img src='/submit.svg' className='h-4' />
                        SUBMIT
                    </button>
                </div>
            </div>

            {/* Code editor and analysis */}
            <div className="container w-full h-full grid grid-cols-3 rounded-xl border-[1px] border-neutral-800 flex-grow">
                <div className="code_editor w-full flex-grow col-span-2 flex flex-col items-center justify-center py-8 px-8">
                    <div className='border-[1px] border-neutral-800 rounded-lg h-12 p-4 flex justify-center items-center w-full gap-2'>
                        <img src='/code.svg' className='h-6' />
                        <p className='text-sm text-[#00C0D3]'>CODE EDITOR</p>
                    </div>
                    <div className="code_editor_area w-full h-full flex bg-transparent border-[1px] border-neutral-800 rounded-xl items-stretch mt-4 py-4">
                        <div className="line_numbers bg-transparent text-neutral-50 w-12 flex flex-col items-end pr-2 py-2 mr-2 ">{lineNumbers.map((line) => (
                            <div key={line} className="text-sm font-mono text-neutral-600">
                                {line}
                            </div>
                        ))}</div>
                        <textarea className="bg-transparent text-sm font-mono text-neutral-50 w-full h-full py-2 px-4 focus:outline-none"
                            value={code}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Code analysis */}
                <div className="code_analysis w-full h-full col-span-1 flex flex-col items-center justify-center py-8 px-8 overflow-y-auto">
                    {/* Token and AST sections */}
                    <div className='w-full h-32 border-[1px] border-neutral-800 rounded-xl flex flex-row gap-4 justify-center items-center p-4'>
                        <div className='border-[1px] border-[#FA7527] rounded-lg h-12 flex justify-center items-center w-full gap-2 hover:cursor-pointer hover:bg-orange-950 hover:bg-opacity-70 transition-all duration-300'>
                            <img src='/token.svg' className='h-6' />
                            <p className='text-sm text-[#FA7527]'>TOKENS</p>
                        </div>
                        <div className='border-[1px] border-neutral-800 rounded-lg h-12 flex justify-center items-center w-full gap-2 hover:border-[#00C0D3] hover:bg-teal-950 hover:cursor-pointer transition-all duration-300'
                        onClick={displayParsedResults}>
                            <img src='/ast_white.svg' className='h-6' />
                            <p className='text-sm '>AST</p>
                        </div>
                    </div>

                    {/* Token display */}
                    <div className="bg-transparent border-[1px] border-neutral-800 rounded-xl w-full h-full py-4 px-4 mt-4 flex flex-col justify-start items-center gap-4 focus:outline-none">
                        {tokens.map((token, index) => (
                            <div key={index} className={`w-full flex flex-col border-[1px] ${token.type === "IDENTIFIER" ? 'border-[#FA7527]' : 'border-[#00C0D3]'} text-base rounded-md items-center justify-center px-4 py-4 hover:bg-opacity-70 transition-all duration-300`}>
                                <div className='w-full h-6 flex flex-row items-center justify-between'>
                                    <p className='text-xs text-neutral-400'>{token.type}</p>
                                    <p className='text-xs text-neutral-400'>{token.category ? token.category : ""}</p>
                                </div>
                                <div className='text-base text-neutral-50 flex items-center justify-start w-full h-6'>
                                    {token.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodeEditorv2;
