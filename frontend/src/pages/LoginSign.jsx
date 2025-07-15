import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Signup from "../components/Signup";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";

const LoginSign = ({onLoginSuccess}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success && data.token) {
        // store token and user info
        localStorage.setItem("token", data.token);
        //store user info
        localStorage.setItem("user", JSON.stringify(data.user));
        if (typeof onLoginSuccess === "function") {
          toast.success("Login successful");
          onLoginSuccess();
        }
      } else {
        toast.error(data.message || "Invalid email or password");
      }

      setFormData({
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Please check your credentials.");

    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[90%] flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full h-full p-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handlechange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handlechange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-xl text-gray-500 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner size={28} /> : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-2 text-blue-600 hover:underline font-semibold"
          >
            Register
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setOpen(false)}
            >
              <RxCross2 />
            </button>
            <Signup setOpen={setOpen} />
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginSign;





