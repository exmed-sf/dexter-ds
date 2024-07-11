const fs = require('fs/promises');
const { parse } = require('svgson');

const outDir = './lib/icons';
const iconsPath = './lib/icons/svg';

function pascalCase(str) {
	return str
		.toLowerCase()
		.replace(/[-_]+/g, ' ')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.replace(/\s+(.)(\w*)/g, ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
		.replace(/\w/, (s) => s.toUpperCase());
}

/**
 * @param {import('svgson').INode} data
 */
function createElement(data) {
	const children = [];

	if (data.children) {
		data.children.forEach((child) => {
			children.push(createElement(child));
		});
	}

	let attrs = JSON.stringify(data.attributes);

	if (data.name === 'svg') {
		attrs = attrs.replace('}', ', ...props}');
	}

	return `React.createElement("${data.name}", ${attrs}, ${
		children.length > 0 ? children : null
	})`;
}

async function parseSvg(fileName) {
	const content = await fs.readFile(`${iconsPath}/${fileName}`, 'utf-8');

	const svgElement = await parse(content);

	return createElement(svgElement);
}

function generateRfc(componentName, data) {
	return `import React from 'react';\nfunction ${componentName}(props) {\nreturn (${data});\n}\nexport default ${componentName};`;
}

function generateTypes(componentName) {
	return `import React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;
}

function createExportsJSFile(files, includeExtension = true) {
	let content = '';

	const extension = includeExtension ? '.js' : '';

	files.map((fileName) => {
		const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

		const directoryString = `'./${componentName}${extension}'`;

		content += `export { default as ${componentName} } from ${directoryString};\n`;
	});

	content += `export * as svgs from './svg';`;

	return content;
}

function createExportsSVGFile(files) {
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
	const files = await fs.readdir(iconsPath, 'utf-8');

	console.log(`🔎	Identified ${files.length} icons`);

	await Promise.all(
		files.flatMap(async (fileName) => {
			const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

			const content = await parseSvg(fileName);

			const types = generateTypes(componentName);

			const arq = generateRfc(componentName, content);

			await fs.writeFile(`${outDir}/${componentName}.js`, arq, 'utf-8');

			await fs.writeFile(`${outDir}/${componentName}.d.ts`, types, 'utf-8');
		}),
	);

	const exports = createExportsSVGFile(files);

	console.log('📄	Creating React Native files');
	await fs.writeFile(`${outDir}/svg/index.js`, exports, 'utf-8');
	await fs.writeFile(`${outDir}/svg/index.d.ts`, exports, 'utf-8');

	console.log('📄	Creating React Web files');
	await fs.writeFile(`${outDir}/index.js`, createExportsJSFile(files), 'utf-8');
	await fs.writeFile(
		`${outDir}/index.d.ts`,
		createExportsJSFile(files, false),
		'utf-8',
	);
}

(function main() {
	console.log('🏗	Building icon package...');

	Promise.all([buildIcons()]).then(() =>
		console.log('✅	Finished building package.'),
	);
})();
