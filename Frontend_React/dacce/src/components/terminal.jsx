// Import Xterm.js
import { Terminal } from '@xterm/xterm';

// Import React
import { useEffect } from "react";

import "../css/appWindow.css";

const TerminalWindow = () => {
  useEffect(() => {
    const term = new Terminal();
    const termContainer = document.getElementById("terminal");

    if (termContainer) {
      term.open(termContainer);

      term.onData(e => {
        // Simulate echoing typed text
        term.write(e);
      });

      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    }

    return () => {
      term.dispose();
    };
  }, []);

  return (
    <div id="terminal" className='custom-terminal'></div>
  );
};

export default TerminalWindow;