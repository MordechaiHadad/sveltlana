import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Declare global process for TypeScript compatibility
declare const process: {
  cwd(): string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ComponentInfo {
  name: string;
  description: string;
  dependencies: string[];
  files: string[];
}

export interface DownloadOptions {
  output: string;
  deps: boolean;
}

export async function listComponents(): Promise<void> {
  try {
    const componentsPath = path.join(__dirname, '../../src/lib/sveltlana/components');
    const libPath = path.join(__dirname, '../../src/lib/sveltlana');
    const items = await fs.readdir(componentsPath);
    
    console.log('🎨 Available Sveltlana Components:\n');
    
    let componentCount = 0;
    
    // Check for folder-based components
    for (const item of items) {
      const itemPath = path.join(componentsPath, item);
      const statResult = await fs.stat(itemPath);
      
      if (statResult.isDirectory()) {
        const hasIndex = await fs.pathExists(path.join(itemPath, 'index.ts'));
        if (hasIndex) {
          console.log(`  📦 ${item} (component suite)`);
          componentCount++;
          
          // Show component files
          const files = await fs.readdir(itemPath);
          const svelteFiles = files.filter((f: string) => f.endsWith('.svelte'));
          console.log(`     Files: ${files.length} (${svelteFiles.length} Svelte components)`);
        }
      } else if (item.endsWith('.svelte')) {
        // Standalone Svelte components
        const componentName = item.replace('.svelte', '');
        console.log(`  🧩 ${componentName} (standalone component)`);
        componentCount++;
      }
    }
    
    // Check for actions
    const actionsPath = path.join(libPath, 'actions');
    if (await fs.pathExists(actionsPath)) {
      const actionFiles = await fs.readdir(actionsPath);
      const tsActions = actionFiles.filter((f: string) => f.endsWith('.ts'));
      if (tsActions.length > 0) {
        console.log(`  ⚡ Actions (${tsActions.length} actions)`);
        tsActions.forEach(action => {
          const actionName = action.replace('.ts', '');
          console.log(`     - ${actionName}`);
        });
        componentCount++;
      }
    }
    
    console.log(`\nTotal: ${componentCount} component groups`);
    console.log('\nUsage: sveltlana add <component-name>');
  } catch (error) {
    console.error('❌ Error listing components:', error);
  }
}

export async function downloadComponent(componentName: string, options: DownloadOptions): Promise<void> {
  try {
    console.log(`📥 Adding component: ${componentName}`);
    
    const componentsPath = path.join(__dirname, '../../src/lib/sveltlana/components');
    const libPath = path.join(__dirname, '../../src/lib/sveltlana');
    
    // Check for folder-based component
    const folderPath = path.join(componentsPath, componentName);
    const svelteFilePath = path.join(componentsPath, `${componentName}.svelte`);
    const actionsPath = path.join(libPath, 'actions');
    
    let sourcePath: string;
    let targetPath: string;
    let componentType: string;
    
    if (await fs.pathExists(folderPath) && (await fs.stat(folderPath)).isDirectory()) {
      // Folder-based component
      sourcePath = folderPath;
      targetPath = path.join(process.cwd(), options.output, componentName);
      componentType = 'component suite';
    } else if (await fs.pathExists(svelteFilePath)) {
      // Standalone Svelte component
      sourcePath = svelteFilePath;
      targetPath = path.join(process.cwd(), options.output, `${componentName}.svelte`);
      componentType = 'standalone component';
    } else if (componentName.toLowerCase() === 'actions') {
      // Actions
      if (await fs.pathExists(actionsPath)) {
        sourcePath = actionsPath;
        targetPath = path.join(process.cwd(), options.output, '..', 'actions');
        componentType = 'actions';
      } else {
        console.error(`❌ Actions not found`);
        return;
      }
    } else {
      console.error(`❌ Component '${componentName}' not found`);
      console.log('💡 Run "sveltlana list" to see available components');
      return;
    }
    
    // Copy component files
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);
    
    console.log(`✅ ${componentType} '${componentName}' added to ${targetPath}`);
    
    // Copy dependencies if requested
    if (options.deps && componentType !== 'actions') {
      await copyDependencies(componentName, options.output);
    }
    
    // Check if component requires tailwind-merge by scanning files
    const requiresTailwindMerge = await checkComponentForTailwindMerge(sourcePath);
    if (requiresTailwindMerge) {
      console.log(`\n📦 Required dependency:`);
      console.log(`npm install tailwind-merge`);
    }
    
    // Show usage instructions
    if (componentType === 'standalone component') {
      console.log(`\n📚 Usage example:`);
      console.log(`import ${componentName} from '$lib/sveltlana/${componentName}.svelte';`);
    } else if (componentType === 'component suite') {
      console.log(`\n📚 Usage example:`);
      console.log(`import { ${componentName} } from '$lib/sveltlana/${componentName}';`);
    } else if (componentType === 'actions') {
      console.log(`\n📚 Usage example:`);
      console.log(`import { actionName } from '$lib/actions/actionName';`);
    }
    
  } catch (error) {
    console.error(`❌ Error adding component '${componentName}':`, error);
  }
}

