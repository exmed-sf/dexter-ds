const { transform } = require('@svgr/core');
const fs = require('fs/promises');
const { rimraf } = require('rimraf');
const { transformAsync } = require('@babel/core');
const { minify } = require('terser');

const outputPath = './icons';
const iconsPath = './src/assets/svg';

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
			replaceAttrValues: { '#000': "{props.color || 'currentColor'}" },
		},
		{ componentName },
	);

	const { code } = await transformAsync(svgReactContent, {
		presets: [['@babel/preset-react', { pure: false }]],
	});

	const { code: minifiedCode } = await minify(code);

	return minifiedCode;

	// return `export default function ${componentName}(){return(${svgReactContent});}`;
}

function indexFileContent(files, includeExtension = true) {
	let content = '';

	const extension = includeExtension ? '.js' : '';

	files.map((fileName) => {
		const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

		const directoryString = `'./${componentName}${extension}'`;

		content += `export { default as ${componentName} } from ${directoryString};\n`;
	});

	return content;
}

async function buildIcons() {
	const outDir = outputPath;

	await fs.mkdir(outDir, { recursive: true });

	const files = await fs.readdir(`${iconsPath}`, 'utf-8');

	await Promise.all(
		files.flatMap(async (fileName) => {
			const componentName = `Ic${pascalCase(fileName.replace(/.svg/, ''))}`;

			const content = await transformSVGtoJSX(fileName, componentName);

			const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

			console.log(`- Creating file: ${componentName}.js`);
			await fs.writeFile(`${outDir}/${componentName}.js`, content, 'utf-8');

			await fs.writeFile(`${outDir}/${componentName}.d.ts`, types, 'utf-8');
		}),
	);

	console.log('- Creating file: index.js');
	await fs.writeFile(`${outDir}/index.js`, indexFileContent(files), 'utf-8');
	await fs.writeFile(
		`${outDir}/index.d.ts`,
		indexFileContent(files, false),
		'utf-8',
	);
}

(function main() {
	console.log('🏗 Building icon package...');

	rimraf(`${outputPath}`)
		.then(() => Promise.all([buildIcons()]))
		.then(() => console.log('✅ Finished building package.'));
})();
