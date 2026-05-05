let OAuthApp;

(async () => {
  const module = await import("@octokit/oauth-app");
  OAuthApp = module.OAuthApp;
})();

const githubLogin = async (req, res) => {
  const app = new OAuthApp({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  });

  const url = app.getAuthorizationUrl({
    scopes: ["user:email"]
  });

  res.redirect(url);
};

const githubCallback = async (req, res) => {
  try {
    const app = new OAuthApp({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    });

    const { code } = req.query;
    const token = await app.createToken({ code });

    res.redirect(
      `geoweather://auth/callback?token=${token.authentication.token}`
    );
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    res.status(500).json({ message: "OAuth failed", error: err.message });
  }
};

module.exports = { githubLogin, githubCallback };
