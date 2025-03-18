const express = require("express");

const fetch = require("node-fetch").default;

const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    console.error("No token provided in the request");

    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const response = await fetch(
      "https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE",
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error(`Google API Error: ${response.status} -
${data.error?.message}`);

      return res
        .status(response.status)
        .json({ error: data.error?.message || "Unknown error" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching classrooms:", error.message);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
