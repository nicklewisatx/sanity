#!/bin/bash

# Interactive script to set up GitHub environment secrets
# Usage: ./scripts/setup-github-secrets-interactive.sh

set -e

echo "🔐 Interactive GitHub Secrets Setup"
echo "==================================="
echo ""

# Function to prompt for a value with a default
prompt_value() {
    local prompt=$1
    local default=$2
    local secret=$3
    local value
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " value
        value=${value:-$default}
    else
        while [ -z "$value" ]; do
            read -p "$prompt: " value
            if [ -z "$value" ]; then
                echo "This value is required. Please enter a value."
            fi
        done
    fi
    
    # Handle special case for secrets (mask input)
    if [[ "$prompt" == *"token"* ]] || [[ "$prompt" == *"TOKEN"* ]] || [[ "$prompt" == *"secret"* ]]; then
        read -s -p "$prompt: " value
        echo ""
    fi
    
    echo "$value"
}

# Check if environments exist
echo "Checking GitHub environments..."
ENVIRONMENTS=$(gh api repos/nicklewisatx/sanity/environments --jq '.environments[].name' 2>/dev/null || echo "")

if [ -z "$ENVIRONMENTS" ]; then
    echo "No environments found. Would you like to create them? (y/n)"
    read -r create_envs
    if [ "$create_envs" = "y" ]; then
        echo "Creating environments..."
        for env in "Preview" "Production"; do
            gh api --method PUT repos/nicklewisatx/sanity/environments/$env 2>/dev/null || echo "Environment $env might already exist"
        done
        ENVIRONMENTS="Preview Production"
    else
        echo "Please create environments manually first."
        exit 1
    fi
fi

echo "Found environments: $ENVIRONMENTS"
echo ""

# Get common values
echo "📝 Please provide the following values:"
echo "======================================="

SANITY_PROJECT_ID=$(prompt_value "Sanity Project ID" "" "required")
SANITY_READ_TOKEN=$(prompt_value "Sanity API Read Token" "" "secret")
SANITY_WRITE_TOKEN=$(prompt_value "Sanity API Write Token" "" "secret")
DOMAIN=$(prompt_value "Your domain (e.g., example.com)" "" "required")

# Ask about Vercel
echo ""
read -p "Are you using Vercel for deployment? (y/n): " use_vercel
if [ "$use_vercel" = "y" ]; then
    VERCEL_TOKEN=$(prompt_value "Vercel Token" "" "secret")
    VERCEL_ORG_ID=$(prompt_value "Vercel Organization ID" "" "required")
    VERCEL_PROJECT_ID=$(prompt_value "Vercel Project ID" "" "required")
fi

# Function to set secret
set_secret() {
    local env=$1
    local key=$2
    local value=$3
    
    if [ -n "$env" ]; then
        echo -n "$value" | gh secret set "$key" --env "$env" 2>/dev/null && \
            echo "✅ Set $key for $env" || \
            echo "⚠️  Failed to set $key for $env"
    else
        echo -n "$value" | gh secret set "$key" 2>/dev/null && \
            echo "✅ Set $key (repository level)" || \
            echo "⚠️  Failed to set $key"
    fi
}

# Set environment-specific secrets
for env in Preview Production; do
    echo ""
    echo "🔧 Setting secrets for $env environment"
    echo "========================================="
    
    # Determine dataset based on environment
    if [ "$env" = "Preview" ]; then
        DATASET="preview"
        SUBDOMAIN="preview"
        NODE_ENV="preview"
        ENABLE_LOGS="false"
    else
        DATASET="production"
        SUBDOMAIN="www"
        NODE_ENV="production"
        ENABLE_LOGS="true"
    fi
    
    # Sanity secrets
    set_secret "$env" "NEXT_PUBLIC_SANITY_PROJECT_ID" "$SANITY_PROJECT_ID"
    set_secret "$env" "NEXT_PUBLIC_SANITY_DATASET" "$DATASET"
    set_secret "$env" "NEXT_PUBLIC_SANITY_API_VERSION" "2024-10-28"
    set_secret "$env" "NEXT_PUBLIC_SANITY_STUDIO_URL" "https://studio.$DOMAIN"
    set_secret "$env" "SANITY_API_READ_TOKEN" "$SANITY_READ_TOKEN"
    set_secret "$env" "SANITY_API_WRITE_TOKEN" "$SANITY_WRITE_TOKEN"
    set_secret "$env" "SANITY_STUDIO_PROJECT_ID" "$SANITY_PROJECT_ID"
    set_secret "$env" "SANITY_STUDIO_DATASET" "$DATASET"
    set_secret "$env" "SANITY_STUDIO_PRESENTATION_URL" "https://$SUBDOMAIN.$DOMAIN"
    set_secret "$env" "SANITY_STUDIO_PRODUCTION_HOSTNAME" "studio.$DOMAIN"
    set_secret "$env" "SANITY_STUDIO_TITLE" "Sanity Studio - $env"
    
    # Logging secrets
    set_secret "$env" "LOG_LEVEL" "info"
    set_secret "$env" "LOG_DIR" "logs"
    set_secret "$env" "ENABLE_FILE_LOGS" "$ENABLE_LOGS"
    set_secret "$env" "EDGE_LOG_HTTP" "false"
    set_secret "$env" "EDGE_LOG_ENDPOINT" "/api/logs"
    
    # Runtime secrets
    set_secret "$env" "NODE_ENV" "$NODE_ENV"
    set_secret "$env" "NEXT_RUNTIME" "nodejs"
    set_secret "$env" "HOST_NAME" "$DOMAIN"
done

# Set repository-level secrets
if [ "$use_vercel" = "y" ]; then
    echo ""
    echo "🔧 Setting repository-level Vercel secrets"
    echo "=========================================="
    set_secret "" "VERCEL_TOKEN" "$VERCEL_TOKEN"
    set_secret "" "VERCEL_ORG_ID" "$VERCEL_ORG_ID"
    set_secret "" "VERCEL_PROJECT_ID" "$VERCEL_PROJECT_ID"
fi

# Check for existing Sanity deploy token
if ! gh secret list | grep -q "SANITY_DEPLOY_TOKEN"; then
    echo ""
    echo "⚠️  SANITY_DEPLOY_TOKEN is not set. If you need it for Sanity Studio deployment, set it with:"
    echo "   gh secret set SANITY_DEPLOY_TOKEN"
fi

echo ""
echo "✅ Secret setup complete!"
echo ""
echo "To verify secrets were set correctly:"
echo "  gh secret list --env Preview"
echo "  gh secret list --env Production"
echo "  gh secret list  # for repository-level secrets"
echo ""
echo "To update a secret later:"
echo "  gh secret set SECRET_NAME --env ENVIRONMENT_NAME"