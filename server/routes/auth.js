require("dotenv").config();

const express = require("express");

const passport = require("passport");

const jwt = require("jsonwebtoken");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "1058857540810-vnbitm7nnaee36f8vic712krqrvir388.apps.googleusercontent.com"
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: "/auth/google/callback",
    },

    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,

        name: profile.displayName,

        email: profile.emails[0].value,

        picture: profile.photos[0].value,
      };

      return done(null, user);
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",

  passport.authenticate("google", { session: false }),

  (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  console.log(token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({
      success: true,

      user: {
        name: payload.name,

        email: payload.email,

        picture: payload.picture,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

module.exports = router;
