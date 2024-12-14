import { GameProvider } from "../../context/GameContext";
import Game from "../../components/game";

const App = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);

export default App;