import Warrior from "../components/warrior";

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
            <Warrior animation="idle" />
            <div className="mt-2 flex flex-col items-center">
              <p className="text-lg font-semibold text-teal-400">You</p>
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: "75%" }} // Example: 75% health
                ></div>
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center">
            <Warrior animation="hitting" flipped={true} />
            <div className="mt-2 flex flex-col items-center">
              <p className="text-lg font-semibold text-teal-400">Guest</p>
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: "50%" }} // Example: 50% health
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Typing Text Section */}
        <div className="bg-gray-700 bg-opacity-90 rounded-lg p-6 shadow-lg mx-6 max-w-4xl text-center">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400">
            Type the following text:
          </h2>
          <p className="text-lg md:text-xl font-mono mt-4 text-white">
            "In the heat of the battle, speed and accuracy decide the victor."
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full px-6 max-w-2xl mb-10">
          <input
            type="text"
            placeholder="Type here..."
            className="w-full p-4 rounded-lg text-gray-800 text-lg border-2 border-teal-400 focus:outline-none focus:border-teal-600 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
