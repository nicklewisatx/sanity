# Process Management System

A unified process management system for the Sanity + Next.js monorepo, designed to handle development servers, background processes, and Claude Code compatibility.

## Overview

This system replaces the fragmented approach of individual scripts with a centralized process manager that handles:
- Next.js web app (port 3000)
- Sanity Studio (port 3333)
- Storybook (port 6006)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Process Manager CLI                     │
├─────────────────────────────────────────────────────────┤
│  Commands: start, stop, restart, status, dev, watch     │
└────────────────┬───────────────────────────┬────────────┘
                 │                           │
        ┌────────▼────────┐         ┌───────▼────────┐
        │ ProcessManager  │         │  TurboRepo     │
        │   Core Engine   │◄────────┤  Integration   │
        └────────┬────────┘         └────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
┌───▼───┐  ┌────▼────┐  ┌───▼───┐   ┌──────▼──────┐
│  Web  │  │ Studio  │  │ Story │   │   Health    │
│ :3000 │  │  :3333  │  │ :6006 │   │   Checks    │
└───────┘  └─────────┘  └───────┘   └─────────────┘
```

## Key Features

### 1. Unified Commands
- Single entry point for all process management
- Consistent interface across all services
- Support for individual and collective operations

### 2. Claude Code Compatibility
- Automatic detection of Claude Code environment
- Built-in `--no-daemon` and concurrency limits
- Optimized startup sequences to prevent timeouts
- Enhanced logging for debugging

### 3. Process Lifecycle Management
- PID tracking for all services
- Graceful shutdown handling
- Automatic port cleanup
- Signal propagation (SIGINT, SIGTERM)

### 4. Health Monitoring
- HTTP health checks for web services
- Process alive verification
- Automatic restart on failure
- Configurable retry logic

### 5. Developer Experience
- Clear status reporting
- Service-specific logging
- Debug mode for troubleshooting
- Background operation support

## Commands

### Basic Usage

```bash
# Start all services
pnpm dev

# Start specific service
pnpm dev:web
pnpm dev:studio
pnpm dev:storybook

# Stop all services
pnpm stop

# Check status
pnpm status
```

### Advanced Commands

```bash
# Process manager direct control
pnpm pm start [service|all]
pnpm pm stop [service|all]
pnpm pm restart [service|all]
pnpm pm status
pnpm pm logs [service]
pnpm pm debug [service]

# Claude Code optimized mode
pnpm dev:claude
```

## Implementation Details

### Directory Structure

```
scripts/
└── process-manager/
    ├── index.js          # CLI entry point
    ├── ProcessManager.js # Core process management engine
    ├── services/         # Service-specific configurations
    │   ├── web.js
    │   ├── studio.js
    │   └── storybook.js
    ├── utils/
    │   ├── logger.js     # Logging utilities
    │   ├── pid.js        # PID file management
    │   ├── port.js       # Port utilities
    │   └── health.js     # Health check utilities
    └── config.js         # Configuration management
