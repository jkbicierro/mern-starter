import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const clientId =
  "1058857540810-vnbitm7nnaee36f8vic712krqrvir388.apps.googleusercontent.com";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: clientId,

          scope: "https://www.googleapis.com/auth/classroom.courses.readonly",
        });
      });
    };
    initClient();
  }, []);

  const handleSuccess = (credentialResponse) => {
    const authInstance = gapi.auth2.getAuthInstance();

    authInstance.signIn().then((googleUser) => {
      const token = googleUser.getAuthResponse().access_token;

      console.log("Google ID Token:", token);

      fetch("http://localhost:5000/auth/google", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())

        .then((data) => {
          localStorage.setItem("token", token);

          navigate("/dashboard");
        })

        .catch((error) => console.error("Error:", error));
    });
  };
  return (
    <div>
      <h2>Login with Google</h2>

      <button onClick={handleSuccess}>Sign in with Google</button>
    </div>
  );
}
