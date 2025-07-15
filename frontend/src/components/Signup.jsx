import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import Verify from "./Verify";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

const Signup = ({ setOpen }) => {
  const [formdata, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formdata;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formdata.name,
          email: formdata.email,
          password: formdata.password,
        }),
      });
      const result = await response.json();
      if(result.success){
        toast.success(result.message || "Signup successful! Please verify your email.");
        setVerifyEmail(formdata.email);
        setShowVerify(true);
      }
      else {
        toast.error(result.message || "Signup failed");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setLoading(false);
    } catch (e) {
      toast.error("Signup failed");
      console.error("Signup error:", e);
      setLoading(false);
    }
  };

  if (showVerify) {
    return <Verify email={verifyEmail} setOpen={setOpen} />;
  }

  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formdata.name}
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formdata.email}
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formdata.password}
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-xl text-gray-500 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confPass" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </label>
            <input
              id="confPass"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your confirm password"
              value={formdata.confirmPassword}
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-xl text-gray-500 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <IoIosEyeOff /> : <IoMdEye />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            } flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? <Spinner size={24} /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;