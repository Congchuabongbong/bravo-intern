import { Point, Size, Rect } from '@grapecity/wijmo';
import { svgNamespace, xLinkNamespace } from './dom';
import { BehaviorText, copyTextStyles } from './text';
export function setViewportSizeSVG(svg: SVGElement, size: Size) {
    svg.setAttribute('width', size.width.toString());
    svg.setAttribute('height', size.height.toString());
}
export function drawRect(x: number, y: number, w: number, h: number, className?: string, style?: CSSStyleDeclaration, clipPath?: string) {
    var rect = document.createElementNS(svgNamespace, 'rect') as SVGElement;
    rect.setAttribute('x', x.toFixed(1));
    rect.setAttribute('y', y.toFixed(1));
    (w > 0 && w < 0.05) ? rect.setAttribute('width', '0.1') : rect.setAttribute('width', w.toFixed(1));
    (h > 0 && h < 0.05) ? rect.setAttribute('height', '0.1') : rect.setAttribute('height', h.toFixed(1));
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
export function creatorSVG(rect?: Partial<DOMRect>) {
    const svg = document.createElementNS(svgNamespace, 'svg') as SVGElement;

    if (rect) {
        rect.width && rect.height && setViewportSize(svg, rect.width, rect.height);
        rect.x && svg.setAttribute('x', rect.x.toString());
        rect.y && svg.setAttribute('y', rect.y.toString());
    }
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


function drawText(textContent: string, behavior: BehaviorText, style?: CSSStyleDeclaration): SVGElement {
    const textEl = document.createElementNS(svgNamespace, 'text') as SVGElement;
    textEl.textContent = textContent;
    textEl.setAttribute('x', behavior.point.x.toFixed(1));
    textEl.setAttribute('y', behavior.point.y.toFixed(1));
    textEl.setAttribute('dominant-baseline', behavior.dominantBaseline.toString());
    textEl.setAttribute('text-anchor', behavior.textAnchor.toString());
    style && copyTextStyles(textEl, style);
    return textEl;
}

function drawImage(imageHref: string, x: number, y: number, w: number, h: number): SVGElement {
    var img = document.createElementNS(svgNamespace, 'image') as SVGElement;
    img.setAttributeNS(xLinkNamespace, 'href', imageHref);
    img.setAttribute('x', x.toFixed(1));
    img.setAttribute('y', y.toFixed(1));
    img.setAttribute('width', w.toFixed(1));
    img.setAttribute('height', h.toFixed(1));
    return img;
}
