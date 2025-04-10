// Import Xterm and FitAddon
import React, { useEffect, useState, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "../css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null); // store fitAddon in a ref

  useEffect(() => {
    const term = new Terminal();
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;

    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    term.writeln("Welcome to QuantumHeist Terminal 💻");
    term.write("alex@cool-hack-game % ");

    let userInputData = "";
    term.onData((data) => {
      if (data === "\r") {
        term.writeln("");
        handleInput(term, userInputData);
        userInputData = "";
      } else if (data === "\u007f") {
        userInputData = userInputData.slice(0, -1);
        term.write("\b \b");
      } else {
        term.write(data);
        userInputData += data;
      }
    });

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    // Attach resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInput = (term, input) => {
    if (input === "help") {
      term.writeln("Available commands: help, start");
    } else if (input === "start") {
      term.writeln("Starting the game...");
    } else {
      term.writeln(`Unknown command: ${input}`);
    }
    term.write("alex@cool-hack-game % ");
  };

  return <div ref={terminalRef} className="custom-terminal" />;
};

export default TerminalComponent;