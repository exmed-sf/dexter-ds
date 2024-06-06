const { transform } = require('@svgr/core');
const fs = require('fs/promises');

const outputPath = './lib/icons';
const iconsPath = './lib/icons/svg';

function pascalCase(str) {
	return str
		.toLowerCase()
		.replace(/[-_]+/g, ' ')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.replace(/\s+(.)(\w*)/g, ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
		.replace(/\w/, (s) => s.toUpperCase());
}

async function transformSVGtoJSX(file, componentName) {
	const content = await fs.readFile(`${iconsPath}/${file}`, 'utf-8');

	const svgReactContent = await transform(
		content,
		{
			icon: true,
			plugins: [
				'@svgr/plugin-svgo',
				'@svgr/plugin-jsx',
				'@svgr/plugin-prettier',
			],
		},
		{ componentName },
	);

	return svgReactContent;
}

function indexFileContent(files, includeExtension = true) {
	let content = '';

	const extension = includeExtension ? '.jsx' : '';

	files.map((fileName) => {
		const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

		const directoryString = `'./${componentName}${extension}'`;

		content += `export { default as ${componentName} } from ${directoryString};\n`;
	});

	return content;
}

function buildIndexNativeFile(files) {
	let content = '';
	let exports = '';

	files.map((fileName) => {
		const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

		const directoryString = `'../svg/${fileName}'`;

		content += `import ${componentName} from ${directoryString};\n`;
		exports += ` ${componentName},`;
	});

	return `${content}\nexport {${exports.slice(0, -1)} }`;
}

async function buildIcons() {
	const outDir = outputPath;

	await fs.mkdir(outDir, { recursive: true });

	const files = await fs.readdir(`${iconsPath}`, 'utf-8');

	console.log(`🔎 Identified ${files.length} icons`);

	await Promise.all(
		files.flatMap(async (fileName) => {
			const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

			const content = await transformSVGtoJSX(fileName, componentName);

			const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

			await fs.writeFile(`${outDir}/${componentName}.jsx`, content, 'utf-8');

			await fs.writeFile(`${outDir}/${componentName}.d.ts`, types, 'utf-8');
		}),
	);

	const exports = buildIndexNativeFile(files);

	console.log('- Creating React Native files');
	await fs.writeFile(`${outDir}/svg/index.js`, exports, 'utf-8');
	await fs.writeFile(`${outDir}/svg/index.d.ts`, exports, 'utf-8');

	console.log('- Creating file: icons.ts');
	await fs.writeFile(`${outDir}/index.js`, indexFileContent(files), 'utf-8');
	await fs.writeFile(
		`${outDir}/index.d.ts`,
		indexFileContent(files, false),
		'utf-8',
	);
}

(function main() {
	console.log('🏗 Building icon package...');

	Promise.all([buildIcons()]).then(() =>
		console.log('✅ Finished building package.'),
	);
})();
