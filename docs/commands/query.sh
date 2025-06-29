#!/bin/bash

# Create a new GROQ query fragment
# Usage: /run docs/commands/query.sh <name> [type]
# Example: /run docs/commands/query.sh products product

NAME=$1
TYPE=${2:-$NAME}

if [ -z "$NAME" ]; then
    echo "Usage: query.sh <name> [type]"
    echo "Example: query.sh products product"
    exit 1
fi

# Convert to uppercase for constant name
UPPER_NAME=$(echo "$NAME" | tr '[:lower:]' '[:upper:]')
FRAGMENT_NAME="${NAME}Fragment"

# Singular form for type if not provided
if [ "$TYPE" == "$NAME" ]; then
    # Simple pluralization removal
    TYPE=$(echo "$NAME" | sed 's/s$//')
fi

# Target file
FILE="apps/web/src/data/sanity.queries.ts"

# Create the fragment
FRAGMENT=$(cat << EOF

// $NAME Fragment
export const $FRAGMENT_NAME = /* groq */ \`
  _id,
  _type,
  title,
  slug,
  _createdAt,
  _updatedAt
\`;

// Get all $NAME
export const ${UPPER_NAME}_QUERY = /* groq */ \`
  *[_type == "$TYPE"] | order(_createdAt desc) {
    \${$FRAGMENT_NAME}
  }
\`;

// Get single ${TYPE} by slug
export const ${TYPE^^}_BY_SLUG_QUERY = /* groq */ \`
  *[_type == "$TYPE" && slug.current == \$slug][0] {
    \${$FRAGMENT_NAME}
  }
\`;
EOF
)

echo "📝 Add this to $FILE:"
echo ""
echo "$FRAGMENT"
echo ""
echo "✅ Query fragments created!"
echo ""
echo "Usage examples:"
echo "const { data } = await loadQuery(${UPPER_NAME}_QUERY);"
echo "const { data } = await loadQuery(${TYPE^^}_BY_SLUG_QUERY, { slug });"