export const isInline = (styles: CSSStyleDeclaration): boolean =>
  styles.display === 'inline' || styles.display.startsWith('inline-');

export const isFlexDirectionRow = (parentStyles: CSSStyleDeclaration) =>
  parentStyles.display === 'flex' && parentStyles.flexDirection === 'row';

export const isPositioned = (styles: CSSStyleDeclaration): boolean => styles.position !== 'static';

export const isInFlow = (styles: CSSStyleDeclaration): boolean =>
  styles.float !== 'none' && styles.position !== 'absolute' && styles.position !== 'fixed';

export const isTransparent = (color: string): boolean => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';

export const hasUniformBorder = (styles: CSSStyleDeclaration): boolean => hasBorderBottom(styles) || hasBorderLeft(styles) || hasBorderRight(styles) || hasBorderTop(styles);

export const hasBorderTop = (styles: CSSStyleDeclaration): boolean => !isTransparent(styles.borderTopColor) && parseFloat(styles.borderTopWidth) !== 0 && styles.borderTopStyle !== 'none' &&
  styles.borderTopStyle !== 'inset' &&
  styles.borderTopStyle !== 'outset';

export const hasBorderBottom = (styles: CSSStyleDeclaration): boolean => !isTransparent(styles.borderBottomColor) && parseFloat(styles.borderBottomWidth) !== 0 && styles.borderBottomStyle !== 'none' &&
  styles.borderBottomStyle !== 'inset' &&
  styles.borderBottomStyle !== 'outset';

export const hasBorderLeft = (styles: CSSStyleDeclaration): boolean => !isTransparent(styles.borderLeftColor) && parseFloat(styles.borderLeftWidth) !== 0 && styles.borderLeftStyle !== 'none' &&
  styles.borderLeftStyle !== 'inset' &&
  styles.borderLeftStyle !== 'outset';

export const hasBorderRight = (styles: CSSStyleDeclaration): boolean => !isTransparent(styles.borderRightColor) && parseFloat(styles.borderRightWidth) !== 0 && styles.borderRightStyle !== 'none' &&
  styles.borderRightStyle !== 'inset' &&
  styles.borderRightStyle !== 'outset';

export function isFloatLeft(style: CSSStyleDeclaration): boolean {
  return style.float === 'left';
}

export function isFloatRight(style: CSSStyleDeclaration): boolean {
  return style.float === 'right';
}
export const isVisible = (styles: CSSStyleDeclaration): boolean =>
  styles.display !== 'none' &&
  styles.visibility !== 'hidden' &&
  styles.opacity !== '0';

