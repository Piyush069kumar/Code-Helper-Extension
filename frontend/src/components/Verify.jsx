import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";


const Verify = ({ email, setOpen }) => {
  const [loading, setLoading] = useState(false);
  
  const [formdata, setFormData] = useState({
    email: email || "",
    otp: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formdata)
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User verified");
        setOpen(false);
        
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Server error");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlechange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">Verify Your Email</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 space-y-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formdata.email}
          onChange={handlechange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          readOnly
        />

        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          OTP
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          placeholder="Enter the OTP"
          value={formdata.otp}
          onChange={handlechange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-2 w-full flex items-center justify-center h-12"
          disabled={loading}
        >
          {loading ? <Spinner size={32} /> : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default Verify;