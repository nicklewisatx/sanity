module.exports = {
  name: 'web',
  displayName: 'Next.js App',
  port: 3000,
  command: 'pnpm --filter=web dev',
  cwd: process.cwd(),
  env: {
    PORT: process.env.PM_WEB_PORT || '3000',
    NODE_ENV: 'development'
  },
  readyCheck: {
    type: 'http',
    url: 'http://localhost:3000',
    interval: 1000,
    maxAttempts: 30,
    timeout: 5000
  },
  pidFile: '.turbo-pids/web.pid',
  logFile: '.turbo-logs/web.log',
  startupTimeout: 30000,
  shutdownTimeout: 5000,
  restartDelay: 2000,
  autoRestart: false
};