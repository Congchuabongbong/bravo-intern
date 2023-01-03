export const isInline = (pStyles: CSSStyleDeclaration): boolean =>
  pStyles.display === 'inline' || pStyles.display.startsWith('inline-');
export const isCenter = (pStyles: CSSStyleDeclaration): boolean => pStyles.display === 'flex' && pStyles.justifyContent === 'center' && pStyles.alignItems === 'center';
export const isFlexDirectionRow = (pParentStyles: CSSStyleDeclaration) =>
  pParentStyles.display === 'flex' && pParentStyles.flexDirection === 'row';

export const isPositioned = (pStyles: CSSStyleDeclaration): boolean => pStyles.position !== 'static';

export const isInFlow = (pStyles: CSSStyleDeclaration): boolean =>
  pStyles.float !== 'none' && pStyles.position !== 'absolute' && pStyles.position !== 'fixed';

export const isTransparent = (pzColor: string): boolean => pzColor === 'transparent' || pzColor === 'rgba(0, 0, 0, 0)';

export const hasUniformBorder = (pStyles: CSSStyleDeclaration): boolean => hasBorderBottom(pStyles) || hasBorderLeft(pStyles) || hasBorderRight(pStyles) || hasBorderTop(pStyles);

export const hasBorderTop = (pStyles: CSSStyleDeclaration): boolean => !isTransparent(pStyles.borderTopColor) && parseFloat(pStyles.borderTopWidth) !== 0 && pStyles.borderTopStyle !== 'none' &&
  pStyles.borderTopStyle !== 'inset' &&
  pStyles.borderTopStyle !== 'outset';

export const hasBorderBottom = (pStyles: CSSStyleDeclaration): boolean => !isTransparent(pStyles.borderBottomColor) && parseFloat(pStyles.borderBottomWidth) !== 0 && pStyles.borderBottomStyle !== 'none' &&
  pStyles.borderBottomStyle !== 'inset' &&
  pStyles.borderBottomStyle !== 'outset';

export const hasBorderLeft = (pStyles: CSSStyleDeclaration): boolean => !isTransparent(pStyles.borderLeftColor) && parseFloat(pStyles.borderLeftWidth) !== 0 && pStyles.borderLeftStyle !== 'none' &&
  pStyles.borderLeftStyle !== 'inset' &&
  pStyles.borderLeftStyle !== 'outset';

export const hasBorderRight = (pStyles: CSSStyleDeclaration): boolean => !isTransparent(pStyles.borderRightColor) && parseFloat(pStyles.borderRightWidth) !== 0 && pStyles.borderRightStyle !== 'none' &&
  pStyles.borderRightStyle !== 'inset' &&
  pStyles.borderRightStyle !== 'outset';

export function isFloatLeft(pStyles: CSSStyleDeclaration): boolean {
  return pStyles.float === 'left';
}

export function isFloatRight(pStyles: CSSStyleDeclaration): boolean {
  return pStyles.float === 'right';
}
export const isVisible = (pStyles: CSSStyleDeclaration): boolean =>
  pStyles.display !== 'none' &&
  pStyles.visibility !== 'hidden' &&
  pStyles.opacity !== '0';

