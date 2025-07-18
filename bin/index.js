#!/usr/bin/env node
/// <reference types="node" />
import { Command } from 'commander';
import { listComponents, downloadMultiple, removeMultiple } from './commands/index.js';
const program = new Command();
program
    .name('sveltlana')
    .description('CLI tool for Sveltlana headless components')
    .version('0.0.1');
program
    .command('list')
    .description('List all available components')
    .action(listComponents);
program
    .command('add <components...>')
    .description('Add one or more components to your project')
    .option('-o, --output <path>', 'Output directory', './src/lib/sveltlana')
    .option('--no-deps', 'Skip downloading dependencies')
    .action((components, options) => {
    downloadMultiple(components, options);
});
program
    .command('remove <components...>')
    .alias('rm')
    .description('Remove one or more components from your project')
    .option('-o, --output <path>', 'Output directory', './src/lib/sveltlana')
    .action((components, options) => {
    removeMultiple(components, options);
});
program.parse(process.argv);
