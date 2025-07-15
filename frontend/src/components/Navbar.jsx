import React from "react";
import code_logo from '../assets/code_logo.png';
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsLoggedIN }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIN(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md rounded-lg mx-2 my-1 flex items-center justify-between px-3 py-2 gap-1">
            <div onClick={()=>navigate("/home")} className="flex items-center space-x-2">
                <img src={code_logo} alt="Code Logo" className="h-7 w-7 object-contain" />
                <span className="text-lg font-semibold text-gray-800">Code Helper</span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => navigate("/home")}
                    className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    Home
                </button>
                <button
                    onClick={() => navigate("/history")}
                    className="px-3 py-1.5 rounded bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                >
                    History
                </button>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;