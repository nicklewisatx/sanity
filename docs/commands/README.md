# Claude Code Slash Commands

This directory contains slash command scripts for common development tasks. These commands can be invoked in Claude Code using `/run <command>`.

## Available Commands

### `/schema <type> <name>`
Creates a new Sanity schema with boilerplate code.

Example: `/run docs/commands/schema.sh document product`

### `/component <name>`
Creates a new React component with TypeScript.

Example: `/run docs/commands/component.sh ProductCard`

### `/query <name>`
Creates a new GROQ query fragment.

Example: `/run docs/commands/query.sh products`

## Creating New Commands

1. Create a new script in this directory
2. Make it executable: `chmod +x script.sh`
3. Add documentation above
4. Follow the naming convention: lowercase with hyphens

## Command Guidelines

- Commands should be focused on a single task
- Include parameter validation
- Provide helpful error messages
- Use consistent output formatting
- Follow project conventions