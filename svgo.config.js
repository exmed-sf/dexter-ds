module.exports = {
	multipass: true,
	js2svg: {
		indent: 2,
		pretty: true,
	},
	plugins: [
		{ name: 'preset-default' },
		'sortAttrs',
		'removeScriptElement',
		'removeDimensions',
		{
			name: 'convertColors',
			params: {
				currentColor: true,
			},
		},
		{
			name: 'addAttributesToSVGElement',
			params: {
				attributes: [{ width: '1em', height: '1em' }],
			},
		},
	],
};