export async function downloadMultiple(components: string[], options: DownloadOptions): Promise<void> {
  console.log(`📥 Adding ${components.length} components...`);
  
  for (const component of components) {
    await downloadComponent(component, options);
  }
  
  console.log(`\n✅ All components added successfully!`);
}

export async function removeMultiple(components: string[], options: DownloadOptions): Promise<void> {
  console.log(`🗑️ Removing ${components.length} components...`);
  
  for (const component of components) {
    await removeComponent(component, options);
  }
  
  console.log(`\n✅ All components removed successfully!`);
}

async function removeComponent(componentName: string, options: DownloadOptions): Promise<void> {
  try {
    console.log(`🗑️ Removing component: ${componentName}`);
    
    // Check for folder-based component
    const folderPath = path.join(process.cwd(), options.output, componentName);
    const svelteFilePath = path.join(process.cwd(), options.output, `${componentName}.svelte`);
    const actionsPath = path.join(process.cwd(), options.output, '..', 'actions');
    
    let targetPath: string;
    let componentType: string;
    
    if (await fs.pathExists(folderPath) && (await fs.stat(folderPath)).isDirectory()) {
      // Folder-based component
      targetPath = folderPath;
      componentType = 'component suite';
    } else if (await fs.pathExists(svelteFilePath)) {
      // Standalone Svelte component
      targetPath = svelteFilePath;
      componentType = 'standalone component';
    } else if (componentName.toLowerCase() === 'actions' && await fs.pathExists(actionsPath)) {
      // Actions
      targetPath = actionsPath;
      componentType = 'actions';
    } else {
      console.error(`❌ Component '${componentName}' not found in ${options.output}`);
      console.log('💡 Make sure the component exists in your project');
      return;
    }
    
    // Remove component files
    await fs.remove(targetPath);
    
    console.log(`✅ ${componentType} '${componentName}' removed from ${targetPath}`);
    
  } catch (error) {
    console.error(`❌ Error removing component '${componentName}':`, error);
  }
}

async function copyDependencies(componentName: string, outputDir: string): Promise<void> {
  try {
    console.log(`📦 Copying dependencies for ${componentName}...`);
    const libPath = path.join(__dirname, '../../src/lib/sveltlana');
    const componentPath = path.join(__dirname, '../../src/lib/sveltlana/components', componentName);
    let filesToCheck: string[] = [];
    // Gather all .ts and .svelte files in the component folder
    if (await fs.pathExists(componentPath) && (await fs.stat(componentPath)).isDirectory()) {
      const allFiles = await fs.readdir(componentPath);
      filesToCheck = allFiles.filter(f => f.endsWith('.ts') || f.endsWith('.svelte')).map(f => path.join(componentPath, f));
    } else if (await fs.pathExists(componentPath + '.svelte')) {
      filesToCheck = [componentPath + '.svelte'];
    }

    // Read all files and check for imports
    let needsFunctions = false;
    let needsTypes = false;
    const neededActions = new Set();
    const actionImportRegex = /from ['"](\.\.\/)*actions\/?([\w-]*)['"]/g;
    for (const file of filesToCheck) {
      const content = await fs.readFile(file, 'utf-8');
      if (content.match(/from ['"](\.\.\/)*functions['"]/)) needsFunctions = true;
      if (content.match(/from ['"](\.\.\/)*types['"]/)) needsTypes = true;
      let match;
      while ((match = actionImportRegex.exec(content)) !== null) {
        if (match[2]) neededActions.add(match[2]);
      }
    }

    // Copy only needed dependencies
    if (needsFunctions) {
      const sourcePath = path.join(libPath, 'functions.ts');
      const targetPath = path.join(process.cwd(), outputDir, '..', 'functions.ts');
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log('  📄 Copied: functions.ts');
      }
    }
    if (needsTypes) {
      const sourcePath = path.join(libPath, 'types.ts');
      const targetPath = path.join(process.cwd(), outputDir, '..', 'types.ts');
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log('  📄 Copied: types.ts');
      }
    }
    if (neededActions.size > 0) {
      const actionsPath = path.join(libPath, 'actions');
      const targetActionsPath = path.join(process.cwd(), outputDir, '..', 'actions');
      await fs.ensureDir(targetActionsPath);
      for (const action of neededActions) {
        const actionFile = path.join(actionsPath, `${action}.ts`);
        if (await fs.pathExists(actionFile)) {
          await fs.copy(actionFile, path.join(targetActionsPath, `${action}.ts`));
          console.log(`  � Copied action: ${action}.ts`);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ Warning: Could not copy all dependencies:`, error);
  }
}

async function checkComponentForTailwindMerge(sourcePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(sourcePath);
    
    if (stat.isFile()) {
      // Single file - check if it contains tailwind-merge
      const content = await fs.readFile(sourcePath, 'utf-8');
      return content.includes('tailwind-merge') || content.includes('twMerge');
    } else if (stat.isDirectory()) {
      // Directory - check all .svelte files
      const files = await fs.readdir(sourcePath);
      for (const file of files) {
        if (file.endsWith('.svelte')) {
          const filePath = path.join(sourcePath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          if (content.includes('tailwind-merge') || content.includes('twMerge')) {
            return true;
          }
        }
      }
    }
    
    return false;
  } catch {
    // If we can't read the file, assume no dependency needed
    return false;
  }
}
