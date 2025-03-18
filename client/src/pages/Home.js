import React from "react";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to My App</h1>

      <p>Please log in to continue.</p>

      <Link to="/login">
        <button>Login with Google</button>
      </Link>
    </div>
  );
}
