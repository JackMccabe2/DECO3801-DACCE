import "./App.css";
import Background from "../src/components/background";
import Header from "../src/components/header";
import Dashboard from "./views/dashboard";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Dashboard />
      </main>
      <Background />
    </>
  );
}

export default App;
