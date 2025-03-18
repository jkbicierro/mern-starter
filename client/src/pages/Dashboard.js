import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setUser({ token });

      fetchClassrooms(token);
    }
  }, [navigate]);

  async function fetchClassrooms(token) {
    try {
      const response = await fetch("http://localhost:5000/api/classrooms", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setClassrooms(data.courses || []);
    } catch (error) {
      console.error("Error fetching Google Classroom data:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };
  return (
    <div>
      <h1>Dashboard</h1>

      {user ? <p>Welcome! You are logged in.</p> : <p>Loading...</p>}

      <button onClick={handleLogout}>Logout</button>
      <h2>My Google Classrooms</h2>

      <ul>
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <li key={classroom.id}>{classroom.name}</li>
          ))
        ) : (
          <p>No classrooms found.</p>
        )}
      </ul>
    </div>
  );
}
