
import TypingText from "./typingText";
import WarriorArena from "./warriorArena";
import CountdownPopup from "./countdown";
import ResultPopup from "./result";



interface GameProps {
  room: {
    id: string;
    player1Id: string;
    player2Id: string | null;
    isActive: boolean;
    createdAt: Date;
    guestId: string | undefined;
  };
}

const GamePage: React.FC<GameProps> = ({ room }) => {
  return (
    <div className="relative min-h-screen bg-gray-800 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('/images/arena-background.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen">
        <CountdownPopup />
        <ResultPopup guestId={room.guestId} />
        {/* Warrior Arena */}
        <WarriorArena player1={room.player1Id} player2={room.player2Id} guestId={room.guestId}/>

        {/* Typing Prompt */}
        <div className="bg-gray-700 bg-opacity-90 rounded-lg p-6 shadow-lg mx-6 max-w-4xl text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400">
            Type the following text:
          </h2>
          <TypingText 
          text="Typing is a skill that requires not only speed but also precision. As you race against time, each keystroke must land with accuracy to avoid mistakes. Imagine navigating a dense jungle of words, where punctuation marks are hidden traps, and every misplaced letter slows you down. Success demands focus, resilience, and a sharp mind." 
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
