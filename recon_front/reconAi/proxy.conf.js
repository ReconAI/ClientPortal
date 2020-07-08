const PROXY_CONFIG = [
  {
    context: ["/authApi"],
    target: process.env.RECON_API_URL || "http://127.0.0.1:8080/",
    secure: true,
    // logLevel: "debug",
    "changeOrigin": true,
    pathRewrite: {
      "^/authApi": "",
    },
  },
];

module.exports = PROXY_CONFIG;
