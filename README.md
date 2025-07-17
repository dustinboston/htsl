# HyperText Style Language (HTSL)

`htsl` combines CSS and HTML into one language using CSS syntax.

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

HTML elements are represented by CSS rules, and their attributes
and content are defined by declarations within those rules. This makes it an
internal, or embedded, Domain Specific Language (DSL), to use Martin Fowler's
terminology.

### Elements and Content

An HTML element is represented by a CSS selector. At the moment the parser only
supports tag names, but in the future it could also support classes and IDs
inline, similar to how Jade/Pug does them. The text content of the element is
defined by the `content` property. This is equivalent to its innerHTML value.

**Example:**

```css
p {
  content: "Hello, World!";
}
```

Compiles to:

```html
<p>Hello, World!</p>
```

Nested elements are created by nesting CSS rules. Nesting is now supported on
all browsers, so it's a stable feature to take advantage of. This has the added
benefit of not having to write closing tags.

**Example:**:

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
prefixing a selector with `\\` you tell the parser that this selector is an HTML
attribute. These must always be selectors as they are not valid CSS properties.

**Example:**

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

## Implementation

I used the postcss package to parse CSS. I also tried css-tree and a few others
but none of them supported nesting. Once the CSS is parsed I use the AST to
convert it into an intermediate representation that is similar to a virtual DOM.
Finally I use the intermediate representation to generate the HTML and tidied
CSS. It might be possible to use VeeDoom (my WASM based VDOM parser) to parse
the intermediate representation more efficiently.
