import { describe, it, expect } from 'bun:test';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

describe('CLI', () => {
  it('should convert a file and output to the default directory', async () => {
    const inputPath = 'html.css';
    const outputDir = 'dist';
    const outputPath = path.join(outputDir, 'html.html');

    // Cleanup previous runs
    await fs.rm(outputDir, { recursive: true, force: true });

    execSync(`bun run src/cli.ts ${inputPath}`);

    const stats = await fs.stat(outputPath);
    expect(stats.isFile()).toBe(true);
  });

  it('should convert a file and output to a specified directory', async () => {
    const inputPath = 'html.css';
    const outputDir = 'custom-dist';
    const outputPath = path.join(outputDir, 'html.html');

    // Cleanup previous runs
    await fs.rm(outputDir, { recursive: true, force: true });

    execSync(`bun run src/cli.ts ${inputPath} -o ${outputDir}`);

    const stats = await fs.stat(outputPath);
    expect(stats.isFile()).toBe(true);

    // Cleanup
    await fs.rm(outputDir, { recursive: true, force: true });
  });
});
