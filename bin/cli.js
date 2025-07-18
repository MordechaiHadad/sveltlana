#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the package.json to read version and component info
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = await fs.readJson(packageJsonPath);

program
  .name('sveltlana')
  .description('CLI for Sveltlana - Svelte headless components')
  .version(packageJson.version);

// List available components
program
  .command('list')
  .description('List all available components')
  .action(() => {
    console.log('📦 Available Sveltlana components:');
    console.log('');
    
    // Extract component names from package.json exports
    const components = Object.keys(packageJson.exports)
      .filter(key => key !== '.' && key.startsWith('./'))
      .map(key => key.slice(2)); // Remove './' prefix
    
    components.forEach(component => {
      console.log(`  🧩 ${component}`);
    });
    
    console.log('');
    console.log(`Total: ${components.length} components`);
  });

// Download/extract a component
program
  .command('extract <component>')
  .description('Extract a component with its dependencies to your project')
  .option('-o, --output <path>', 'Output directory', './sveltlana-components')
  .action(async (componentName, options) => {
    try {
      await extractComponent(componentName, options.output);
    } catch (error) {
      console.error(`❌ Error extracting component: ${error.message}`);
      process.exit(1);
    }
  });

// Add component to existing project
program
  .command('add <component>')
  .description('Add a component to your existing project')
  .option('-p, --path <path>', 'Components directory path', './src/lib/components')
  .action(async (componentName, options) => {
    try {
      await addComponent(componentName, options.path);
    } catch (error) {
      console.error(`❌ Error adding component: ${error.message}`);
      process.exit(1);
    }
  });

// Initialize sveltlana in a project
program
  .command('init')
  .description('Initialize Sveltlana in your project')
  .option('-p, --path <path>', 'Installation path', './src/lib')
  .action(async (options) => {
    try {
      await initProject(options.path);
    } catch (error) {
      console.error(`❌ Error initializing project: ${error.message}`);
      process.exit(1);
    }
  });

async function extractComponent(componentName, outputPath) {
  console.log(`🚀 Extracting component: ${componentName}`);
  
  // Check if component exists
  const componentExport = `./${componentName}`;
  if (!packageJson.exports[componentExport]) {
    throw new Error(`Component "${componentName}" not found. Use 'sveltlana list' to see available components.`);
  }
  
  const srcPath = path.join(__dirname, '..', 'src');
  const componentSrcPath = path.join(srcPath, 'lib', 'components', componentName);
  const outputComponentPath = path.join(outputPath, componentName);
  
  // Create output directory
  await fs.ensureDir(outputPath);
  
  // Copy component files
  if (await fs.pathExists(componentSrcPath)) {
    await fs.copy(componentSrcPath, outputComponentPath);
    console.log(`✅ Component files copied to: ${outputComponentPath}`);
  } else {
    throw new Error(`Component source not found at: ${componentSrcPath}`);
  }
  
  // Copy shared dependencies (types, functions, actions)
  const sharedFiles = ['types.ts', 'functions.ts'];
  const sharedPath = path.join(outputPath, 'shared');
  await fs.ensureDir(sharedPath);
  
  for (const file of sharedFiles) {
    const srcFile = path.join(srcPath, 'lib', file);
    const destFile = path.join(sharedPath, file);
    
    if (await fs.pathExists(srcFile)) {
      await fs.copy(srcFile, destFile);
      console.log(`📁 Copied shared file: ${file}`);
    }
  }
  
  // Copy actions directory if it exists
  const actionsSrcPath = path.join(srcPath, 'lib', 'actions');
  const actionsDestPath = path.join(outputPath, 'actions');
  
  if (await fs.pathExists(actionsSrcPath)) {
    await fs.copy(actionsSrcPath, actionsDestPath);
    console.log(`🎬 Copied actions directory`);
  }
  
  // Create package.json for the extracted component
  const componentPackageJson = {
    name: `sveltlana-${componentName.toLowerCase()}`,
    version: packageJson.version,
    description: `${componentName} component from Sveltlana`,
    type: "module",
    main: `${componentName}/index.ts`,
    exports: {
      ".": {
        types: `./${componentName}/index.ts`,
        svelte: `./${componentName}/index.ts`
      }
    },
    peerDependencies: packageJson.peerDependencies,
    dependencies: packageJson.dependencies
  };
  
  await fs.writeJson(path.join(outputPath, 'package.json'), componentPackageJson, { spaces: 2 });
  
  // Create README
  const readme = `# ${componentName} Component

This is the ${componentName} component extracted from Sveltlana.

## Installation

Install Sveltlana:
\`\`\`bash
npm install sveltlana
\`\`\`

Or use just this component:
\`\`\`bash
# Copy this directory to your project
\`\`\`

## Usage

\`\`\`svelte
<script>
  import ${componentName} from './${componentName}';
</script>

<${componentName} />
\`\`\`

## Dependencies

This extraction includes:
- ${componentName} component files
- Shared types and functions
- Required actions
`;
  
  await fs.writeFile(path.join(outputPath, 'README.md'), readme);
  
  console.log(`🎉 Component ${componentName} successfully extracted to: ${outputPath}`);
  console.log(`📚 Check the README.md for usage instructions`);
}

