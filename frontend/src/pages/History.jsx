import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const result = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const data = result.data.data;
        setHistory(data); 
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
      finally{
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-[80vh] w-full">
      <div className="bg-white shadow-lg rounded-lg w-[95%] max-w-2xl min-h-[80vh] p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Your Previous Search</h2>
        {history.length === 0 ? (
          <div className="text-gray-500 text-center flex-1 flex items-center justify-center">No search history found.</div>
        ) : (
          <ul className="space-y-3 flex-1">
            {history.map((item, index) => (
              <li
                key={index}
                className="bg-blue-50 hover:bg-blue-100 transition-colors rounded px-4 py-2 shadow-sm border border-blue-100 text-gray-800"
              >
                {item.questionText}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default History;