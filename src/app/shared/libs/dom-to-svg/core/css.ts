export const isCSSFontFaceRule = (rule: CSSRule): rule is CSSFontFaceRule => rule.type === CSSRule.FONT_FACE_RULE;

export const isInline = (styles: CSSStyleDeclaration): boolean =>
  styles.display === 'inline' || styles.display.startsWith('inline-');

export const isPositioned = (styles: CSSStyleDeclaration): boolean => styles.position !== 'static';

export const isInFlow = (styles: CSSStyleDeclaration): boolean =>
  styles.float !== 'none' && styles.position !== 'absolute' && styles.position !== 'fixed';

export const isTransparent = (color: string): boolean => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';

export const hasUniformBorder = (styles: CSSStyleDeclaration): boolean =>
  parseFloat(styles.borderTopWidth) !== 0 &&
  styles.borderTopStyle !== 'none' &&
  styles.borderTopStyle !== 'inset' &&
  styles.borderTopStyle !== 'outset' &&
  !isTransparent(styles.borderTopColor) &&
  // Cannot use border property directly as in Firefox those are empty strings.
  // Need to get the specific border properties from the specific sides.
  // https://stackoverflow.com/questions/41696063/getcomputedstyle-returns-empty-strings-on-ff-when-instead-crome-returns-a-comp
  styles.borderTopWidth === styles.borderLeftWidth &&
  styles.borderTopWidth === styles.borderRightWidth &&
  styles.borderTopWidth === styles.borderBottomWidth &&
  styles.borderTopColor === styles.borderLeftColor &&
  styles.borderTopColor === styles.borderRightColor &&
  styles.borderTopColor === styles.borderBottomColor &&
  styles.borderTopStyle === styles.borderLeftStyle &&
  styles.borderTopStyle === styles.borderRightStyle &&
  styles.borderTopStyle === styles.borderBottomStyle;

/** A side of a box. */
export type Side = 'top' | 'bottom' | 'right' | 'left';

/** The 4 sides of a box. */
const SIDES: Side[] = ['top', 'bottom', 'right', 'left'];

/** Whether the given side is a horizontal side. */
export const isHorizontal = (side: Side): boolean => side === 'bottom' || side === 'top';

/**
 * The two corners for each side, in order of lower coordinate to higher coordinate.
 */
const CORNERS: Record<Side, [Side, Side]> = {
  top: ['left', 'right'],
  bottom: ['left', 'right'],
  left: ['top', 'bottom'],
  right: ['top', 'bottom'],
};
export const isVisible = (styles: CSSStyleDeclaration): boolean =>
  styles.display !== 'none' &&
  styles.visibility !== 'hidden' &&
  styles.opacity !== '0';

export function copyCssStyles(from: CSSStyleDeclaration, to: CSSStyleDeclaration): CSSStyleDeclaration {
  return { ...from, ...to };
}

export function isFloatLeft(style: CSSStyleDeclaration): boolean {
  return style.float === 'left';
}

export function isFloatRight(style: CSSStyleDeclaration): boolean {
  return style.float === 'right';
}