async function addComponent(componentName, componentsPath) {
  console.log(`➕ Adding component: ${componentName} to ${componentsPath}`);
  
  // Check if component exists
  const componentExport = `./${componentName}`;
  if (!packageJson.exports[componentExport]) {
    throw new Error(`Component "${componentName}" not found. Use 'sveltlana list' to see available components.`);
  }
  
  const srcPath = path.join(__dirname, '..', 'src');
  const componentSrcPath = path.join(srcPath, 'lib', 'components', componentName);
  const destComponentPath = path.join(componentsPath, componentName);
  
  // Create components directory
  await fs.ensureDir(componentsPath);
  
  // Copy component
  if (await fs.pathExists(componentSrcPath)) {
    await fs.copy(componentSrcPath, destComponentPath);
    console.log(`✅ Component added to: ${destComponentPath}`);
  } else {
    throw new Error(`Component source not found at: ${componentSrcPath}`);
  }
  
  console.log(`🎉 Component ${componentName} successfully added!`);
  console.log(`💡 Don't forget to ensure you have the required shared dependencies and actions in your project.`);
}

async function initProject(basePath) {
  console.log(`🌟 Initializing Sveltlana in: ${basePath}`);
  
  const srcPath = path.join(__dirname, '..', 'src');
  
  // Copy lib structure
  const libSrcPath = path.join(srcPath, 'lib');
  const libDestPath = path.join(basePath);
  
  await fs.ensureDir(libDestPath);
  
  // Copy shared files
  const sharedFiles = ['types.ts', 'functions.ts', 'index.ts'];
  for (const file of sharedFiles) {
    const srcFile = path.join(libSrcPath, file);
    const destFile = path.join(libDestPath, file);
    
    if (await fs.pathExists(srcFile)) {
      await fs.copy(srcFile, destFile);
      console.log(`📁 Copied: ${file}`);
    }
  }
  
  // Copy actions
  const actionsSrc = path.join(libSrcPath, 'actions');
  const actionsDest = path.join(libDestPath, 'actions');
  
  if (await fs.pathExists(actionsSrc)) {
    await fs.copy(actionsSrc, actionsDest);
    console.log(`🎬 Copied actions directory`);
  }
  
  // Copy components
  const componentsSrc = path.join(libSrcPath, 'components');
  const componentsDest = path.join(libDestPath, 'components');
  
  if (await fs.pathExists(componentsSrc)) {
    await fs.copy(componentsSrc, componentsDest);
    console.log(`🧩 Copied all components`);
  }
  
  console.log(`🎉 Sveltlana successfully initialized!`);
  console.log(`📦 All components and dependencies are now available in: ${basePath}`);
}

program.parse();
