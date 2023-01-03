// Namespaces
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const X_LINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
export const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
// DOM
export const isElement = (pNode: Node): pNode is Element => pNode.nodeType === pNode.ELEMENT_NODE;
export const isTextNode = (pNode: Node): pNode is Text => pNode.nodeType === pNode.TEXT_NODE;
export const isCommentNode = (pNode: Node): pNode is Comment => pNode.nodeType === pNode.COMMENT_NODE;
// HTML
export const isHTMLElement = (pElement: Element): pElement is HTMLElement => pElement.namespaceURI === XHTML_NAMESPACE;
export const isHTMLAnchorElement = (pElement: Element): pElement is HTMLAnchorElement =>
  pElement.tagName === 'A' && isHTMLElement(pElement);
export const isHTMLLabelElement = (pElement: Element): pElement is HTMLLabelElement =>
  pElement.tagName === 'LABEL' && isHTMLElement(pElement);
export const isHTMLImageElement = (pElement: Element): pElement is HTMLImageElement =>
  pElement.tagName === 'IMG' && isHTMLElement(pElement);
export const isHTMLInputElement = (pElement: Element): pElement is HTMLInputElement =>
  pElement.tagName === 'INPUT' && isHTMLElement(pElement);
export const hasLabels = (pElement: HTMLElement): pElement is HTMLElement & Pick<HTMLInputElement, 'labels'> =>
  'labels' in pElement;
// SVG
export const isSVGElement = (pElement: Element): pElement is SVGElement => pElement.namespaceURI === SVG_NAMESPACE;
export const isSVGSVGElement = (pElement: Element): pElement is SVGSVGElement =>
  isSVGElement(pElement) && pElement.tagName === 'svg';
export const isSVGGraphicsElement = (pElement: Element): pElement is SVGGraphicsElement =>
  isSVGElement(pElement) && 'getCTM' in pElement && 'getScreenCTM' in pElement;
export const isSVGGroupElement = (pElement: Element): pElement is SVGGElement =>
  isSVGElement(pElement) && pElement.tagName === 'g';
export const isSVGAnchorElement = (pElement: Element): pElement is SVGAElement =>
  isSVGElement(pElement) && pElement.tagName === 'a';
export const isSVGTextContentElement = (pElement: Element): pElement is SVGTextContentElement =>
  isSVGElement(pElement) && 'textLength' in pElement;
export const isSVGImageElement = (pElement: Element): pElement is SVGImageElement =>
  pElement.tagName === 'image' && isSVGElement(pElement);
export const isSVGStyleElement = (pElement: Element): pElement is SVGStyleElement =>
  pElement.tagName === 'style' && isSVGElement(pElement);
