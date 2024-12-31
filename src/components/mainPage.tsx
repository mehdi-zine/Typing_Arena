import MainCard from "./mainCard";
import LeaderBoardCard from "./leaderBoardCard";

const MainPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen mt-8">
            <div className="pt-16 mx-10 xs:mx-4 md:mx-20 lg:mx-28">
                <div className="flex flex-col md:flex-row gap-10">

                    <div className="w-full md:w-2/3">
                        <MainCard />
                    </div>

                    <div className="w-full md:w-1/3">
                        <LeaderBoardCard />
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  export default MainPage;