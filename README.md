# GT Hello World

A simple Hello World project for the Gas Town distributed AI worker system.

## Overview

This is a basic Node.js application that demonstrates a simple "Hello, World!" implementation within the Gas Town ecosystem. It serves as an example project for the distributed AI worker system.

## Project Structure

```
gthelloworld/
├── src/                 # Source code
│   └── index.js        # Main application entry point
├── tests/              # Test files
│   └── test.js        # Basic tests
├── docs/              # Documentation
├── package.json       # Project configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm (comes with Node.js)

### Installation

1. Clone the repository (if working independently):
   ```bash
   git clone git@github.com:jessesightler-redhat/gthelloworld.git
   cd gthelloworld
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the application:
   ```bash
   npm start
   ```

2. For development with auto-reload:
   ```bash
   npm run dev
   ```

### Testing

Run the test suite:
```bash
npm test
```

## Development

This project is part of the Gas Town distributed AI worker system:

- **Mayor**: Control daemon (Manager role)
- **Refinery**: Merge queue processor (Engineer role)
- **Witness**: Health monitor (Observer role)
- **Polecats**: AI worker agents (like this project)
- **Crew**: Human-managed workspaces

### Gas Town Workflow

The project uses **bd** (beads) for issue tracking:

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Contributing

1. Find work: `bd ready`
2. Claim an issue: `bd update <id> --status in_progress`
3. Make your changes
4. Test your changes: `npm test`
5. Complete the work: `bd close <id>`
6. Sync changes: `bd sync && git push`

## License

MIT License - see package.json for details.