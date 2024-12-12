import Link from "next/link";

const MainCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Card Title */}
      <h2 className="text-2xl font-bold text-teal-800 mb-4 text-center">Welcome to Typing Arena!</h2>

      {/* Card Content */}
      <p className="text-lg text-gray-600 mb-6 text-center">
        Get ready to join the arena. Click below to start playing!
      </p>

      {/* Button Section */}
      <div className="flex justify-center">
        <Link
          className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#FF9472] transition duration-200"
          href="/game"
        >
          Play Now
        </Link>
      </div>
    </div>
  );
};
  
  export default MainCard;