import Image from "next/image";


const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-white py-1 shadow-md flex items-center justify-between xs:px-4 md:px-20 lg:pl-24 lg:pr-28">
      <Image 
        className=""
        alt="logo"
        src="/images/Logo.png"
        width={120}
        height={120}
        layout="intrinsic"
      />
      <div className="flex items-center justify-between xs:gap-4 sm:gap-12">
        <div className="flex items-center text-teal-800">
          {/* Icon */}
          <div className="rounded-full w-12 h-12 bg-white shadow border-2 border-teal-800 flex items-center justify-center mr-[1px]">
            <div className="w-6 h-6">
              <svg
                version="1.0"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                enableBackground="new 0 0 64 64"
                fill="#115e59"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g>
                  {" "}
                  <path
                    fill="#115E59"
                    d="M60,6h-7V4c0-2.211-1.789-4-4-4H15c-2.211,0-4,1.789-4,4v2H4c-2.211,0-4,1.789-4,4v8 c0,6.075,4.925,11,11,11h0.096C12.01,38.66,19.477,46.396,29,47.762V56h-7c-2.211,0-4,1.789-4,4v3c0,0.553,0.447,1,1,1h26 c0.553,0,1-0.447,1-1v-3c0-2.211-1.789-4-4-4h-7v-8.238C44.523,46.396,51.99,38.66,52.904,29H53c6.075,0,11-4.925,11-11v-8 C64,7.789,62.211,6,60,6z M6,18v-6h5v11C8.238,23,6,20.762,6,18z M39.712,21.048l-3.146,3.227l0.745,4.564 c0.062,0.378-0.099,0.758-0.411,0.979C36.728,29.938,36.525,30,36.323,30c-0.166,0-0.333-0.041-0.484-0.125l-3.841-2.123 l-3.841,2.123c-0.336,0.186-0.748,0.163-1.061-0.058s-0.473-0.601-0.411-0.979l0.745-4.564l-3.146-3.227 c-0.262-0.269-0.352-0.66-0.232-1.016s0.427-0.614,0.797-0.671l4.309-0.658l1.936-4.123c0.165-0.352,0.518-0.575,0.905-0.575 s0.74,0.224,0.905,0.575l1.936,4.123l4.309,0.658c0.37,0.057,0.678,0.315,0.797,0.671S39.974,20.779,39.712,21.048z M58,18 c0,2.762-2.238,5-5,5V12h5V18z"
                  ></path>{" "}
                  <path
                    fill="#115E59"
                    d="M33.255,20.036l-1.257-2.678l-1.257,2.678c-0.142,0.302-0.425,0.514-0.754,0.563l-2.913,0.445l2.141,2.194 c0.222,0.228,0.322,0.546,0.271,0.859l-0.495,3.03l2.522-1.396c0.151-0.083,0.317-0.125,0.484-0.125s0.333,0.042,0.484,0.125 l2.522,1.396l-0.495-3.03c-0.051-0.313,0.05-0.632,0.271-0.859l2.141-2.194L34.009,20.6C33.68,20.55,33.396,20.338,33.255,20.036z"
                  ></path>{" "}
                </g>
              </svg>
            </div>
          </div>
          {/* Score */}
          <div className="rounded-3xl rounded-l-none text-center bg-white border-2 border-teal-800 -ml-2 z-0 border-l-0 h-8 pl-5 pr-4 flex items-center justify-center">
            <span className="font-semibold text-lg">1,200</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-7">
          <p>guest</p>
          <Image
            className="rounded-full h-12 w-12 bg-slate-50 flex items-center justify-center"
            src="/images/placeholder_profile_pic.png"
            alt="guest"
            width={200}
            height={200}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
