import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import LoginSign from "./pages/LoginSign";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import History from './pages/History';
// import Verify from './components/Verify';
import Navbar from './components/Navbar';
import Spinner from "./components/Spinner";

function App() {
  const [isLoggedIn, setIsLoggedIN] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIN(false);
      setLoading(false);
      return;
    }
    fetch("http://localhost:4000/api/v1/userprofile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIN(true);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIN(false);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setIsLoggedIN(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="w-[400px] h-[600px] flex flex-col items-center justify-center bg-gray-100 py-4">
      {isLoggedIn && <Navbar setIsLoggedIN={setIsLoggedIN} />}
      <Routes>
        {/* Not logged in: show login page, redirect all else to login */}
        {!isLoggedIn ? (
          <>
            
            <Route path="/login" element={<LoginSign onLoginSuccess={() => setIsLoggedIN(true)} />} />
            {/* <Route path="/verify" element={<Verify />} /> */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Logged in: show home/history, redirect all else to home */}
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;



