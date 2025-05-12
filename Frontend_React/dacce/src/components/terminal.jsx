// Import Xterm and FitAddon
import React, { useEffect, useState, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

// Import Context Variables
import { useUser } from "../contexts/UserContext";

// Import CSS
import "../css/xterm.css";

// Import Context Variables
import { useUser } from "../contexts/UserContext";

const TerminalComponent = ({ onCommand }) => {
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null); // store fitAddon in a ref
  const { user } = useUser();

  useEffect(() => {
    const term = new Terminal();
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;

    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    const handleInput = (term, input) => {
      if (onCommand) onCommand(input); // Call parent handler with user input

      if (input === "help") {
        term.writeln("Available commands: help, start");
      } else if (input === "start") {
        term.writeln("Starting the game...");
      } else {
        term.writeln(`Unknown command: ${input}`);
      }

      term.write("alex@cool-hack-game % ");
    };

    term.writeln("Welcome to QuantumHeist Terminal 💻");
    term.write(`${user.username}` + "@cool-hack-game % ");

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
    term.write(`${user.username}` + "@cool-hack-game % ");
  };

  return <div ref={terminalRef} className="custom-terminal" />;
};

export default TerminalComponent;
