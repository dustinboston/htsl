# Gemini Project Guidelines: HTSL

## Project Overview

`HTSL` (HyperText Style Language) is a new programming language that combines HTML and CSS using CSS syntax. The long-term vision is to potentially incorporate JavaScript syntax to create a full-featured web language.

This project uses `bun` for package management and script execution. The core parsing logic, which leverages the `postcss` library, is located in `src/index.ts`. The project is now a command-line tool that can be installed globally via NPM.

## Development

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Build the project:**
    This command transpiles the TypeScript files to JavaScript and outputs them to the `dist` directory.
    ```bash
    bun run build
    ```

3.  **Run the development server:**
    This will serve the `dist` directory on `http://localhost:3000`.
    ```bash
    bun run start
    ```

### Running Tests

To execute the test suite, run:
```bash
bun test
```

### Key Files

-   `src/index.ts`: The main entry point and parsing logic.
-   `src/cli.ts`: The command-line interface for the project.
-   `html.css`: The input file written in the `htsl` language.
-   `GEMINI.md`: Contains project guidelines for the Gemini assistant.