```

### Service Configuration

Each service is configured with:
```javascript
{
  name: 'web',
  displayName: 'Next.js App',
  port: 3000,
  command: 'pnpm --filter=web dev',
  cwd: './apps/web',
  env: {
    // Service-specific environment variables
  },
  readyCheck: {
    type: 'http',
    url: 'http://localhost:3000',
    interval: 1000,
    maxAttempts: 30
  },
  pidFile: '.turbo-pids/web.pid',
  logFile: '.turbo-logs/web.log'
}
```

### Process States

Services can be in one of the following states:
- `stopped` - Not running
- `starting` - Starting up
- `running` - Active and healthy
- `unhealthy` - Running but failing health checks
- `stopping` - Shutting down
- `crashed` - Unexpectedly terminated

### Logging

- **Location**: `.turbo-logs/` directory
- **Rotation**: Keeps last 5 log files per service
- **Format**: Timestamped, service-prefixed
- **Levels**: debug, info, warn, error

### PID Management

- **Location**: `.turbo-pids/` directory
- **Format**: `[service].pid`
- **Cleanup**: Automatic on stop/crash
- **Validation**: Checks if PID is actually running

## Claude Code Optimizations

When `CLAUDE_MODE=true` or using `pnpm dev:claude`:

1. **Concurrency Limiting**
   - Sets `--concurrency=4` for TurboRepo
   - Staggers service startup

2. **No Daemon Mode**
   - Forces `--no-daemon` flag
   - Ensures output is captured properly

3. **Extended Timeouts**
   - Increases startup timeout to 60s
   - More lenient health check intervals

4. **Enhanced Logging**
   - More verbose output
   - Progress indicators
   - Clear error messages

## Error Handling

### Port Conflicts
- Automatically kills processes on required ports
- Waits for port release before starting
- Reports which process was using the port

### Failed Starts
- Captures and logs startup errors
- Provides actionable error messages
- Suggests troubleshooting steps

### Crashes
- Detects unexpected terminations
- Optional automatic restart
- Preserves crash logs

## Configuration

### Environment Variables

```bash
# Process manager behavior
PM_LOG_LEVEL=debug|info|warn|error
PM_AUTO_RESTART=true|false
PM_HEALTH_CHECK_INTERVAL=5000

# Claude Code mode
CLAUDE_MODE=true

# Service-specific
PM_WEB_PORT=3000
PM_STUDIO_PORT=3333
PM_STORYBOOK_PORT=6006
```

### Config File (optional)

`.turbo-pm.config.js`:
```javascript
module.exports = {
  services: {
    web: {
      // Override default settings
    }
  },
  claude: {
    concurrency: 4,
    timeout: 60000
  }
}
```

## Migration Guide

### From Existing Scripts

1. **Old way**:
   ```bash
   ./scripts/start-dev.sh
   ```

2. **New way**:
   ```bash
   pnpm dev
   ```

### Backward Compatibility

During transition period:
- Old scripts remain functional
- Deprecation warnings guide to new commands
- Gradual migration path

## Troubleshooting

### Common Issues

1. **Services won't start**
   - Check `pnpm status` for port conflicts
   - Review logs in `.turbo-logs/`
   - Try `pnpm pm debug [service]`

2. **Claude Code timeouts**
   - Use `pnpm dev:claude` instead of `pnpm dev`
   - Check if services are actually starting
   - Review Claude-specific logs

3. **Orphaned processes**
   - Run `pnpm pm cleanup` to kill orphans
   - Check `.turbo-pids/` for stale PID files

### Debug Mode

```bash
PM_LOG_LEVEL=debug pnpm dev
```

Provides:
- Detailed startup sequences
- Health check results
- Signal handling info
- Environment details

## Future Enhancements

### Planned Features
- [ ] Web UI for process management
- [ ] Metrics collection and reporting
- [ ] Plugin system for custom services
- [ ] Remote process management
- [ ] Integration with deployment systems

### Potential Integrations
- PM2 compatibility layer
- Docker compose integration
- Kubernetes local development
- VS Code extension

## Technical Details

### Signal Handling
- `SIGINT` (Ctrl+C): Graceful shutdown all services
- `SIGTERM`: Graceful shutdown all services
- `SIGUSR1`: Reload configuration
- `SIGUSR2`: Dump status to logs

### Health Check Types
1. **HTTP**: GET request expecting 2xx response
2. **TCP**: Port connection test
3. **Process**: PID existence check
4. **Custom**: User-defined health check function

### Performance Considerations
- Minimal overhead (~10MB memory)
- Efficient process spawning
- Non-blocking health checks
- Optimized for development workflow

## Contributing

When adding new services:
1. Create service definition in `services/`
2. Add to service registry
3. Update documentation
4. Add tests
5. Update CLAUDE.md files