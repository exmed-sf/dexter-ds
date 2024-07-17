const fs = require('fs/promises');
const colors = require('../../dist/colors');

const CSS_DIR = 'lib/css';

async function generateColors() {
	console.log('📄	Creating css colors file');
	const css = ':root{$}';
	let tempCss = '';

	for (const color of Object.keys(colors)) {
		for (const [variant, hex] of Object.entries(colors[color])) {
			tempCss += `--dx-${color}-${variant}:${hex};`;
		}
	}

	const data = css.replace('$', tempCss);

	await fs.writeFile(`${CSS_DIR}/colors.css`, data, 'utf-8');

	console.log('✅	Finished css colors file');
}

async function loadFonts() {
	console.log('📄	Creating css fonts file');
	await fs.cp('src/assets/css', CSS_DIR, { recursive: true });
	console.log('✅	Finished css fonts file');
}

async function generateCss() {
	console.log('🏗	Building css files...');

	await loadFonts();
	await generateColors();

	console.log('✅	Finished css files.');
}

module.exports = generateCss;
