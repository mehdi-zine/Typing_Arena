import TypingText from "./typingText";
import Warrior from "./warrior";

const Game = () => {
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
        {/* Fighters Section */}
        <div className="flex justify-center items-center gap-20 mt-10 relative">
          {/* Player 1 */}
          <div className="flex flex-col items-center">
            <Warrior playerId={1} />
            <div className="mt-2 flex flex-col items-center">
              <p className="text-lg font-semibold text-teal-400">You</p>
              
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center">
            <Warrior playerId={2} flipped={true} />
            <div className="mt-2 flex flex-col items-center">
              <p className="text-lg font-semibold text-teal-400">Guest</p>
            </div>
          </div>
        </div>

        {/* Typing Text Section */}
        <div className="bg-gray-700 bg-opacity-90 rounded-lg p-6 shadow-lg mx-6 max-w-4xl text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400">
            Type the following text:
          </h2>
          <TypingText text="In the heat of the battle, speed and accuracy decide the victor." />
        </div>

        {/* Input Section */}
        
      </div>
    </div>
  );
};

export default Game;
