import { Size as wjSize } from '@grapecity/wijmo';
import { SVG_NAMESPACE, XML_NAMESPACE, X_LINK_NAMESPACE } from './dom.util';
import { applyStylesTextSvgRaw, copyTextStylesSvg } from './text.util';
import { BehaviorText, borderAttributes } from './type.util';
export interface ISize extends Pick<wjSize, 'height' | 'width'> { };
export function setViewportSizeSVG(svg: SVGElement, size: ISize) {
  svg.setAttribute('width', size.width.toString());
  svg.setAttribute('height', size.height.toString());
}
export function drawRect(x: number, y: number, size: ISize, className?: string, style?: CSSStyleDeclaration, clipPath?: string): SVGElement {
  var rect = document.createElementNS(SVG_NAMESPACE, 'rect') as SVGElement;
  rect.setAttribute('x', x.toFixed(1));
  rect.setAttribute('y', y.toFixed(1));
  (size.width > 0 && size.width < 0.05) ? rect.setAttribute('width', '0.1') : rect.setAttribute('width', size.width.toFixed(1));
  (size.height > 0 && size.height < 0.05) ? rect.setAttribute('height', '0.1') : rect.setAttribute('height', size.height.toFixed(1));
  clipPath && rect.setAttribute('clip-path', 'url(#' + clipPath + ')');
  className && rect.setAttribute('class', className);
  style && applyStyle(rect, style);
  return rect;
}
export function applyStyle(el: SVGElement, style: CSSStyleDeclaration) {
  for (var key in style) {
    el.setAttribute(deCase(key), style[key]);
  }
}
export function creatorSVG(rect?: Partial<DOMRect>, isDeclareNamespaceSvg?: boolean) {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGElement;
  if (rect) {
    rect.width && rect.height && setViewportSize(svg, rect.width, rect.height);
    rect.x && svg.setAttribute('x', rect.x.toString());
    rect.y && svg.setAttribute('y', rect.y.toString());
  }
  isDeclareNamespaceSvg && declareNamespaceSvg(svg);
  return svg;
}
export function setViewportSize(svg: SVGElement, w: number, h: number) {
  svg.setAttribute('width', w.toString());
  svg.setAttribute('height', h.toString());
}
export function appendMultipleChildren(svg: SVGElement, children: SVGAElement[]): void {
  svg.append(...children);
}

export function deCase(s: string): string {
  return s.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase(); });
}
export function camelCase(s: string): string {
  return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export function drawText(textContent: string, behavior: BehaviorText, styles?: CSSStyleDeclaration | Record<string, string>, whiteSpace: 'default' | 'preserve' = 'default'): SVGElement {
  const textEl = document.createElementNS(SVG_NAMESPACE, 'text') as SVGElement;
  textEl.textContent = textContent;
  textEl.setAttribute('x', behavior.point.x.toString());
  textEl.setAttribute('y', (behavior.point.y).toString());
  if (styles && styles instanceof CSSStyleDeclaration) {
    copyTextStylesSvg(textEl, styles);
  } else if (styles) {
    applyStylesTextSvgRaw(textEl, styles);
  }
  textEl.setAttribute('dominant-baseline', behavior.dominantBaseline.toString());
  textEl.setAttribute('text-anchor', behavior.textAnchor.toString());
  if (whiteSpace === 'preserve') {
    textEl.setAttributeNS(XML_NAMESPACE, "xml:space", "preserve");
  }
  return textEl;
}

export function drawImage(imageHref: string, x: number, y: number, w: number, h: number, clipPath?: string): SVGElement {
  var img = document.createElementNS(SVG_NAMESPACE, 'image') as SVGElement;
  img.setAttributeNS(X_LINK_NAMESPACE, 'href', imageHref);
  img.setAttribute('x', x.toFixed(1));
  img.setAttribute('y', y.toFixed(1));
  img.setAttribute('width', w.toFixed(1));
  img.setAttribute('height', h.toFixed(1));
  if (clipPath) {
    img.setAttribute('clip-path', 'url(#' + clipPath + ')');
  }
  return img;
}
export function declareNamespaceSvg(svg: SVGElement): SVGElement {
  svg.setAttribute('xmlns', SVG_NAMESPACE);
  svg.setAttribute('xmlns:xlink', X_LINK_NAMESPACE);
  return svg;
}
export function getBgRectFromStylesSetup(styles: Record<string, string> | CSSStyleDeclaration): string {
  let bg = 'none';
  if (styles instanceof CSSStyleDeclaration) {
    bg = styles.getPropertyValue('background-color');
  } else {
    bg = styles['backgroundColor'] || 'none';
  }
  return bg;
}

export function getBgRectFormStylesSetup(styles: Record<string, string> | CSSStyleDeclaration): Record<string, string> {
  let borders = { borderRightColor: '', borderRightWidth: '', borderBottomColor: '', borderBottomWidth: '' };
  if (styles instanceof CSSStyleDeclaration) {
    borders.borderRightColor = styles.getPropertyValue('borderRightColor');
    borders.borderRightWidth = styles.getPropertyValue('borderRightWidth');
    borders.borderBottomColor = styles.getPropertyValue('borderBottomColor');
    borders;

  } else {

  }
  return borders;
}

export function getAcceptStylesBorderSvg(styles: CSSStyleDeclaration | Record<string, string>): Record<string, string> {
  const borders: Record<string, string> = {};
  for (const borderProperty of borderAttributes) {
    let value = '';
    if (styles instanceof CSSStyleDeclaration) {
      value = styles.getPropertyValue(borderProperty);
    } else {
      value = styles[camelCase(borderProperty)] || '';
    }
    if (value) {
      borders[camelCase(borderProperty)] = value;
    }
  }
  return borders;
}
