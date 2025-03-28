import "./App.css";

import Background from "../src/components/background";
import Header from "../src/components/header";
import PlayGame from "../src/components/playGame";

import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  return (
    <>
      <Background />
      <PlayGame />
      </>
  );
}

export default App;
