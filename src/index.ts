import * as postcss from "postcss";

export type Attr = {
  prop: string;
  value: string;
};

export type Vertex = {
  tag: string;
  attrs: Attr[];
  content?: string;
  children?: Vertex[];
};

const ATTR_PREFIX = "\\";
const ATTR_REGEXP = /\\.*/;
const TEXT_ATTR = "content";

const vars: Record<string, string> = {};
const selfClosing = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const attrNames = new Set([
  "alt",
  "autofocus",
  "charset",
  "checked",
  "class",
  "disabled",
  "hidden",
  "href",
  "id",
  "name",
  "onblur",
  "onchange",
  "onclick",
  "onmouseout",
  "onmouseover",
  "onsubmit",
  "placeholder",
  "readonly",
  "rel",
  "required",
  "src",
  "style",
  "tabindex",
  "target",
  "title",
  "type",
  "value",
  "viewport",
]);

// A simple regex to validate HTML tags
const htmlTagRegex = /^[a-zA-Z0-9]+$/;

function isStyle(prop: string): boolean {
  return !attrNames.has(prop);
}

export function getDecl(node: postcss.ChildNode): Attr | null {
  if (node.type === "decl") {
    return {
      prop: node.prop,
      value: node.value.startsWith("var(--")
        ? vars[node.value] || node.value
        : node.value,
    };
  }
  return null;
}

// For HTML generation: Extracts only attributes and content
export function getHtmlAttributesAndContent(nodes: postcss.ChildNode[]): {
  attrs: Attr[];
  content?: string;
} {
  const attrs: Attr[] = [];
  let content: string | undefined;

  nodes.forEach((child) => {
    if (child.type === "decl") {
      const decl = getDecl(child);
      if (decl) {
        if (decl.prop === TEXT_ATTR) {
          content = decl.value;
        } else if (attrNames.has(decl.prop)) {
          attrs.push(decl);
        }
      }
    } else if (
      child.type === "rule" &&
      child.selector.startsWith(ATTR_PREFIX)
    ) {
      const attrName = child.selector.slice(1).trim();
      const attrContent = getHtmlAttributesAndContent(child.nodes).content;
      if (attrContent) {
        attrs.push({ prop: attrName, value: attrContent });
      }
    }
  });

  return { attrs, content };
}

// For HTML generation: Recursively builds the HTML structure
export function getRule(node: postcss.ChildNode): Vertex | undefined {
  if (node.type === "rule" && htmlTagRegex.test(node.selector)) {
    if (node.selector === ":root") {
      return {
        tag: "!DOCTYPE html",
        attrs: [],
        content: "",
        children: [],
      };
    }

    const { attrs, content } = getHtmlAttributesAndContent(node.nodes);

    const children = node.nodes
      .filter(
        (child): child is postcss.Rule =>
          child.type === "rule" && htmlTagRegex.test(child.selector)
      )
      .map((child) => getRule(child))
      .filter((child): child is Vertex => child !== undefined);

    return {
      tag: node.selector,
      attrs,
      content,
      children: children.length > 0 ? children : undefined,
    };
  }
  return undefined;
}

export function vertexToHTML(vertex: Vertex): string {
  const attrs = vertex.attrs
    .map((attr) => {
      const prop = attr.prop.startsWith('\\') ? attr.prop.slice(1) : attr.prop;
      return `${prop}=${attr.value}`;
    })
    .join(" ")
    .trim();

  let children = vertex.children
    ? vertex.children.map((child) => vertexToHTML(child)).join("")
    : "";

  if (vertex.tag === "head") {
    children = '<link rel="stylesheet" href="styles.css">' + children;
  }

  let content = vertex.content || "";
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  if (!vertex.tag) {
    return content;
  }

  if (vertex.tag.startsWith("!")) {
    return `<${vertex.tag}>`;
  }

  const attrsString = attrs ? ` ${attrs}` : "";

  if (selfClosing.has(vertex.tag)) {
    return `<${vertex.tag}${attrsString} />`;
  }

  return `<${vertex.tag}${attrsString}>${content}${children}</${vertex.tag}>`;
}

export async function processCss(cssSource: string): Promise<string> {
  const htmlAst = postcss.parse(cssSource);

  // --- Variable Collection ---
  htmlAst.walkDecls((decl) => {
    if (decl.prop.startsWith("--")) {
      vars[`var(${decl.prop})`] = decl.value;
    }
  });

  // --- HTML Generation ---
  const vertices = htmlAst.nodes
    .map((node) => getRule(node))
    .filter((vertex): vertex is Vertex => vertex !== undefined);

  return vertices.map((vertex) => vertexToHTML(vertex)).join("\n");
}
