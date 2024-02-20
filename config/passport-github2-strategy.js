const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

//tell passport to use a new strategy for google login

passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_AUTH_CLIENTID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
      callbackURL:
        "https://habittracker.utkarshdev.tech/users/auth/github/callback",
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
        });
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);
module.exports = passport;
