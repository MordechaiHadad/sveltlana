#!/usr/bin/env node

/// <reference types="node" />

import { Command } from 'commander';

import { listComponents, downloadMultiple, removeMultiple } from './commands/index.js';


import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgPath = resolve(__dirname, '../package.json');
const { version } = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const program = new Command();

program
  .name('sveltlana')
  .description('CLI tool for Sveltlana headless components')
  .version(version);

program
  .command('list')
  .description('List all available components')
  .action(listComponents);

program
  .command('add <components...>')
  .description('Add one or more components to your project')
  .option('-o, --output <path>', 'Output directory', './src/lib/sveltlana')
  .option('--no-deps', 'Skip downloading dependencies')
  .action((components: string[], options: { output: string; deps: boolean }) => {
    downloadMultiple(components, options);
  });

program
  .command('remove <components...>')
  .alias('rm')
  .description('Remove one or more components from your project')
  .option('-o, --output <path>', 'Output directory', './src/lib/sveltlana')
  .action((components: string[], options: { output: string; deps: boolean }) => {
    removeMultiple(components, options);
  });

program.parse(process.argv);
