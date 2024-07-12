/*
 **	Referência dos cálculos: https://www.w3.org/TR/WCAG20-TECHS/G17.htm
 */

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

const HIGH_LEVEL_CONTRAST = 4.5;

/**
 * Retorna se uma cor tem o contraste suficiente para fundos brancos
 */
export function isContrastOkToWhite(hexColor: string) {
	return _contrastToWhite(hexColor) > HIGH_LEVEL_CONTRAST;
}

/**
 * Calcula valor do contraste de uma cor em relação ao branco
 */
function _contrastToWhite(hexColor: string) {
	const whiteIlluminance = 1;
	const illuminance = _calculateIlluminance(hexColor);
	return whiteIlluminance / illuminance;
}

/**
 * Converte cor hexadecimal para formato RGB
 */
function _hex2Rgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

/**
 * Return iluminance value (base for getting the contrast)
 */
function _calculateIlluminance(hexColor: string) {
	const rgbColor = _hex2Rgb(hexColor);

	if (rgbColor) {
		const { r, g, b } = rgbColor;

		const [red, green, blue] = [r, g, b].map((v) => {
			v /= 255;
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
		});
		return red * RED + green * GREEN + blue * BLUE;
	}

	throw new Error('Você deve especificar uma cor válida');
}
