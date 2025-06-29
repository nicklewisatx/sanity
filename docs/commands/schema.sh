#!/bin/bash

# Create a new Sanity schema
# Usage: /run docs/commands/schema.sh <type> <name>
# Example: /run docs/commands/schema.sh document product

TYPE=$1
NAME=$2

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
    echo "Usage: schema.sh <type> <name>"
    echo "Types: document, block, object"
    echo "Example: schema.sh document product"
    exit 1
fi

# Convert name to different cases
PASCAL_CASE=$(echo "$NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')
CAMEL_CASE=$(echo "$PASCAL_CASE" | sed 's/^./\L&/')

# Determine directory based on type
case $TYPE in
    "document")
        DIR="apps/studio/schemaTypes/documents"
        ;;
    "block")
        DIR="apps/studio/schemaTypes/blocks"
        ;;
    "object")
        DIR="apps/studio/schemaTypes/objects"
        ;;
    *)
        echo "Unknown type: $TYPE"
        echo "Valid types: document, block, object"
        exit 1
        ;;
esac

FILE="$DIR/$NAME.ts"

# Check if file already exists
if [ -f "$FILE" ]; then
    echo "Error: $FILE already exists"
    exit 1
fi

# Create the schema file
cat > "$FILE" << EOF
import { defineType, defineField } from 'sanity';

export const $CAMEL_CASE = defineType({
  name: '$CAMEL_CASE',
  title: '$PASCAL_CASE',
  type: '$TYPE',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
EOF

# Add type-specific fields
if [ "$TYPE" == "document" ]; then
    cat >> "$FILE" << EOF
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
EOF
fi

# Close the fields array and add preview
cat >> "$FILE" << EOF
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled',
      };
    },
  },
});
EOF

echo "✅ Created $FILE"
echo ""
echo "Next steps:"
echo "1. Add more fields to $FILE"
echo "2. Export from apps/studio/schemaTypes/index.ts:"
echo "   import { $CAMEL_CASE } from './${DIR#apps/studio/schemaTypes/}/$NAME';"
echo "   export const schemaTypes = [..., $CAMEL_CASE];"
echo "3. Run: cd apps/studio && pnpm run type"