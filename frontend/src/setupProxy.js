// This MUST be in JS because more create-react-app stupidity
/* eslint-disable */ // Ignore the eslint TS errors
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create a proxy for all unknown routes to the backend, using env variables for source and port
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.BACKEND_SOURCE + ':' + process.env.BACKEND_PORT,
            changeOrigin: true,
        })
    );
};