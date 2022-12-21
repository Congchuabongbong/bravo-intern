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

export function copyTextStyles(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
  for (const textProperty of textAttributes) {
    const value = styles.getPropertyValue(textProperty);
    if (value) {
      svgElement.setAttribute(textProperty, value);
    }
  }
  // tspan uses fill, CSS uses color
  svgElement.setAttribute('fill', styles.color);
}
