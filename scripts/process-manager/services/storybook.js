module.exports = {
  name: 'storybook',
  displayName: 'Storybook',
  port: 6006,
  command: 'pnpm --filter=@workspace/ui storybook',
  cwd: process.cwd(),
  env: {
    PORT: process.env.PM_STORYBOOK_PORT || '6006',
    NODE_ENV: 'development'
  },
  readyCheck: {
    type: 'http',
    url: 'http://localhost:6006',
    interval: 2000,
    maxAttempts: 30,
    timeout: 5000
  },
  pidFile: '.turbo-pids/storybook.pid',
  logFile: '.turbo-logs/storybook.log',
  startupTimeout: 45000, // Storybook takes longer to start
  shutdownTimeout: 5000,
  restartDelay: 2000,
  autoRestart: false
};