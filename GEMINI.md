# Gemini Project Guidelines: html-css

## Project Overview

`html-css` is a new programming language that combines HTML and CSS using CSS syntax. The long-term vision is to potentially incorporate JavaScript syntax to create a full-featured web language.

This project uses `bun` for package management and script execution. The core parsing logic, which leverages the `postcss` library, is located in `src/index.ts`.

## Getting Started

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Run the compiler:**
    This command transpiles the `html.css` file into a standard HTML file.
    ```bash
    bun ./src/index.ts
    ```

3.  **Serve the output:**
    To view the generated HTML, start a local development server.
    ```bash
    bun run dev
    ```

## Development

### Running Tests

To execute the test suite, run:
```bash
bun test
```

### Key Files

-   `src/index.ts`: The main entry point and parsing logic.
-   `html.css`: The input file written in the `html-css` language.
-   `css.html`: The generated HTML output file.
-   `GEMINI.md`: Contains project guidelines for the Gemini assistant.
