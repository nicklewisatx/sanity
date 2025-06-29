#!/bin/bash

# Script to set up GitHub environment secrets for the Sanity project
# Usage: ./scripts/setup-github-secrets.sh

set -e

echo "🔐 Setting up GitHub secrets for all environments..."

# List of environments
ENVIRONMENTS=("Preview" "Production")

# Common secrets that should be set for all environments
declare -A SECRETS=(
    # Sanity Configuration
    ["NEXT_PUBLIC_SANITY_PROJECT_ID"]="your-project-id"
    ["NEXT_PUBLIC_SANITY_DATASET"]="production"
    ["NEXT_PUBLIC_SANITY_API_VERSION"]="2024-10-28"
    ["NEXT_PUBLIC_SANITY_STUDIO_URL"]="https://your-studio-url.com"
    ["SANITY_API_READ_TOKEN"]="your-read-token"
    ["SANITY_API_WRITE_TOKEN"]="your-write-token"
    ["SANITY_STUDIO_PROJECT_ID"]="your-project-id"
    ["SANITY_STUDIO_DATASET"]="production"
    ["SANITY_STUDIO_PRESENTATION_URL"]="https://your-app-url.com"
    ["SANITY_STUDIO_PRODUCTION_HOSTNAME"]="your-studio-hostname.com"
    ["SANITY_STUDIO_TITLE"]="Your Studio Title"
    
    # Logging Configuration
    ["LOG_LEVEL"]="info"
    ["LOG_DIR"]="logs"
    ["ENABLE_FILE_LOGS"]="false"
    ["EDGE_LOG_HTTP"]="false"
    ["EDGE_LOG_ENDPOINT"]="/api/logs"
    
    # Runtime Configuration
    ["NODE_ENV"]="production"
    ["NEXT_RUNTIME"]="nodejs"
    ["HOST_NAME"]="your-hostname.com"
)

# Function to set a secret for a specific environment
set_env_secret() {
    local env=$1
    local key=$2
    local value=$3
    
    echo "  Setting $key for environment: $env"
    echo -n "$value" | gh secret set "$key" --env "$env" 2>/dev/null || {
        echo "  ⚠️  Failed to set $key for $env (might already exist or need different permissions)"
    }
}

# Set secrets for each environment
for env in "${ENVIRONMENTS[@]}"; do
    echo ""
    echo "📦 Setting up secrets for environment: $env"
    echo "================================================"
    
    for key in "${!SECRETS[@]}"; do
        value="${SECRETS[$key]}"
        
        # Customize values based on environment
        case "$env" in
            "Preview")
                case "$key" in
                    "NEXT_PUBLIC_SANITY_DATASET")
                        value="preview"
                        ;;
                    "SANITY_STUDIO_DATASET")
                        value="preview"
                        ;;
                    "NODE_ENV")
                        value="preview"
                        ;;
                    "NEXT_PUBLIC_SANITY_STUDIO_URL")
                        value="https://preview-studio.your-domain.com"
                        ;;
                    "SANITY_STUDIO_PRESENTATION_URL")
                        value="https://preview.your-domain.com"
                        ;;
                esac
                ;;
            "Production")
                case "$key" in
                    "NEXT_PUBLIC_SANITY_DATASET")
                        value="production"
                        ;;
                    "SANITY_STUDIO_DATASET")
                        value="production"
                        ;;
                    "NODE_ENV")
                        value="production"
                        ;;
                    "NEXT_PUBLIC_SANITY_STUDIO_URL")
                        value="https://studio.your-domain.com"
                        ;;
                    "SANITY_STUDIO_PRESENTATION_URL")
                        value="https://your-domain.com"
                        ;;
                    "ENABLE_FILE_LOGS")
                        value="true"
                        ;;
                esac
                ;;
        esac
        
        set_env_secret "$env" "$key" "$value"
    done
done

# Also set some repository-level secrets (not environment-specific)
echo ""
echo "📦 Setting up repository-level secrets"
echo "================================================"

REPO_SECRETS=(
    "SANITY_DEPLOY_TOKEN"
    "VERCEL_TOKEN"
    "VERCEL_ORG_ID"
    "VERCEL_PROJECT_ID"
)

for secret in "${REPO_SECRETS[@]}"; do
    echo "  Checking $secret..."
    gh secret list | grep -q "^$secret" || {
        echo "  ⚠️  $secret is not set. Please set it manually with:"
        echo "     gh secret set $secret"
    }
done

echo ""
echo "✅ GitHub secrets setup complete!"
echo ""
echo "⚠️  IMPORTANT REMINDERS:"
echo "1. Replace all placeholder values with your actual credentials"
echo "2. You may need to manually set some secrets that require specific permissions"
echo "3. Vercel-related secrets need to be set manually if using Vercel deployment"
echo "4. Make sure to keep your tokens secure and rotate them regularly"
echo ""
echo "To view secrets for an environment:"
echo "  gh secret list --env Preview"
echo "  gh secret list --env Production"
echo ""
echo "To manually set a secret for an environment:"
echo "  gh secret set SECRET_NAME --env ENVIRONMENT_NAME"