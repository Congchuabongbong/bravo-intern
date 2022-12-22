// Namespaces
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const X_LINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
export const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
// DOM
export const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
export const isTextNode = (node: Node): node is Text => node.nodeType === Node.TEXT_NODE;
export const isCommentNode = (node: Node): node is Comment => node.nodeType === Node.COMMENT_NODE;
// HTML
export const isHTMLElement = (element: Element): element is HTMLElement => element.namespaceURI === XHTML_NAMESPACE;
export const isHTMLAnchorElement = (element: Element): element is HTMLAnchorElement =>
  element.tagName === 'A' && isHTMLElement(element);
export const isHTMLLabelElement = (element: Element): element is HTMLLabelElement =>
  element.tagName === 'LABEL' && isHTMLElement(element);
export const isHTMLImageElement = (element: Element): element is HTMLImageElement =>
  element.tagName === 'IMG' && isHTMLElement(element);
export const isHTMLInputElement = (element: Element): element is HTMLInputElement =>
  element.tagName === 'INPUT' && isHTMLElement(element);
export const hasLabels = (element: HTMLElement): element is HTMLElement & Pick<HTMLInputElement, 'labels'> =>
  'labels' in element;
// SVG
export const isSVGElement = (element: Element): element is SVGElement => element.namespaceURI === SVG_NAMESPACE;
export const isSVGSVGElement = (element: Element): element is SVGSVGElement =>
  isSVGElement(element) && element.tagName === 'svg';
export const isSVGGraphicsElement = (element: Element): element is SVGGraphicsElement =>
  isSVGElement(element) && 'getCTM' in element && 'getScreenCTM' in element;
export const isSVGGroupElement = (element: Element): element is SVGGElement =>
  isSVGElement(element) && element.tagName === 'g';
export const isSVGAnchorElement = (element: Element): element is SVGAElement =>
  isSVGElement(element) && element.tagName === 'a';
export const isSVGTextContentElement = (element: Element): element is SVGTextContentElement =>
  isSVGElement(element) && 'textLength' in element;
export const isSVGImageElement = (element: Element): element is SVGImageElement =>
  element.tagName === 'image' && isSVGElement(element);
export const isSVGStyleElement = (element: Element): element is SVGStyleElement =>
  element.tagName === 'style' && isSVGElement(element);
