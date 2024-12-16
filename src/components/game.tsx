
import TypingText from "./typingText";
import WarriorArena from "./warriorArena";

interface GameProps {
  room: {
    id: string;
    player1Id: string;
    player2Id: string | null;
    isActive: boolean;
    createdAt: Date;
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
        {/* Warrior Arena */}
        <WarriorArena roomId={room.id} player1Id={room.player1Id} player2Id={room.player2Id} />

        {/* Typing Prompt */}
        <div className="bg-gray-700 bg-opacity-90 rounded-lg p-6 shadow-lg mx-6 max-w-4xl text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400">
            Type the following text:
          </h2>
          <TypingText 
          text="a a a a a a a" 
          roomId={room.id}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
