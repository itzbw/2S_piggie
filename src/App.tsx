import { start } from "src/game";
import "./App.css";
import "src/game";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
      ref={(elem) => {
        if (!elem) return;
        if (elem.getAttribute("data-phaser")) return;
        elem.setAttribute("data-phaser", "true");
        start(elem);
      }}
    />
  );
}

export default App;
