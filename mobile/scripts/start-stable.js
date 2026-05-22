#!/usr/bin/env node
/**
 * BharatFarm Mobile — Stable LAN Startup Script
 * ─────────────────────────────────────────────────
 * Boots Expo in offline-safe LAN mode with:
 *   • No ngrok/tunnel dependency
 *   • No Expo cloud validation at startup
 *   • Auto-detected LAN IP
 *   • Windows firewall diagnostics
 *   • Port conflict detection
 *   • Local Expo session URL generation
 *
 * Usage:
 *   node scripts/start-stable.js [--offline] [--clear] [--port 8081]
 */

const { execSync, spawn } = require('child_process');
const os = require('os');
const net = require('net');
const path = require('path');
const fs = require('fs');

// ── Configuration ────────────────────────────────────────────────────────────
const METRO_PORT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--port') || '8081', 10);
const BACKEND_PORT = 5000;
const FORCE_OFFLINE = process.argv.includes('--offline');
const CLEAR_CACHE = process.argv.includes('--clear');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SERVER_ROOT = path.resolve(PROJECT_ROOT, '..');
const EXPO_SESSION_FILE = path.join(SERVER_ROOT, 'data', 'expo-session.json');

// ── Colors ───────────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function banner(msg) {
  console.log(`\n${c.bold(c.green('━'.repeat(60)))}`);
  console.log(`  ${c.bold(msg)}`);
  console.log(`${c.bold(c.green('━'.repeat(60)))}\n`);
}

function info(msg) { console.log(`  ${c.cyan('ℹ')} ${msg}`); }
function ok(msg) { console.log(`  ${c.green('✔')} ${msg}`); }
function warn(msg) { console.log(`  ${c.yellow('⚠')} ${msg}`); }
function fail(msg) { console.log(`  ${c.red('✖')} ${msg}`); }

// ── LAN IP Detection ─────────────────────────────────────────────────────────
function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254')) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// ── Port Check ───────────────────────────────────────────────────────────────
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

