#!/usr/bin/env node

/**
 * Basic tests for GT Hello World
 * Simple test runner without external dependencies
 */

const http = require('http');
const assert = require('assert');
const { generateHelloMessage } = require('../src/index.js');

// Test counter
let testCount = 0;
let passCount = 0;

/**
 * Simple test runner
 */
function test(name, testFn) {
    testCount++;
    try {
        testFn();
        console.log(`✅ PASS: ${name}`);
        passCount++;
    } catch (error) {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}`);
    }
}

/**
 * Test the hello message generation
 */
function testHelloMessage() {
    test('generateHelloMessage with default name', () => {
        const result = generateHelloMessage();
        assert(result.includes('Hello, World!'), 'Should include default greeting');
        assert(result.includes('Gas Town'), 'Should mention Gas Town');
    });

    test('generateHelloMessage with custom name', () => {
        const result = generateHelloMessage('Polecat');
        assert(result.includes('Hello, Polecat!'), 'Should include custom name');
        assert(result.includes('Gas Town'), 'Should mention Gas Town');
    });

    test('generateHelloMessage with empty string', () => {
        const result = generateHelloMessage('');
        assert(result.includes('Hello, !'), 'Should handle empty name');
    });
}

/**
 * Test HTTP server endpoints
 */
function testHttpEndpoints(callback) {
    // Start test server
    const { startServer } = require('../src/index.js');
    const server = startServer();
    const testPort = 3001;

    server.listen(testPort, 'localhost', () => {
        console.log(`🧪 Test server started on port ${testPort}`);

        // Test health endpoint
        test('health endpoint returns JSON', (done) => {
            http.get(`http://localhost:${testPort}/health`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        assert(json.status === 'healthy', 'Should be healthy');
                        assert(json.service === 'gt-helloworld', 'Should identify service');
                        assert(typeof json.uptime === 'number', 'Should include uptime');
                        console.log('✅ PASS: health endpoint returns JSON');
                        passCount++;
                    } catch (error) {
                        console.log('❌ FAIL: health endpoint returns JSON');
                        console.log(`   Error: ${error.message}`);
                    }

                    // Test API endpoint
                    http.get(`http://localhost:${testPort}/api/hello?name=Test`, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => {
                            try {
                                const json = JSON.parse(data);
                                assert(json.message.includes('Hello, Test!'), 'Should greet Test');
                                assert(typeof json.timestamp === 'string', 'Should include timestamp');
                                console.log('✅ PASS: API endpoint returns correct JSON');
                                passCount++;
                            } catch (error) {
                                console.log('❌ FAIL: API endpoint returns correct JSON');
                                console.log(`   Error: ${error.message}`);
                            }

                            // Close test server
                            server.close(() => {
                                console.log('🧪 Test server closed');
                                if (callback) callback();
                            });
                        });
                    }).on('error', (err) => {
                        console.log('❌ FAIL: API endpoint accessible');
                        console.log(`   Error: ${err.message}`);
                        server.close(() => {
                            if (callback) callback();
                        });
                    });
                });
            }).on('error', (err) => {
                console.log('❌ FAIL: health endpoint accessible');
                console.log(`   Error: ${err.message}`);
                server.close(() => {
                    if (callback) callback();
                });
            });
        });

        testCount += 2; // Account for the async HTTP tests
    });
}

/**
 * Run all tests
 */
function runTests() {
    console.log('🚀 Starting GT Hello World tests...\n');

    // Run synchronous tests
    testHelloMessage();

    // Run async HTTP tests
    testHttpEndpoints(() => {
        console.log('\n📊 Test Results:');
        console.log(`   Total: ${testCount}`);
        console.log(`   Passed: ${passCount}`);
        console.log(`   Failed: ${testCount - passCount}`);

        if (passCount === testCount) {
            console.log('\n🎉 All tests passed!');
            process.exit(0);
        } else {
            console.log('\n💥 Some tests failed!');
            process.exit(1);
        }
    });
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}