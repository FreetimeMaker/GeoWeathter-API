const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
const { request } = require("@octokit/request");

function getApp() {
  return createOAuthAppAuth({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  });
}

async function githubLogin(req, res) {
  const auth = getApp();

  const { url } = await auth({
    type: "oauth-app",
    scopes: ["user:email"]
  });

  res.redirect(url);
}

async function githubCallback(req, res) {
  try {
    const { code } = req.query;

    const auth = getApp();

    const tokenData = await auth({
      type: "token",
      code
    });

    const accessToken = tokenData.token;

    res.redirect(`geoweather://auth/callback?token=${accessToken}`);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    res.status(500).json({ message: "OAuth failed", error: err.message });
  }
}

module.exports = { githubLogin, githubCallback };
