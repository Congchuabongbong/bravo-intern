export const isInline = (pStyles: CSSStyleDeclaration): boolean => pStyles.display === 'inline' || pStyles.display.startsWith('inline-');
//TODO: by me not complete
//#Center
export const isCenterTop = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'center' && pStyles.alignItems === 'flex-start';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'center' && pStyles['alignItems'] === 'flex-start';
  }
};

export const isCenterCenter = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'center' && pStyles.alignItems === 'center';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'center' && pStyles['alignItems'] === 'center';
  }
};

export const isCenterBottom = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'center' && pStyles.alignItems === 'flex-end';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'center' && pStyles['alignItems'] === 'flex-end';
  }
};

//#Left
export const isLeftTop = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flexStart' && pStyles.alignItems === 'flex-start';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flexStart' && pStyles['alignItems'] === 'flex-start';
  }
};

export const isLeftCenter = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flexStart' && pStyles.alignItems === 'center';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flexStart' && pStyles['alignItems'] === 'center';
  }
};

export const isLeftBottom = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flexStart' && pStyles.alignItems === 'flex-end';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flexStart' && pStyles['alignItems'] === 'flex-end';
  }
};

//#Right
export const isRightTop = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flex-end' && pStyles.alignItems === 'flex-start';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flex-end' && pStyles['alignItems'] === 'flex-start';
  }
};

export const isRightCenter = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flex-end' && pStyles.alignItems === 'center';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flex-end' && pStyles['alignItems'] === 'center';
  }
};

export const isRightBottom = (pStyles: CSSStyleDeclaration | Record<string, string>): boolean => {
  if (pStyles instanceof CSSStyleDeclaration) {
    return pStyles.display === 'flex' && pStyles.justifyContent === 'flexStart' && pStyles.alignItems === 'flex-end';
  } else {
    return pStyles['display'] === 'flex' && pStyles['justifyContent'] === 'flexStart' && pStyles['alignItems'] === 'flex-end';
  }
};
//end
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

export const isFloatLeft = (pStyles: CSSStyleDeclaration): boolean => pStyles.float === 'left';

export const isFloatRight = (pStyles: CSSStyleDeclaration): boolean => pStyles.float === 'right';

export const isVisible = (pStyles: CSSStyleDeclaration): boolean =>
  pStyles.display !== 'none' &&
  pStyles.visibility !== 'hidden' &&
  pStyles.opacity !== '0';

