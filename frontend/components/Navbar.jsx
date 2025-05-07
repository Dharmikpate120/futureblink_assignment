import React, { useContext } from "react";
import SigninSignupModal from "./SigninSignupModal";
import ServerAPI from "../context/ServerContext";
import { Link } from "react-router-dom";
function Navbar() {
  const { auth_token, signOut } = useContext(ServerAPI);
  return (
    <nav className="bg-gray-100 shadow-md border-b border-gray-300 sticky top-0 left-0 w-full flex justify-center items-center backdrop-filter backdrop-blur-md z-50 py-2">
      <div className="container mx-auto px-10 h-full flex items-center justify-between w-[80%]">
        <Link to="/" className="text-xl font-bold text-gray-800 ml-5">
          SalesBlink
        </Link>

        <div className="space-x-4 md:flex flex items-center justify-center gap-6">
          <SigninSignupModal />
          {auth_token && (
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 mx-4 border border-gray-400 rounded shadow"
              onClick={signOut}
            >
              Signout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
