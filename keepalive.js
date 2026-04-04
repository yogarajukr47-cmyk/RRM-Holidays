/**
 * RRM Holidays - Keepalive Development Server
 * 
 * Wraps `next dev --turbopack` with auto-restart on crash.
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const PORT = 3000;
const HOST = '0.0.0.0';

let nextProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 100;

function startNextServer() {
  if (restartCount >= MAX_RESTARTS) {
    console.error(`[FATAL] Max restarts reached. Exiting.`);
    process.exit(1);
  }

  restartCount++;
  const msg = `[${new Date().toISOString()}] Starting Next.js dev server (attempt #${restartCount}) on port ${PORT}`;
  console.log(msg);
  fs.appendFileSync('/tmp/keepalive-errors.log', msg + '\n');

  nextProcess = spawn('npx', ['next', 'dev', '-p', String(PORT), '-H', HOST, '--turbopack'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(PORT), HOSTNAME: HOST },
  });

  nextProcess.stdout.on('data', (data) => {
    const str = data.toString().trim();
    if (str) console.log(`[NEXT] ${str}`);
  });

  nextProcess.stderr.on('data', (data) => {
    const str = data.toString().trim();
    if (str) console.error(`[NEXT:ERR] ${str}`);
  });

  nextProcess.on('close', (code, signal) => {
    const msg = `[${new Date().toISOString()}] Next.js exited (code=${code}, signal=${signal}) - restarting in 5s`;
    console.error(msg);
    fs.appendFileSync('/tmp/keepalive-errors.log', msg + '\n');
    setTimeout(startNextServer, 5000);
  });

  nextProcess.on('error', (err) => {
    const msg = `[${new Date().toISOString()}] Next.js error: ${err.message} - restarting in 5s`;
    console.error(msg);
    fs.appendFileSync('/tmp/keepalive-errors.log', msg + '\n');
    setTimeout(startNextServer, 5000);
  });

  return nextProcess;
}

// Wait for server to be ready before health checks
let serverReady = false;
setTimeout(() => { serverReady = true; }, 30000);

// Health check every 20 seconds
setInterval(() => {
  if (!serverReady) return;
  
  const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        restartCount = 0;
      }
    });
  });
  req.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Health check failed: ${err.message}`);
    if (nextProcess) {
      try { nextProcess.kill('SIGTERM'); } catch (e) { /* ignore */ }
    }
  });
  req.setTimeout(10000, () => { req.destroy(); });
}, 20000);

// Prevent process from exiting
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught: ${err.message}`);
  fs.appendFileSync('/tmp/keepalive-errors.log', `Uncaught: ${err.message}\n`);
});

process.on('SIGTERM', () => console.log('SIGTERM ignored'));
process.on('SIGINT', () => console.log('SIGINT ignored'));

startNextServer();