// ── Kill stale processes on port (Windows) ───────────────────────────────────
function killPortProcess(port) {
  try {
    const result = execSync(
      `netstat -ano | findstr :${port} | findstr LISTENING`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();

    if (result) {
      const lines = result.split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(parseInt(pid))) {
          pids.add(pid);
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F`, { timeout: 5000 });
          ok(`Killed stale process PID ${pid} on port ${port}`);
        } catch (_) {
          warn(`Could not kill PID ${pid} on port ${port} (may require admin)`);
        }
      }
    }
  } catch (_) {
    // No process on port — good
  }
}

// ── Expo Session File Writer ────────────────────────────────────────────────
function writeExpoSession(lanIp, port) {
  const expoUrl = `exp://${lanIp}:${port}`;
  const session = {
    active: true,
    expoUrl: expoUrl,
    tunnelUrl: expoUrl,
    lastSeen: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'live',
    platform: 'android',
    runtimeVersion: '',
    mode: 'expo-go',
    source: 'lan-startup-script'
  };

  try {
    fs.mkdirSync(path.dirname(EXPO_SESSION_FILE), { recursive: true });
    fs.writeFileSync(EXPO_SESSION_FILE, JSON.stringify(session, null, 2), 'utf8');
    ok(`Expo session written: ${expoUrl}`);
    return expoUrl;
  } catch (e) {
    warn(`Could not write expo session file: ${e.message}`);
    return expoUrl;
  }
}

// ── Windows Firewall Diagnostics ────────────────────────────────────────────
function checkFirewall() {
  if (process.platform !== 'win32') return;

  info('Running Windows network diagnostics...');

  try {
    const result = execSync('netsh advfirewall show currentprofile state', {
      encoding: 'utf8',
      timeout: 5000
    });
    if (result.toLowerCase().includes('on')) {
      warn('Windows Firewall is ON. Expo LAN connections may be blocked.');
      info('If Expo Go cannot connect, run as Admin:');
      info(c.dim(`  netsh advfirewall firewall add rule name="Expo Metro" dir=in action=allow protocol=TCP localport=${METRO_PORT}`));
      info(c.dim(`  netsh advfirewall firewall add rule name="BharatFarm API" dir=in action=allow protocol=TCP localport=${BACKEND_PORT}`));
    } else {
      ok('Windows Firewall is OFF (or profile not blocking)');
    }
  } catch (_) {
    warn('Could not check firewall status (non-critical)');
  }
}

// ── Clear Cache ──────────────────────────────────────────────────────────────
function clearExpoCache() {
  info('Clearing Expo/Metro cache...');
  const cacheDirs = [
    path.join(PROJECT_ROOT, '.expo'),
    path.join(PROJECT_ROOT, 'node_modules', '.cache'),
  ];

  for (const dir of cacheDirs) {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        ok(`Cleared: ${path.basename(dir)}`);
      }
    } catch (_) {
      warn(`Could not clear: ${dir}`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  banner('🌾 BharatFarm Mobile — Stable LAN Startup');

  // Step 1: Detect LAN IP
  const lanIp = getLanIp();
  info(`Detected LAN IP: ${c.bold(lanIp)}`);

  if (lanIp === '127.0.0.1') {
    warn('No LAN interface detected! Expo Go on a physical device will not be able to connect.');
    warn('Make sure your PC is connected to WiFi.');
  }

  // Step 2: Windows firewall check
  checkFirewall();

  // Step 3: Check Metro port
  const metroFree = await isPortAvailable(METRO_PORT);
  if (!metroFree) {
    warn(`Port ${METRO_PORT} is in use. Attempting to free it...`);
    killPortProcess(METRO_PORT);
    await new Promise(r => setTimeout(r, 1500));
    const retryFree = await isPortAvailable(METRO_PORT);
    if (!retryFree) {
      fail(`Port ${METRO_PORT} still occupied. Metro may fail to start.`);
    } else {
      ok(`Port ${METRO_PORT} freed successfully`);
    }
  } else {
    ok(`Metro port ${METRO_PORT} is available`);
  }

  // Step 4: Check backend port
  const backendFree = await isPortAvailable(BACKEND_PORT);
  if (!backendFree) {
    info(`Backend port ${BACKEND_PORT} is in use (server likely already running — OK)`);
  } else {
    info(`Backend port ${BACKEND_PORT} is free (start backend separately with npm start from root)`);
  }

  // Step 5: Clear cache if requested
  if (CLEAR_CACHE) {
    clearExpoCache();
  }

  // Step 6: Write Expo session to data file for website QR bridge
  const expoUrl = writeExpoSession(lanIp, METRO_PORT);

  // Step 7: Build Expo launch args
  const env = {
    ...process.env,
    EXPO_NO_TELEMETRY: '1',
    EXPO_OFFLINE: FORCE_OFFLINE ? '1' : undefined,
    EXPO_NO_DOTENV: '1',
    REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
    // Disable Expo's new update checks and doctor
    EXPO_NO_DOCTOR: '1',
    CI: '1', // Suppress interactive prompts
  };

  // Remove undefined keys
  Object.keys(env).forEach(k => { if (env[k] === undefined) delete env[k]; });

  const expoArgs = [
    'expo', 'start',
    '--lan',
    '--port', String(METRO_PORT),
  ];

  if (FORCE_OFFLINE) {
    expoArgs.push('--offline');
  }

  if (CLEAR_CACHE) {
    expoArgs.push('--clear');
  }

  // Summary
  banner('🚀 Launching Expo Metro Bundler');
  info(`Mode:      ${FORCE_OFFLINE ? 'OFFLINE + LAN' : 'LAN'}`);
  info(`LAN IP:    ${c.bold(lanIp)}`);
  info(`Metro:     ${c.bold(`http://${lanIp}:${METRO_PORT}`)}`);
  info(`Expo URL:  ${c.bold(expoUrl)}`);
  info(`Backend:   ${c.bold(`http://${lanIp}:${BACKEND_PORT}`)}`);
  info(`Cache:     ${CLEAR_CACHE ? 'CLEARED' : 'preserved'}`);
  console.log();
  info(c.dim('Press Ctrl+C to stop.\n'));

  // Step 8: Spawn Expo
  const child = spawn('npx', expoArgs, {
    cwd: PROJECT_ROOT,
    env,
    stdio: 'inherit',
    shell: true,
  });

  // Periodically refresh the session file so website always has a fresh timestamp
  const heartbeatInterval = setInterval(() => {
    writeExpoSession(lanIp, METRO_PORT);
  }, 15000);

  child.on('exit', (code) => {
    clearInterval(heartbeatInterval);
    if (code !== 0) {
      fail(`Expo process exited with code ${code}`);
    }
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    clearInterval(heartbeatInterval);
    child.kill('SIGINT');
  });
}

main().catch((e) => {
  fail(`Startup failed: ${e.message}`);
  process.exit(1);
});
