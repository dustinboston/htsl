#!/usr/bin/env bun

import fs from "fs/promises";
import path from "path";
import { parseArgs } from "util";
import { processCss } from "./index";

const { values, positionals } = parseArgs({
  options: {
    outdir: {
      type: "string",
      short: "o",
      default: "dist",
    },
  },
  allowPositionals: true,
});

const inputFile = positionals[0];

if (!inputFile) {
  console.error("Please provide an input file.");
  process.exit(1);
}

async function main(inputFile: string, outputDir: string) {
  try {
    const inputPath = path.resolve(inputFile);
    const css = await fs.readFile(inputPath, "utf-8");
    const html = await processCss(css);

    const outputFileName =
      path.basename(inputFile, path.extname(inputFile)) + ".html";
    const outputPath = path.join(outputDir, outputFileName);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, html);

    console.log(`Successfully converted ${inputFile} to ${outputPath}`);
  } catch (error) {
    console.error("Error processing file:", error);
    process.exit(1);
  }
}

main(inputFile, values.outdir);
