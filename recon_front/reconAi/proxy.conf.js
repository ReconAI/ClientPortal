const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: process.env.RECON_API_URL || "http://127.0.0.1:8080/",
    secure: true,
    "changeOrigin": true,
    pathRewrite: {
      "^/api": "",
    },
  },
];

module.exports = PROXY_CONFIG;
