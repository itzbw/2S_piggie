import { start } from "src/game.js";
import "./App.css";
import "src/game.js";

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
