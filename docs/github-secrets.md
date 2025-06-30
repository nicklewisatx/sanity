# GitHub Secrets Configuration

This document describes the GitHub secrets setup for the Sanity project.

## Overview

The project uses GitHub secrets to securely store environment variables for different deployment environments. Secrets are configured at both the repository level and environment level.

## Environments

- **Preview**: Used for pull requests and development branches
- **Production**: Used for the main branch deployments

## Secret Categories

### 1. Sanity Configuration

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Dataset name (preview/production)
- `NEXT_PUBLIC_SANITY_API_VERSION`: API version date
- `NEXT_PUBLIC_SANITY_STUDIO_URL`: URL to Sanity Studio
- `SANITY_API_READ_TOKEN`: Read-only API token for fetching content
- `SANITY_API_WRITE_TOKEN`: Write API token (if needed)
- `SANITY_STUDIO_PROJECT_ID`: Studio project ID
- `SANITY_STUDIO_DATASET`: Studio dataset
- `SANITY_STUDIO_PRESENTATION_URL`: Preview URL for Studio
- `SANITY_STUDIO_PRODUCTION_HOSTNAME`: Production hostname
- `SANITY_STUDIO_TITLE`: Studio title

### 2. Logging Configuration

- `LOG_LEVEL`: Logging level (debug/info/warn/error)
- `LOG_DIR`: Directory for log files
- `ENABLE_FILE_LOGS`: Whether to write logs to files
- `EDGE_LOG_HTTP`: Enable HTTP logging from Edge Runtime
- `EDGE_LOG_ENDPOINT`: Endpoint for edge logs

### 3. Runtime Configuration

- `NODE_ENV`: Environment (preview/production)
- `NEXT_RUNTIME`: Next.js runtime (nodejs/edge)
- `HOST_NAME`: Application hostname

### 4. Repository-Level Secrets

- `SANITY_DEPLOY_TOKEN`: Token for deploying Sanity Studio
- `VERCEL_TOKEN`: Vercel deployment token (optional)
- `VERCEL_ORG_ID`: Vercel organization ID (optional)
- `VERCEL_PROJECT_ID`: Vercel project ID (optional)

## Setup Scripts

### Automated Setup from .env Files

```bash
# This script reads your existing .env files and sets up secrets
./scripts/setup-github-secrets-from-env.sh
```

### Interactive Setup

```bash
# This script prompts for values interactively
./scripts/setup-github-secrets-interactive.sh
```

### Manual Setup Template

```bash
# Use this script as a template for manual configuration
./scripts/setup-github-secrets.sh
```

## Managing Secrets

### View Secrets

```bash
# List repository secrets
gh secret list

# List environment secrets
gh secret list --env Preview
gh secret list --env Production
```

### Set Individual Secrets

```bash
# Set repository secret
gh secret set SECRET_NAME

# Set environment secret
gh secret set SECRET_NAME --env ENVIRONMENT_NAME
```

### Delete Secrets

```bash
# Delete repository secret
gh secret delete SECRET_NAME

# Delete environment secret
gh secret delete SECRET_NAME --env ENVIRONMENT_NAME
```

## GitHub Actions Usage

Secrets are automatically available in GitHub Actions workflows when the job specifies an environment:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'Production' || 'Preview' }}

    steps:
      - name: Build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
        run: pnpm build
```

## Security Best Practices

1. **Never commit secrets**: Always use environment variables
2. **Rotate tokens regularly**: Update tokens periodically
3. **Use least privilege**: Only grant necessary permissions
4. **Different tokens per environment**: Use separate tokens for Preview/Production
5. **Audit access**: Regularly review who has access to secrets

## Troubleshooting

### Secret not found

- Ensure the secret name matches exactly (case-sensitive)
- Verify the environment is specified correctly
- Check that the workflow has the correct environment specified

### Permission denied

- Ensure you have admin access to the repository
- For organization repos, check organization secret policies

### Workflow can't access secrets

- Add `environment: Production` or `environment: Preview` to the job
- Ensure the branch protection rules allow the workflow to run
