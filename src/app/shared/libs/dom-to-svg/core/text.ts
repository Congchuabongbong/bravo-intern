import { Point } from '@grapecity/wijmo';
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
export enum TextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Start = 'start',
  End = 'end',
}
export type BehaviorText = {
  point: Point;
  dominantBaseline: DominantBaseline,
  textAnchor: TextAnchor;
};
export type DominantBaseline = 'auto' | 'middle' | 'hanging';
export type TextAnchor = 'start' | 'middle' | 'end';
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
