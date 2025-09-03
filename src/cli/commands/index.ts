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
				// Check all .svelte files in the directory for deprecation
				const files = await fs.readdir(itemPath);
				let isDeprecated = false;
				for (const file of files) {
					if (file.endsWith('.svelte')) {
						const filePath = path.join(itemPath, file);
						const content = await fs.readFile(filePath, 'utf-8');
						const lines = content.split('\n');
						for (const line of lines) {
							const trimmed = line.trim().toLowerCase();
							if (trimmed === '' || trimmed.startsWith('//')) continue;
							if (trimmed.includes('deprecated')) isDeprecated = true;
							break;
						}
					}
				}
				const indexPath = path.join(itemPath, 'index.ts');
				const hasIndex = await fs.pathExists(indexPath);
				if (hasIndex) {
					console.log(`  📦 ${item} (component suite)${isDeprecated ? ' [DEPRECATED]' : ''}`);
					componentCount++;
					// Show component files
					const svelteFiles = files.filter((f: string) => f.endsWith('.svelte'));
					console.log(`     Files: ${files.length} (${svelteFiles.length} Svelte components)`);
				}
			} else if (item.endsWith('.svelte')) {
				// Standalone Svelte components
				const componentName = item.replace('.svelte', '');
				const content = await fs.readFile(itemPath, 'utf-8');
				const lines = content.split('\n');
				let isDeprecated = false;
				for (const line of lines) {
					const trimmed = line.trim().toLowerCase();
					if (trimmed === '' || trimmed.startsWith('//')) continue;
					if (trimmed.includes('deprecated')) isDeprecated = true;
					break;
				}
				console.log(
					`  🧩 ${componentName} (standalone component)${isDeprecated ? ' [DEPRECATED]' : ''}`
				);
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
				tsActions.forEach((action) => {
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

export async function downloadComponent(
	componentName: string,
	options: DownloadOptions
): Promise<void> {
	try {
		console.log(`📥 Adding component: ${componentName}`);

		const componentsPath = path.join(__dirname, '../../src/lib/sveltlana/components');
		const libPath = path.join(__dirname, '../../src/lib/sveltlana');

		const folderPath = path.join(componentsPath, componentName);
		const svelteFilePath = path.join(componentsPath, `${componentName}.svelte`);
		const actionsPath = path.join(libPath, 'actions');

		let sourcePath: string;
		let targetPath: string;
		let componentType: string;

		if ((await fs.pathExists(folderPath)) && (await fs.stat(folderPath)).isDirectory()) {
			// Folder-based component
			// deprecation warning handled inline
			const indexPath = path.join(folderPath, 'index.ts');
			if (await fs.pathExists(indexPath)) {
				const firstLine = (await fs.readFile(indexPath, 'utf-8')).split('\n')[0].toLowerCase();
				if (firstLine.includes('deprecated')) console.log('⚠️  This component is DEPRECATED.');
			}
			sourcePath = folderPath;
			targetPath = path.join(process.cwd(), options.output, 'components', componentName);
			componentType = 'component suite';
			await fs.ensureDir(path.dirname(targetPath));
			await fs.copy(sourcePath, targetPath);
			console.log(`✅ ${componentType} '${componentName}' added to ${targetPath}`);
			if (options.deps) await copyDependencies(componentName, options.output);
		} else if (await fs.pathExists(svelteFilePath)) {
			// Standalone Svelte component
			const content = await fs.readFile(svelteFilePath, 'utf-8');
			const lines = content.split('\n');
			for (const line of lines) {
				const trimmed = line.trim().toLowerCase();
				if (trimmed === '' || trimmed.startsWith('//')) continue;
				if (trimmed.includes('deprecated')) console.log('⚠️  This component is DEPRECATED.');
				break;
			}
			sourcePath = svelteFilePath;
			targetPath = path.join(
				process.cwd(),
				options.output,
				'components',
				`${componentName}.svelte`
			);
			componentType = 'standalone component';
			await fs.ensureDir(path.dirname(targetPath));
			await fs.copy(sourcePath, targetPath);
			console.log(`✅ ${componentType} '${componentName}' added to ${targetPath}`);
			if (options.deps) await copyDependencies(componentName, options.output);
		} else if (componentName.toLowerCase() === 'actions') {
			// Actions
			if (await fs.pathExists(actionsPath)) {
				sourcePath = actionsPath;
				targetPath = path.join(process.cwd(), options.output, 'actions');
				componentType = 'actions';
				await fs.ensureDir(targetPath);
				await fs.copy(sourcePath, targetPath);
				console.log(`✅ ${componentType} added to ${targetPath}`);
			} else {
				console.error(`❌ Actions not found`);
				return;
			}
		} else {
			console.error(`❌ Component '${componentName}' not found`);
			console.log('💡 Run "sveltlana list" to see available components');
			return;
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
			console.log(
				`import ${componentName} from '$lib/sveltlana/components/${componentName}.svelte';`
			);
		} else if (componentType === 'component suite') {
			console.log(`\n📚 Usage example:`);
			console.log(`import { ${componentName} } from '$lib/sveltlana/components/${componentName}';`);
		} else if (componentType === 'actions') {
			console.log(`\n📚 Usage example:`);
			console.log(`import { actionName } from '$lib/sveltlana/actions/actionName';`);
		}
	} catch (error) {
		console.error(`❌ Error adding component '${componentName}':`, error);
	}
}

export async function downloadMultiple(
	components: string[],
	options: DownloadOptions
): Promise<void> {
	console.log(`📥 Adding ${components.length} components...`);

	for (const component of components) {
		await downloadComponent(component, options);
	}

	console.log(`\n✅ All components added successfully!`);
}

export async function removeMultiple(
	components: string[],
	options: DownloadOptions
): Promise<void> {
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

		if ((await fs.pathExists(folderPath)) && (await fs.stat(folderPath)).isDirectory()) {
			// Folder-based component
			targetPath = folderPath;
			componentType = 'component suite';
		} else if (await fs.pathExists(svelteFilePath)) {
			// Standalone Svelte component
			targetPath = svelteFilePath;
			componentType = 'standalone component';
		} else if (componentName.toLowerCase() === 'actions' && (await fs.pathExists(actionsPath))) {
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
		const componentsLibPath = path.join(libPath, 'components');
		const targetComponentsRoot = path.join(process.cwd(), outputDir, 'components');
		await fs.ensureDir(targetComponentsRoot);

		const visited = new Set<string>();

		async function processComponent(name: string) {
			if (visited.has(name)) return;
			visited.add(name);

			const compDir = path.join(componentsLibPath, name);
			const compFile = path.join(componentsLibPath, `${name}.svelte`);

			let filesToCheck: string[] = [];
			if ((await fs.pathExists(compDir)) && (await fs.stat(compDir)).isDirectory()) {
				const allFiles = await fs.readdir(compDir);
				filesToCheck = allFiles
					.filter((f) => f.endsWith('.ts') || f.endsWith('.svelte'))
					.map((f) => path.join(compDir, f));
			} else if (await fs.pathExists(compFile)) filesToCheck = [compFile];
			else {
				// If the referenced name is a file inside the current component folder, treat it as internal and skip warning
				const possibleInternal = path.join(componentsLibPath, componentName, `${name}.svelte`);
				if (await fs.pathExists(possibleInternal)) return;
				console.warn(`  ⚠️ Component dependency not found in library: ${name}`);
				return;
			}

			// detect needed deps from files
			let needsFunctions = false;
			let needsTypes = false;
			const neededActions = new Set<string>();
			const neededComponents = new Set<string>();

			const importPathRegex = /from\s+['"]([^'"]+)['"]/g;

			for (const file of filesToCheck) {
				const content = await fs.readFile(file, 'utf-8');
				if (content.match(/from ['"](\.\.\/)*functions['"]/)) needsFunctions = true;
				if (content.match(/from ['"](\.\.\/)*types['"]/)) needsTypes = true;

				let match: RegExpExecArray | null;
				while ((match = importPathRegex.exec(content)) !== null) {
					const importPath = match[1];

					if (importPath.includes('actions')) {
						const parts = importPath.split('/');
						const a = parts[parts.length - 1].replace(/\.ts$/, '');
						if (a) neededActions.add(a);
						continue;
					}

					if (importPath.includes('functions') || importPath.includes('types')) continue;

					const lower = importPath.toLowerCase();
					if (lower.includes('/components/') || importPath.endsWith('.svelte')) {
						const parts = importPath.replace(/\.svelte$/, '').split('/');
						const candidate = parts[parts.length - 1];
						if (candidate) neededComponents.add(candidate);
						continue;
					}

					if (importPath.startsWith('./') || importPath.startsWith('../')) {
						const parts = importPath.split('/');
						const candidate = parts[parts.length - 1].replace(/\.svelte$/, '');
						if (candidate && /^[A-Z]/.test(candidate)) neededComponents.add(candidate);
					}
				}
			}

			// copy basic deps
			if (needsFunctions) {
				const sourcePath = path.join(libPath, 'functions.ts');
				const targetPath = path.join(process.cwd(), outputDir, 'functions.ts');
				if (await fs.pathExists(sourcePath)) {
					await fs.copy(sourcePath, targetPath);
					console.log('  📄 Copied: functions.ts');
				}
			}
			if (needsTypes) {
				const sourcePath = path.join(libPath, 'types.ts');
				const targetPath = path.join(process.cwd(), outputDir, 'types.ts');
				if (await fs.pathExists(sourcePath)) {
					await fs.copy(sourcePath, targetPath);
					console.log('  📄 Copied: types.ts');
				}
			}
			if (neededActions.size > 0) {
				const actionsPath = path.join(libPath, 'actions');
				const targetActionsPath = path.join(process.cwd(), outputDir, 'actions');
				await fs.ensureDir(targetActionsPath);
				for (const action of neededActions) {
					const actionFile = path.join(actionsPath, `${action}.ts`);
					if (await fs.pathExists(actionFile)) {
						await fs.copy(actionFile, path.join(targetActionsPath, `${action}.ts`));
						console.log(`  📄 Copied action: ${action}.ts`);
					}
				}
			}

			// copy component itself
			if ((await fs.pathExists(compDir)) && (await fs.stat(compDir)).isDirectory()) {
				const targetDir = path.join(targetComponentsRoot, name);
				if (!(await fs.pathExists(targetDir))) {
					await fs.copy(compDir, targetDir);
					console.log(`  📦 Copied component suite: ${name}`);
				}
			} else if (await fs.pathExists(compFile)) {
				const targetFile = path.join(targetComponentsRoot, `${name}.svelte`);
				if (!(await fs.pathExists(targetFile))) {
					await fs.copy(compFile, targetFile);
					console.log(`  📦 Copied component file: ${name}.svelte`);
				}
			}

			// recurse into component deps
			for (const c of neededComponents) await processComponent(c);
		}

		await processComponent(componentName);
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
