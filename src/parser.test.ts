import { describe, it, expect } from "bun:test";
import * as postcss from "postcss";
import {
  getDecl,
  getHtmlAttributesAndContent,
  getRule,
  vertexToHTML,
} from "./index";

describe("parser", () => {
  it("should correctly parse a simple declaration", () => {
    const css = `a { color: red; }`;
    const root = postcss.parse(css);
    const first = root.first as postcss.Rule;
    const decl = first.nodes[0] as postcss.Declaration;
    const result = getDecl(decl);
    expect(result).toEqual({ prop: "color", value: "red" });
  });

  it("should extract attributes, content, and styles from a rule", () => {
    const css = `div { class: "container"; content: "Hello"; color: blue; }`;
    const root = postcss.parse(css);
    const rule = root.first as postcss.Rule;
    expect(rule).toBeDefined();
    const { attrs, content } = getHtmlAttributesAndContent(rule.nodes);
    expect(attrs).toEqual([{ prop: "class", value: '"container"' }]);
    expect(content).toEqual('"Hello"');
  });

  it("should parse a rule with styles into a vertex", () => {
    const css = `div { color: red; }`;
    const root = postcss.parse(css);
    const rule = root.first as postcss.Rule;
    const vertex = getRule(rule);
    expect(vertex).toEqual({
      tag: "div",
      attrs: [],
      content: undefined,
      children: undefined,
      // styles: [new postcss.Declaration({ prop: "color", value: "red" })],
    });
  });

  it("should convert a simple vertex to HTML", () => {
    const vertex = { tag: "p", attrs: [], content: "Hello" };
    const html = vertexToHTML(vertex);
    expect(html).toBe("<p>Hello</p>");
  });

  it("should handle nested elements", () => {
    const css = `div { p { content: "Nested"; } }`;
    const root = postcss.parse(css);
    const rule = root.first as postcss.Rule;
    const vertex = getRule(rule);
    expect(vertex).toBeDefined();
    const html = vertexToHTML(vertex!);
    expect(html).toBe("<div><p>Nested</p></div>");
  });

  it("should handle self-closing tags", () => {
    const vertex = {
      tag: "img",
      attrs: [{ prop: "src", value: '"image.jpg"' }],
    };
    const html = vertexToHTML(vertex);
    expect(html).toBe(`<img src="image.jpg" />`);
  });

  it("should inject stylesheet link into the head", () => {
    const vertex = { tag: "head", attrs: [], children: [] };
    const html = vertexToHTML(vertex);
    expect(html).toContain(`<link rel="stylesheet" href="styles.css">`);
  });
});
