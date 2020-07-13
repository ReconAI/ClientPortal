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
  {
    context: ["/rep-api"],
    target: process.env.ORDER_PORTAL_API_URL || "http://127.0.0.1:8081/",
    secure: true,
    "changeOrigin": true,
    pathRewrite: {
      "^/rep-api": "",
    },
  },
];

module.exports = PROXY_CONFIG;
