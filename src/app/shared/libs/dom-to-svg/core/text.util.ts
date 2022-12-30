import { camelCase } from "./svg.engine.util";
import { textAttributes } from "./type.util";


export function copyTextStylesSvg(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
  for (const textProperty of textAttributes) {
    const value = styles.getPropertyValue(textProperty);
    if (value) {
      svgElement.setAttribute(textProperty, value);
    }
  }
  svgElement.setAttribute('fill', styles.color);
}

export function applyStylesTextSvgRaw(svgElement: SVGElement, styles: Record<string, string>) {
  for (const textProperty of textAttributes) {
    const value = styles[camelCase(textProperty)] || '';
    value && svgElement.setAttribute(textProperty, value);
  }
  svgElement.setAttribute('fill', styles['color']);
}

export function getAcceptStylesTextSvg(styles: CSSStyleDeclaration | Record<string, string>): Record<string, string> {
  const stylesText: Record<string, string> = {};
  for (const textProperty of textAttributes) {
    let value = '';
    if (styles instanceof CSSStyleDeclaration) {
      value = styles.getPropertyValue(textProperty);
    } else {
      value = styles[camelCase(textProperty)] || '';
    }
    if (value) {
      stylesText[camelCase(textProperty)] = value;
    }
  }
  return stylesText;
}

export function creatorCssDeclaration(): CSSStyleDeclaration {
  var spanVirtual = document.createElement('span');
  const styles = spanVirtual.style;
  styles.display = 'none';
  return styles;
}



