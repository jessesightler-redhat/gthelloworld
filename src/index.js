#!/usr/bin/env node

/**
 * GT Hello World - A simple Hello World application
 * Part of the Gas Town distributed AI worker system
 */

const http = require('http');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

/**
 * Simple Hello World message generator
 * @param {string} name - Optional name to greet
 * @returns {string} Hello world message
 */
function generateHelloMessage(name = 'World') {
    return `Hello, ${name}! This is GT Hello World running on Gas Town.`;
}

/**
 * HTTP request handler
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Set response headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Powered-By', 'GT-HelloWorld');

    // Handle different routes
    switch (path) {
        case '/':
            const name = query.name || 'World';
            const message = generateHelloMessage(name);
            res.writeHead(200);
            res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>GT Hello World</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: inline-block;
        }
        h1 { color: #333; }
        p { color: #666; }
        .gas-town { color: #007acc; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${message}</h1>
        <p>Welcome to the <span class="gas-town">Gas Town</span> distributed AI worker system.</p>
        <p><small>Try: <a href="?name=Polecat">?name=Polecat</a> or <a href="/health">/health</a></small></p>
    </div>
</body>
</html>
            `);
            break;

        case '/health':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'healthy',
                service: 'gt-helloworld',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: require('../package.json').version
            }, null, 2));
            break;

        case '/api/hello':
            const apiName = query.name || 'World';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: generateHelloMessage(apiName),
                timestamp: new Date().toISOString()
            }));
            break;

        default:
            res.writeHead(404);
            res.end(`
<!DOCTYPE html>
<html>
<head><title>404 - Not Found</title></head>
<body>
    <h1>404 - Not Found</h1>
    <p>The requested path '${path}' was not found.</p>
    <p><a href="/">Go back to home</a></p>
</body>
</html>
            `);
            break;
    }
}

/**
 * Start the HTTP server
 */
function startServer() {
    const server = http.createServer(handleRequest);

    server.listen(PORT, HOST, () => {
        console.log(`🚀 GT Hello World server running at http://${HOST}:${PORT}/`);
        console.log(`📡 Gas Town Polecat ready for work`);
        console.log(`💾 Health check available at /health`);
        console.log(`🔌 API endpoint available at /api/hello`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });

    return server;
}

// Export for testing
module.exports = {
    generateHelloMessage,
    handleRequest,
    startServer
};

// Start server if this file is run directly
if (require.main === module) {
    startServer();
}