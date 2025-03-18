require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

const passport = require("passport");
app.use(passport.initialize());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB Connected"))

  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const classroomRoutes = require("./routes/api/classroom");

app.use("/api/classrooms", classroomRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
