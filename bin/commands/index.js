import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function listComponents() {
    try {
        const componentsPath = path.join(__dirname, '../../src/lib/components');
        const libPath = path.join(__dirname, '../../src/lib');
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
                    const svelteFiles = files.filter((f) => f.endsWith('.svelte'));
                    console.log(`     Files: ${files.length} (${svelteFiles.length} Svelte components)`);
                }
            }
            else if (item.endsWith('.svelte')) {
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
            const tsActions = actionFiles.filter((f) => f.endsWith('.ts'));
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
    }
    catch (error) {
        console.error('❌ Error listing components:', error);
    }
}
export async function downloadComponent(componentName, options) {
    try {
        console.log(`📥 Adding component: ${componentName}`);
        const componentsPath = path.join(__dirname, '../../src/lib/components');
        const libPath = path.join(__dirname, '../../src/lib');
        // Check for folder-based component
        const folderPath = path.join(componentsPath, componentName);
        const svelteFilePath = path.join(componentsPath, `${componentName}.svelte`);
        const actionsPath = path.join(libPath, 'actions');
        let sourcePath;
        let targetPath;
        let componentType;
        if (await fs.pathExists(folderPath) && (await fs.stat(folderPath)).isDirectory()) {
            // Folder-based component
            sourcePath = folderPath;
            targetPath = path.join(process.cwd(), options.output, componentName);
            componentType = 'component suite';
        }
        else if (await fs.pathExists(svelteFilePath)) {
            // Standalone Svelte component
            sourcePath = svelteFilePath;
            targetPath = path.join(process.cwd(), options.output, `${componentName}.svelte`);
            componentType = 'standalone component';
        }
        else if (componentName.toLowerCase() === 'actions') {
            // Actions
            if (await fs.pathExists(actionsPath)) {
                sourcePath = actionsPath;
                targetPath = path.join(process.cwd(), options.output, '..', 'actions');
                componentType = 'actions';
            }
            else {
                console.error(`❌ Actions not found`);
                return;
            }
        }
        else {
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
        // Show usage instructions
        if (componentType === 'standalone component') {
            console.log(`\n📚 Usage example:`);
            console.log(`import ${componentName} from '$lib/sveltlana/${componentName}.svelte';`);
        }
        else if (componentType === 'component suite') {
            console.log(`\n📚 Usage example:`);
            console.log(`import { ${componentName} } from '$lib/sveltlana/${componentName}';`);
        }
        else if (componentType === 'actions') {
            console.log(`\n📚 Usage example:`);
            console.log(`import { actionName } from '$lib/actions/actionName';`);
        }
    }
    catch (error) {
        console.error(`❌ Error adding component '${componentName}':`, error);
    }
}
export async function downloadMultiple(components, options) {
    console.log(`📥 Adding ${components.length} components...`);
    for (const component of components) {
        await downloadComponent(component, options);
    }
    console.log(`\n✅ All components added successfully!`);
}
export async function removeMultiple(components, options) {
    console.log(`🗑️ Removing ${components.length} components...`);
    for (const component of components) {
        await removeComponent(component, options);
    }
    console.log(`\n✅ All components removed successfully!`);
}
async function removeComponent(componentName, options) {
    try {
        console.log(`🗑️ Removing component: ${componentName}`);
        // Check for folder-based component
        const folderPath = path.join(process.cwd(), options.output, componentName);
        const svelteFilePath = path.join(process.cwd(), options.output, `${componentName}.svelte`);
        const actionsPath = path.join(process.cwd(), options.output, '..', 'actions');
        let targetPath;
        let componentType;
        if (await fs.pathExists(folderPath) && (await fs.stat(folderPath)).isDirectory()) {
            // Folder-based component
            targetPath = folderPath;
            componentType = 'component suite';
        }
        else if (await fs.pathExists(svelteFilePath)) {
            // Standalone Svelte component
            targetPath = svelteFilePath;
            componentType = 'standalone component';
        }
        else if (componentName.toLowerCase() === 'actions' && await fs.pathExists(actionsPath)) {
            // Actions
            targetPath = actionsPath;
            componentType = 'actions';
        }
        else {
            console.error(`❌ Component '${componentName}' not found in ${options.output}`);
            console.log('💡 Make sure the component exists in your project');
            return;
        }
        // Remove component files
        await fs.remove(targetPath);
        console.log(`✅ ${componentType} '${componentName}' removed from ${targetPath}`);
    }
    catch (error) {
        console.error(`❌ Error removing component '${componentName}':`, error);
    }
}
async function copyDependencies(componentName, outputDir) {
    try {
        console.log(`📦 Copying dependencies for ${componentName}...`);
        const libPath = path.join(__dirname, '../../src/lib');
        const sharedFiles = ['types.ts', 'functions.ts'];
        // Copy shared library files
        for (const file of sharedFiles) {
            const sourcePath = path.join(libPath, file);
            const targetPath = path.join(process.cwd(), outputDir, '..', file);
            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, targetPath);
                console.log(`  📄 Copied: ${file}`);
            }
        }
        // Copy actions if they exist
        const actionsPath = path.join(libPath, 'actions');
        if (await fs.pathExists(actionsPath)) {
            const targetActionsPath = path.join(process.cwd(), outputDir, '..', 'actions');
            await fs.copy(actionsPath, targetActionsPath);
            console.log(`  📁 Copied: actions/`);
        }
    }
    catch (error) {
        console.warn(`⚠️ Warning: Could not copy all dependencies:`, error);
    }
}
