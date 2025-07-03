module.exports = {
  name: 'studio',
  displayName: 'Sanity Studio',
  port: 3333,
  command: 'pnpm --filter=studio dev',
  cwd: process.cwd(),
  env: {
    PORT: process.env.PM_STUDIO_PORT || '3333',
    NODE_ENV: 'development'
  },
  readyCheck: {
    type: 'http',
    url: 'http://localhost:3333',
    interval: 1000,
    maxAttempts: 30,
    timeout: 5000
  },
  pidFile: '.turbo-pids/studio.pid',
  logFile: '.turbo-logs/studio.log',
  startupTimeout: 30000,
  shutdownTimeout: 5000,
  restartDelay: 2000,
  autoRestart: false
};