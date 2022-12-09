export const textAttributes = new Set([
  'color',
  'dominant-baseline',
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
  'text-anchor',
  'text-decoration',
  'text-rendering',
  'unicode-bidi',
  'word-spacing',
  'writing-mode',
  'user-select',
] as const);
export function copyTextStyles(styles: CSSStyleDeclaration, svgElement: SVGElement): void {
  for (const textProperty of textAttributes) {
    const value = styles.getPropertyValue(textProperty);
    if (value) {
      svgElement.setAttribute(textProperty, value);
    }
  }
  // tspan uses fill, CSS uses color
  svgElement.setAttribute('fill', styles.color);
}
