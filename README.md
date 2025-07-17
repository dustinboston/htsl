# html-css

`html-css` is a new programming language that combines HTML and CSS using CSS-like syntax.

## Quick Start

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Build the HTML:**
    This command reads `html.css` and outputs the compiled `css.html`.
    ```bash
    bun run build
    ```

3.  **Run the development server:**
    This will build the HTML and serve it on `http://localhost:3000`.
    ```bash
    bun run dev
    ```

## Syntax

The syntax is based on CSS. HTML elements are represented by CSS rules, and their attributes and content are defined by declarations within those rules.

### Elements and Content

An HTML element is created using a CSS selector. The text content of the element is defined by the `content` property.

**Example:**
```css
p {
  content: "Hello, World!";
}
```

This compiles to:
```html
<p>Hello, World!</p>
```

Nested elements are created by nesting CSS rules:
```css
div {
  p {
    content: "This is a paragraph inside a div.";
  }
}
```

Compiles to:
```html
<div><p>This is a paragraph inside a div.</p></div>
```

### Attributes

Attributes can be added to elements by using the `\\` (backslash) prefix. By
prefixing a selector with `\\` you tell the parser that this selector is an
HTML attribute. These must always appear as selectors as they are not valid 
CSS declarations.

    ```css
    input {
      \\placeholder {
        content: "Enter your name";
      }
      \\type {
        content: "text";
      }
    }
    ```

    Compiles to:
    ```html
    <input type="text" placeholder="Enter your name" />
    ```

---
*This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.*
