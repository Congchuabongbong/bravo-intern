
import { SVG_NAMESPACE, XML_NAMESPACE, X_LINK_NAMESPACE } from './dom.util';
import { BehaviorText, borderAttributes, ISize, textAttributes } from './type.util';

export const setViewportSizeSVG = (pSvg: SVGElement, pSize: ISize): void => {
  pSvg.setAttribute('width', pSize.width.toString());
  pSvg.setAttribute('height', pSize.height.toString());
};

export const drawRect = (
  pnX: number,
  pnY: number,
  pSize: ISize,
  pzClassName?: string,
  pStyle?: CSSStyleDeclaration,
  pzClipPath?: string
): SVGElement => {
  var _rect = document.createElementNS(SVG_NAMESPACE, 'rect') as SVGElement;
  _rect.setAttribute('x', pnX.toFixed(1));
  _rect.setAttribute('y', pnY.toFixed(1));
  (pSize.width > 0 && pSize.width < 0.05) ? _rect.setAttribute('width', '0.1') : _rect.setAttribute('width', pSize.width.toFixed(1));
  (pSize.height > 0 && pSize.height < 0.05) ? _rect.setAttribute('height', '0.1') : _rect.setAttribute('height', pSize.height.toFixed(1));
  pzClipPath && _rect.setAttribute('clip-path', 'url(#' + pzClipPath + ')');
  pzClassName && _rect.setAttribute('class', pzClassName);
  pStyle && applyStyle(_rect, pStyle);
  return _rect;
};

export const applyStyle = (pEl: SVGElement, pStyle: CSSStyleDeclaration): void => {
  for (var _zKey in pStyle) {
    pEl.setAttribute(deCase(_zKey), pStyle[_zKey]);
  }
};

export const creatorSVG = (pRect?: Partial<DOMRect>, pbIsDeclareNamespaceSvg?: boolean): SVGElement => {
  const _svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGElement;
  if (pRect) {
    pRect.width && pRect.height && setViewportSize(_svg, pRect.width, pRect.height);
    pRect.x && _svg.setAttribute('x', pRect.x.toFixed(1));
    pRect.y && _svg.setAttribute('y', pRect.y.toFixed(1));
  }
  pbIsDeclareNamespaceSvg && declareNamespaceSvg(_svg);
  return _svg;
};

export const setAttrSvgIcon = (
  pSvg: SVGElement,
  pnX: number,
  pnY: number,
  pnWidth: number,
  pnHeight: number
): void => {
  pSvg.setAttribute('width', pnWidth.toString());
  pSvg.setAttribute('height', pnHeight.toString());
  pSvg.setAttribute('x', pnX.toString());
  pSvg.setAttribute('y', pnY.toString());
};

export const setViewportSize = (
  pSvg: SVGElement,
  pnWidth: number,
  pnHeight: number
): void => {
  pSvg.setAttribute('width', pnWidth.toString());
  pSvg.setAttribute('height', pnHeight.toString());
};
export const appendMultipleChildren = (pSvg: SVGElement, pChildren: SVGAElement[]): void => pSvg.append(...pChildren);

export const deCase = (pzName: string): string => pzName.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase(); });

export const camelCase = (pzName: string): string => pzName.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

export const drawText = (
  pzTextContent: string,
  pBehavior: BehaviorText,
  pStyles?: CSSStyleDeclaration | Record<string, string>,
  pWhiteSpace: 'default' | 'preserve' = 'default'
): SVGElement => {
  const _textEl = document.createElementNS(SVG_NAMESPACE, 'text') as SVGElement;
  _textEl.textContent = pzTextContent;
  pBehavior.point.x && _textEl.setAttribute('x', pBehavior.point.x.toString());
  pBehavior.point.y && _textEl.setAttribute('y', (pBehavior.point.y).toString());
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
      const _zValue = pStyles[camelCase(textProperty)] || '';
      _zValue && _textEl.setAttribute(textProperty, _zValue);
    }
    _textEl.setAttribute('fill', pStyles['color']);
  }
  pBehavior.dominantBaseline && _textEl.setAttribute('dominant-baseline', pBehavior.dominantBaseline);
  pBehavior.textAnchor && _textEl.setAttribute('text-anchor', pBehavior.textAnchor);
  if (pWhiteSpace === 'preserve') {
    _textEl.setAttributeNS(XML_NAMESPACE, "xml:space", "preserve");
  }
  return _textEl;
};

export const drawImage = (
  pzImageHref: string,
  pnX: number,
  pnY: number,
  pnWidth: number,
  pnHeight: number,
  pzClipPath?: string
): SVGElement => {
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
};

export const declareNamespaceSvg = (pSvg: SVGElement): SVGElement => {
  pSvg.setAttribute('xmlns', SVG_NAMESPACE);
  pSvg.setAttribute('xmlns:xlink', X_LINK_NAMESPACE);
  return pSvg;
};

export const getBgRectFromStylesSetup = (pStyles: Record<string, string> | CSSStyleDeclaration): string => {
  let _zBg = 'none';
  if (pStyles instanceof CSSStyleDeclaration) {
    _zBg = pStyles.getPropertyValue('background-color');
  } else {
    _zBg = pStyles['backgroundColor'] || 'none';
  }
  return _zBg;
};

export const getBgRectFormStylesSetup = (pStyles: Record<string, string> | CSSStyleDeclaration): Record<string, string> => {
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
};

export const getAcceptStylesBorderSvg = (pStyles: CSSStyleDeclaration | Record<string, string>): Record<string, string> => {
  const _borders: Record<string, string> = {};
  for (const borderProperty of borderAttributes) {
    let _zValue = '';
    if (pStyles instanceof CSSStyleDeclaration) {
      _zValue = pStyles.getPropertyValue(borderProperty);
    } else {
      _zValue = pStyles[camelCase(borderProperty)] || '';
    }
    if (_zValue) {
      _borders[camelCase(borderProperty)] = _zValue;
    }
  }
  return _borders;
};

export const getAcceptStylesTextSvg = (pStyles: CSSStyleDeclaration | Record<string, string>): Record<string, string> => {
  const _stylesText: Record<string, string> = {};
  for (const textProperty of textAttributes) {
    let _zValue = '';
    if (pStyles instanceof CSSStyleDeclaration) {
      _zValue = pStyles.getPropertyValue(textProperty);
    } else {
      _zValue = pStyles[camelCase(textProperty)] || '';
    }
    if (_zValue) {
      _stylesText[camelCase(textProperty)] = _zValue;
    }
  }
  return _stylesText;
};
