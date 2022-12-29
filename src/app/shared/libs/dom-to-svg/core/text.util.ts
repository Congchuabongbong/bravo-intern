import { camelCase, deCase } from "./svg.engine.util";

export const textAttributes = new Set([
  'color',
  'font-family',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'direction',
  'letter-spacing',
  'text-decoration',
  'text-decoration',
  'text-rendering',
  'unicode-bidi',
  'word-spacing',
  'writing-mode',
  'user-select', 'white-space'
] as const);

export function copyTextStylesSvg(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
  for (const textProperty of textAttributes) {
    const value = styles.getPropertyValue(textProperty);
    if (value) {
      svgElement.setAttribute(textProperty, value);
    }
  }
  svgElement.setAttribute('fill', styles.color);
}

export function applyTextSvgStylesRaw(svgElement: SVGElement, styles: Record<string, string>) {
  for (const textProperty of textAttributes) {
    const value = styles[camelCase(textProperty)] || '';
    value && svgElement.setAttribute(textProperty, value);
  }
  svgElement.setAttribute('fill', styles['color']);
}
export function creatorCssDeclaration(): CSSStyleDeclaration {
  var spanVirtual = document.createElement('span');
  const styles = spanVirtual.style;
  styles.display = 'none';
  return styles;
}

export function getStyleAcceptTextSvg(styles: CSSStyleDeclaration): Record<string, string> {
  const stylesText: Record<string, string> = {};
  for (const textProperty of textAttributes) {
    const value = styles.getPropertyValue(textProperty);
    if (value) {
      stylesText[camelCase(textProperty)] = value;
    }
  }
  return stylesText;
}

