#!/bin/bash

# Create a new React component with TypeScript
# Usage: /run docs/commands/component.sh <ComponentName> [directory]
# Example: /run docs/commands/component.sh ProductCard components/blocks

NAME=$1
DIR=${2:-"components"}

if [ -z "$NAME" ]; then
    echo "Usage: component.sh <ComponentName> [directory]"
    echo "Example: component.sh ProductCard components/blocks"
    exit 1
fi

# Convert to kebab-case for filename
KEBAB_CASE=$(echo "$NAME" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')

# Determine full path
if [[ "$DIR" == packages/ui/* ]]; then
    FULL_PATH="$DIR/$KEBAB_CASE.tsx"
else
    FULL_PATH="apps/web/src/$DIR/$KEBAB_CASE.tsx"
fi

# Create directory if it doesn't exist
mkdir -p "$(dirname "$FULL_PATH")"

# Check if file already exists
if [ -f "$FULL_PATH" ]; then
    echo "Error: $FULL_PATH already exists"
    exit 1
fi

# Determine if it's a UI package component
if [[ "$DIR" == packages/ui/* ]]; then
    # UI Package Component
    cat > "$FULL_PATH" << EOF
import { cn } from "@workspace/ui/lib/utils";

interface ${NAME}Props {
  className?: string;
  children?: React.ReactNode;
}

export function $NAME({ className, children }: ${NAME}Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
EOF
else
    # App Component
    cat > "$FULL_PATH" << EOF
import { cn } from "@/lib/utils";

interface ${NAME}Props {
  className?: string;
}

export function $NAME({ className }: ${NAME}Props) {
  return (
    <div className={cn("", className)}>
      {/* Add your component content here */}
    </div>
  );
}
EOF
fi

echo "✅ Created $FULL_PATH"
echo ""
echo "Component created! You can now:"
echo "1. Import it: import { $NAME } from '@/$DIR/$KEBAB_CASE';"
echo "2. Use it: <$NAME />"

# If it's a block component, remind about PageBuilder registration
if [[ "$DIR" == *"blocks"* ]]; then
    echo ""
    echo "📝 Remember to register in PageBuilder if this is a Sanity block component!"
fi