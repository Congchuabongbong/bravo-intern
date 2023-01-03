import { Size as wjSize } from '@grapecity/wijmo';
import { SVG_NAMESPACE, XML_NAMESPACE, X_LINK_NAMESPACE } from './dom.util';
import { BehaviorText, borderAttributes, textAttributes } from './type.util';
export interface ISize extends Pick<wjSize, 'height' | 'width'> { };
export function setViewportSizeSVG(pSvg: SVGElement, pSize: ISize) {
  pSvg.setAttribute('width', pSize.width.toString());
  pSvg.setAttribute('height', pSize.height.toString());
}
export function drawRect(pnX: number, pnY: number, pSize: ISize, pzClassName?: string, pStyle?: CSSStyleDeclaration, pzClipPath?: string): SVGElement {
  var rect = document.createElementNS(SVG_NAMESPACE, 'rect') as SVGElement;
  rect.setAttribute('x', pnX.toFixed(1));
  rect.setAttribute('y', pnY.toFixed(1));
  (pSize.width > 0 && pSize.width < 0.05) ? rect.setAttribute('width', '0.1') : rect.setAttribute('width', pSize.width.toFixed(1));
  (pSize.height > 0 && pSize.height < 0.05) ? rect.setAttribute('height', '0.1') : rect.setAttribute('height', pSize.height.toFixed(1));
  pzClipPath && rect.setAttribute('clip-path', 'url(#' + pzClipPath + ')');
  pzClassName && rect.setAttribute('class', pzClassName);
  pStyle && applyStyle(rect, pStyle);
  return rect;
}
export function applyStyle(pEl: SVGElement, pStyle: CSSStyleDeclaration) {
  for (var key in pStyle) {
    pEl.setAttribute(deCase(key), pStyle[key]);
  }
}
export function creatorSVG(pRect?: Partial<DOMRect>, pbIsDeclareNamespaceSvg?: boolean) {
  const _svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGElement;
  if (pRect) {
    pRect.width && pRect.height && setViewportSize(_svg, pRect.width, pRect.height);
    pRect.x && _svg.setAttribute('x', pRect.x.toString());
    pRect.y && _svg.setAttribute('y', pRect.y.toString());
  }
  pbIsDeclareNamespaceSvg && declareNamespaceSvg(_svg);
  return _svg;
}
export function setViewportSize(pSvg: SVGElement, pnWidth: number, pnHeight: number) {
  pSvg.setAttribute('width', pnWidth.toString());
  pSvg.setAttribute('height', pnHeight.toString());
}
export function appendMultipleChildren(pSvg: SVGElement, pChildren: SVGAElement[]): void {
  pSvg.append(...pChildren);
}

export function deCase(pzName: string): string {
  return pzName.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase(); });
}
export function camelCase(pzName: string): string {
  return pzName.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export function drawText(pzTextContent: string, pBehavior: BehaviorText, pStyles?: CSSStyleDeclaration | Record<string, string>, pWhiteSpace: 'default' | 'preserve' = 'default'): SVGElement {
  const _textEl = document.createElementNS(SVG_NAMESPACE, 'text') as SVGElement;
  _textEl.textContent = pzTextContent;
  _textEl.setAttribute('x', pBehavior.point.x.toString());
  _textEl.setAttribute('y', (pBehavior.point.y).toString());
  if (pStyles && pStyles instanceof CSSStyleDeclaration) {
    for (const textProperty of textAttributes) {
      const _zValue = pStyles.getPropertyValue(textProperty);
      if (_zValue) {
        _textEl.setAttribute(textProperty, _zValue);
      }
    }
    _textEl.setAttribute('fill', pStyles.color);
  } else if (pStyles) {
    for (const textProperty of textAttributes) {
      const value = pStyles[camelCase(textProperty)] || '';
      value && _textEl.setAttribute(textProperty, value);
    }
    _textEl.setAttribute('fill', pStyles['color']);
  }
  _textEl.setAttribute('dominant-baseline', pBehavior.dominantBaseline.toString());
  _textEl.setAttribute('text-anchor', pBehavior.textAnchor.toString());
  if (pWhiteSpace === 'preserve') {
    _textEl.setAttributeNS(XML_NAMESPACE, "xml:space", "preserve");
  }
  return _textEl;
}

export function drawImage(pzImageHref: string, pnX: number, pnY: number, pnWidth: number, pnHeight: number, pzClipPath?: string): SVGElement {
  var _img = document.createElementNS(SVG_NAMESPACE, 'image') as SVGElement;
  _img.setAttributeNS(X_LINK_NAMESPACE, 'href', pzImageHref);
  _img.setAttribute('x', pnX.toFixed(1));
  _img.setAttribute('y', pnY.toFixed(1));
  _img.setAttribute('width', pnWidth.toFixed(1));
  _img.setAttribute('height', pnHeight.toFixed(1));
  if (pzClipPath) {
    _img.setAttribute('clip-path', 'url(#' + pzClipPath + ')');
  }
  return _img;
}
export function declareNamespaceSvg(pSvg: SVGElement): SVGElement {
  pSvg.setAttribute('xmlns', SVG_NAMESPACE);
  pSvg.setAttribute('xmlns:xlink', X_LINK_NAMESPACE);
  return pSvg;
}
export function getBgRectFromStylesSetup(pStyles: Record<string, string> | CSSStyleDeclaration): string {
  let _zBg = 'none';
  if (pStyles instanceof CSSStyleDeclaration) {
    _zBg = pStyles.getPropertyValue('background-color');
  } else {
    _zBg = pStyles['backgroundColor'] || 'none';
  }
  return _zBg;
}

export function getBgRectFormStylesSetup(pStyles: Record<string, string> | CSSStyleDeclaration): Record<string, string> {
  let _borders = { borderRightColor: 'none', borderRightWidth: 'none', borderBottomColor: 'none', borderBottomWidth: 'none' };
  if (pStyles instanceof CSSStyleDeclaration) {
    _borders.borderRightColor = pStyles.getPropertyValue('borderRightColor');
    _borders.borderRightWidth = pStyles.getPropertyValue('borderRightWidth');
    _borders.borderBottomColor = pStyles.getPropertyValue('borderBottomColor');
    _borders;
  } else {
    _borders.borderRightColor = pStyles['borderRightColor'] || 'none';
    _borders.borderRightWidth = pStyles['borderRightWidth'] || 'none';
    _borders.borderBottomColor = pStyles['borderBottomColor'] || 'none';
  }
  return _borders;
}

export function getAcceptStylesBorderSvg(pStyles: CSSStyleDeclaration | Record<string, string>): Record<string, string> {
  const borders: Record<string, string> = {};
  for (const borderProperty of borderAttributes) {
    let _zValue = '';
    if (pStyles instanceof CSSStyleDeclaration) {
      _zValue = pStyles.getPropertyValue(borderProperty);
    } else {
      _zValue = pStyles[camelCase(borderProperty)] || '';
    }
    if (_zValue) {
      borders[camelCase(borderProperty)] = _zValue;
    }
  }
  return borders;
}

export function getAcceptStylesTextSvg(pStyles: CSSStyleDeclaration | Record<string, string>): Record<string, string> {
  const stylesText: Record<string, string> = {};
  for (const textProperty of textAttributes) {
    let _zValue = '';
    if (pStyles instanceof CSSStyleDeclaration) {
      _zValue = pStyles.getPropertyValue(textProperty);
    } else {
      _zValue = pStyles[camelCase(textProperty)] || '';
    }
    if (_zValue) {
      stylesText[camelCase(textProperty)] = _zValue;
    }
  }
  return stylesText;
}
