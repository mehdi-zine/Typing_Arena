// components/game.tsx
import PlayerStatus from "./playerStatus";
import TypingText from "./typingText";

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
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('/images/arena-background.webp')`, // Replace with your background image
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen">
        {/* Player Status Section */}
        <PlayerStatus 
          roomId={room.id} 
          player1Id={room.player1Id} 
          player2Id={room.player2Id} 
        />

        {/* Typing Text Section */}
        <div className="bg-gray-700 bg-opacity-90 rounded-lg p-6 shadow-lg mx-6 max-w-4xl text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400">
            Type the following text:
          </h2>
          <TypingText text="In the heat of the battle, speed and accuracy decide the victor." />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
