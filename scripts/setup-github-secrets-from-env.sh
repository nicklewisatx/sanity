#!/bin/bash

# Script to set up GitHub secrets from existing .env files
# This script reads values from your local .env files and sets them as GitHub secrets

set -e

echo "🔐 Setting up GitHub secrets from existing .env files"
echo "===================================================="
echo ""

# Function to extract value from env file
get_env_value() {
    local file=$1
    local key=$2
    local value=$(grep "^$key=" "$file" 2>/dev/null | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//')
    echo "$value"
}

# Function to set secret
set_secret() {
    local env=$1
    local key=$2
    local value=$3
    
    if [ -z "$value" ]; then
        echo "⚠️  Skipping $key (no value found)"
        return
    fi
    
    # Mask sensitive values in output
    local display_value="$value"
    if [[ "$key" == *"TOKEN"* ]] || [[ "$key" == *"token"* ]]; then
        display_value="***${value: -4}"
    fi
    
    if [ -n "$env" ]; then
        echo -n "$value" | gh secret set "$key" --env "$env" 2>/dev/null && \
            echo "✅ Set $key for $env: $display_value" || \
            echo "⚠️  Failed to set $key for $env"
    else
        echo -n "$value" | gh secret set "$key" 2>/dev/null && \
            echo "✅ Set $key (repository): $display_value" || \
            echo "⚠️  Failed to set $key"
    fi
}

# Read values from existing env files
SANITY_PROJECT_ID=$(get_env_value ".env" "NEXT_PUBLIC_SANITY_PROJECT_ID")
SANITY_DATASET=$(get_env_value ".env" "NEXT_PUBLIC_SANITY_DATASET")
SANITY_READ_TOKEN=$(get_env_value ".env" "SANITY_API_READ_TOKEN")
SANITY_WRITE_TOKEN=$(get_env_value "apps/web/.env.example" "SANITY_API_WRITE_TOKEN")
SANITY_API_VERSION=$(get_env_value "apps/web/.env.example" "NEXT_PUBLIC_SANITY_API_VERSION")
SANITY_STUDIO_URL=$(get_env_value "apps/web/.env.example" "NEXT_PUBLIC_SANITY_STUDIO_URL")

# Studio specific values
STUDIO_DATASET=$(get_env_value "apps/studio/.env" "SANITY_STUDIO_DATASET" | sed 's/"//g')
STUDIO_PROJECT_ID=$(get_env_value "apps/studio/.env" "SANITY_STUDIO_PROJECT_ID" | sed 's/"//g')
STUDIO_TITLE=$(get_env_value "apps/studio/.env" "SANITY_STUDIO_TITLE" | sed 's/"//g')
STUDIO_PRESENTATION_URL=$(get_env_value "apps/studio/.env" "SANITY_STUDIO_PRESENTATION_URL")
STUDIO_PRODUCTION_HOSTNAME=$(get_env_value "apps/studio/.env" "SANITY_STUDIO_PRODUCTION_HOSTNAME" | sed 's/"//g')
SANITY_DEPLOY_TOKEN=$(get_env_value "apps/studio/.env" "SANITY_DEPLOY_TOKEN")

# Logging values
LOG_LEVEL=$(get_env_value ".env" "LOG_LEVEL")
ENABLE_FILE_LOGS=$(get_env_value ".env" "ENABLE_FILE_LOGS")
LOG_DIR=$(get_env_value ".env" "LOG_DIR")
EDGE_LOG_HTTP=$(get_env_value ".env" "EDGE_LOG_HTTP")
EDGE_LOG_ENDPOINT=$(get_env_value ".env" "EDGE_LOG_ENDPOINT")

# Set default values if not found
SANITY_API_VERSION=${SANITY_API_VERSION:-"2024-10-28"}
EDGE_LOG_ENDPOINT=${EDGE_LOG_ENDPOINT:-"/api/logs"}
LOG_DIR=${LOG_DIR:-"logs"}

echo "Found configuration values:"
echo "  SANITY_PROJECT_ID: $SANITY_PROJECT_ID"
echo "  SANITY_DATASET: $SANITY_DATASET"
echo "  SANITY_READ_TOKEN: ***${SANITY_READ_TOKEN: -4}"
echo "  STUDIO_TITLE: $STUDIO_TITLE"
echo "  STUDIO_PRESENTATION_URL: $STUDIO_PRESENTATION_URL"
echo ""

# Check environments
ENVIRONMENTS=$(gh api repos/nicklewisatx/sanity/environments --jq '.environments[].name' 2>/dev/null || echo "")

if [ -z "$ENVIRONMENTS" ]; then
    echo "⚠️  No environments found. Creating Preview and Production environments..."
    for env in "Preview" "Production"; do
        gh api --method PUT repos/nicklewisatx/sanity/environments/$env \
            --field wait_timer=0 \
            --field reviewers='[]' \
            --field deployment_branch_policy='{"protected_branches":false,"custom_branch_policies":true}' \
            2>/dev/null && echo "✅ Created $env environment" || echo "⚠️  Failed to create $env"
    done
fi

# Set secrets for each environment
for env in Preview Production; do
    echo ""
    echo "📦 Setting secrets for $env environment"
    echo "========================================"
    
    # Adjust values based on environment
    if [ "$env" = "Preview" ]; then
        DATASET_TO_USE="preview"
        NODE_ENV="preview"
        ENABLE_LOGS="false"
        LOG_LEVEL_ENV="debug"
    else
        DATASET_TO_USE="$SANITY_DATASET"
        NODE_ENV="production"
        ENABLE_LOGS="$ENABLE_FILE_LOGS"
        LOG_LEVEL_ENV="$LOG_LEVEL"
    fi
    
    # Sanity Configuration
    set_secret "$env" "NEXT_PUBLIC_SANITY_PROJECT_ID" "$SANITY_PROJECT_ID"
    set_secret "$env" "NEXT_PUBLIC_SANITY_DATASET" "$DATASET_TO_USE"
    set_secret "$env" "NEXT_PUBLIC_SANITY_API_VERSION" "$SANITY_API_VERSION"
    set_secret "$env" "NEXT_PUBLIC_SANITY_STUDIO_URL" "$STUDIO_PRESENTATION_URL/studio"
    set_secret "$env" "SANITY_API_READ_TOKEN" "$SANITY_READ_TOKEN"
    set_secret "$env" "SANITY_API_WRITE_TOKEN" "$SANITY_WRITE_TOKEN"
    
    # Studio Configuration
    set_secret "$env" "SANITY_STUDIO_PROJECT_ID" "$STUDIO_PROJECT_ID"
    set_secret "$env" "SANITY_STUDIO_DATASET" "$DATASET_TO_USE"
    set_secret "$env" "SANITY_STUDIO_PRESENTATION_URL" "$STUDIO_PRESENTATION_URL"
    set_secret "$env" "SANITY_STUDIO_PRODUCTION_HOSTNAME" "$STUDIO_PRODUCTION_HOSTNAME"
    set_secret "$env" "SANITY_STUDIO_TITLE" "$STUDIO_TITLE"
    
    # Logging Configuration
    set_secret "$env" "LOG_LEVEL" "$LOG_LEVEL_ENV"
    set_secret "$env" "LOG_DIR" "$LOG_DIR"
    set_secret "$env" "ENABLE_FILE_LOGS" "$ENABLE_LOGS"
    set_secret "$env" "EDGE_LOG_HTTP" "$EDGE_LOG_HTTP"
    set_secret "$env" "EDGE_LOG_ENDPOINT" "$EDGE_LOG_ENDPOINT"
    
    # Runtime Configuration
    set_secret "$env" "NODE_ENV" "$NODE_ENV"
    set_secret "$env" "NEXT_RUNTIME" "nodejs"
    set_secret "$env" "HOST_NAME" "$STUDIO_PRODUCTION_HOSTNAME"
done

# Set repository-level secrets
echo ""
echo "📦 Setting repository-level secrets"
echo "==================================="

# Set Sanity deploy token if found
if [ -n "$SANITY_DEPLOY_TOKEN" ]; then
    set_secret "" "SANITY_DEPLOY_TOKEN" "$SANITY_DEPLOY_TOKEN"
fi

# Check for Vercel configuration
echo ""
echo "⚠️  Note: Vercel secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) need to be set manually."
echo "   You can set them with:"
echo "   gh secret set VERCEL_TOKEN"
echo "   gh secret set VERCEL_ORG_ID"
echo "   gh secret set VERCEL_PROJECT_ID"

echo ""
echo "✅ Secret setup complete!"
echo ""
echo "To verify secrets were set correctly:"
echo "  gh secret list --env Preview"
echo "  gh secret list --env Production"
echo "  gh secret list  # for repository-level secrets"