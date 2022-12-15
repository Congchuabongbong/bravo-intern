import { FlexGrid } from '@grapecity/wijmo.grid';
import {
    Point
} from '@grapecity/wijmo';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { BehaviorText, TextAlign, textAttributes } from './core/text';
import { isFloatRight, isFloatLeft, isTransparent, hasBorderBottom, hasBorderTop, hasBorderRight, hasBorderLeft, isInline, isInFlow, isFlexDirectionRow } from './core/css';
import { Font } from './bravo-graphics/font';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { BravoSvgEngine } from './bravo.svg.engine';
import { creatorSVG, drawImage, drawText, ISize } from './core/svg.engine.util';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { isTextNode, isElement } from './core/dom';

interface IFlexGridSvgEngine {

}
export default class FlexGridSvgEngine extends BravoSvgEngine {
    //*Declaration here...
    //? anchor element
    public anchorElement!: Element;
    //? captureElement
    public captureElement!: Element;
    public captureElementCoordinates!: Point;
    private static reSizeViewPortSubject: BehaviorSubject<ISize> = new BehaviorSubject<ISize>({ width: 0, height: 0 });
    public reSizeViewPortAction$: Observable<ISize> = FlexGridSvgEngine.reSizeViewPortSubject.asObservable();
    private reSizeViewPortSubscription: Subscription = new Subscription();
    //*constructor
    constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
        super(_anchorElement);
        //Todo: lazy initialize
        // anchorElement
        this.anchorElement = _anchorElement;
        //capture
        this.captureElement = _flex.hostElement;
        const { x: xCaptureElement, y: yCaptureElement } = this.captureElement.getBoundingClientRect();
        this.captureElementCoordinates = new Point(xCaptureElement, yCaptureElement);
        this.reSizeViewPortSubscription = this.reSizeViewPortAction$.subscribe((size: ISize) => {
            this.setViewportSize(size.width, size.height);
        });
    }

    override endRender(): void {
        super.endRender();
        //-> unsubscribe observable when endRender completes
        this.reSizeViewPortSubscription.unsubscribe();
    }

    public static onResizeViewPortAction(size: ISize) {
        FlexGridSvgEngine.reSizeViewPortSubject.next(size);
    }

    public static setAttributeFromCssForSvgEl(pElement: SVGElement, styles: CSSStyleDeclaration) {
        styles.backgroundColor && !isTransparent(styles.backgroundColor) && pElement.setAttribute('fill', styles.backgroundColor || 'rgba(0, 0, 0, 0)');
    }

    public _drawBorderCell(cell: Element) {
        const cellBoundingRect = cell.getBoundingClientRect();
        const cellComputedStyle = window.getComputedStyle(cell);
        const { x, y, bottom, right } = this.changeOriginCoordinates(cellBoundingRect);
        if (hasBorderBottom(cellComputedStyle)) {
            const lineSvgEl = this.drawLine(x, bottom, right, bottom);
            lineSvgEl.setAttribute('stroke-width', cellComputedStyle.borderBottomWidth);
            lineSvgEl.setAttribute('stroke', cellComputedStyle.borderBottomColor);
        }
        if (hasBorderTop(cellComputedStyle)) {
            const lineSvgEl = this.drawLine(x, y, right, y);
            lineSvgEl.setAttribute('stroke-width', cellComputedStyle.borderTopWidth);
            lineSvgEl.setAttribute('stroke', cellComputedStyle.borderTopColor);
        }
        if (hasBorderRight(cellComputedStyle)) {
            const lineSvgEl = this.drawLine(right, y, right, bottom);
            lineSvgEl.setAttribute('stroke-width', cellComputedStyle.borderRightWidth);
            lineSvgEl.setAttribute('stroke', cellComputedStyle.borderRightColor);
        }
        if (hasBorderLeft(cellComputedStyle)) {
            const lineSvgEl = this.drawLine(x, y, x, bottom);
            lineSvgEl.setAttribute('stroke-width', cellComputedStyle.borderLeftWidth);
            lineSvgEl.setAttribute('stroke', cellComputedStyle.borderLeftColor);
        }
    }

    public changeOriginCoordinates(elDOMRect: DOMRect): DOMRect {
        elDOMRect.x = elDOMRect.x - this.captureElementCoordinates.x;
        elDOMRect.y = elDOMRect.y - this.captureElementCoordinates.y;
        return elDOMRect;
    }

    private _isTextFitWidthCell(textNode: Text, pBreakWords: boolean = false): boolean {
        try {
            const { width: parentWidth } = textNode.parentElement!.getBoundingClientRect();
            let paddingLeft: number = +window.getComputedStyle(textNode.parentElement as HTMLElement).paddingLeft.replace('px', '');
            let paddingRight: number = +window.getComputedStyle(textNode.parentElement as HTMLElement).paddingRight.replace('px', '');
            //! EDIT ME
            //Todo: Check if node have next sibling and previous sibling width
            const { leftTotalSiblingWidth, rightTotalSiblingWidth } = this._getTotalWidthSiblingTextNode(textNode);
            const dimensionOfText = this._measureTextNode(textNode, pBreakWords);
            if (dimensionOfText) {
                return dimensionOfText.width <= (parentWidth - leftTotalSiblingWidth - rightTotalSiblingWidth - paddingLeft - paddingRight);
            }
            return false;
        } catch (error) {
            new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
            return false;
        }
    }

    private _measureTextNode(textNode: Text, pBreakWords: boolean = false): BravoTextMetrics | undefined {
        const parentNode = textNode.parentElement;
        const computedStyleParent = window.getComputedStyle(parentNode as HTMLElement);
        let font = new Font(computedStyleParent.fontFamily.toString(), computedStyleParent.fontSize, computedStyleParent.fontWeight);
        const { width: parentWidth } = parentNode!.getBoundingClientRect();
        const dimensionOfText = BravoGraphicsRenderer.measureString(textNode.textContent as string, font, parentWidth, pBreakWords);
        return dimensionOfText;
    }

    private _getTotalWidthSiblingTextNode(textNode: Text) {
        let rightTotalSiblingWidth = 0;
        let leftTotalSiblingWidth = 0;
        const { leftSideCurrentNode, rightSideCurrentNode } = this.scanSiblingsNode(textNode);
        if (leftSideCurrentNode.length === 0 && rightSideCurrentNode.length === 0) return { rightTotalSiblingWidth, leftTotalSiblingWidth };
        const parentNode = textNode.parentNode;
        // if (parentNode?.firstChild !== textNode) {
        //     leftTotalSiblingWidth = +getComputedStyle(parentNode as Element).paddingLeft.replace('px', '');
        //     rightTotalSiblingWidth = +getComputedStyle(parentNode as Element).paddingRight.replace('px', '');
        // }
        leftSideCurrentNode.forEach(node => {
            if (isTextNode(node)) {
                const dimensionOfText = this._measureTextNode(node, true);
                if (dimensionOfText) {
                    leftTotalSiblingWidth += dimensionOfText.width;
                }
                return;
            }
            if (isElement(node)) {
                leftTotalSiblingWidth += (node as HTMLElement).offsetWidth;
                return;
            }
        });

        rightSideCurrentNode.forEach(node => {
            if (isTextNode(node)) {
                const dimensionOfText = this._measureTextNode(node, true);
                if (dimensionOfText) {
                    rightTotalSiblingWidth += dimensionOfText.width;
                }
            }
            if (isElement(node)) {
                rightTotalSiblingWidth += (node as HTMLElement).offsetWidth;
            }
        });

        return {
            leftTotalSiblingWidth,
            rightTotalSiblingWidth
        };
    }

    //*scan cell
    private _scanCell(cell: Element) { };

    //*Draw action here...
    private _drawRectCellPanel() {

    }
    public drawTextInCell(textNode: Text, parentNode: Element): SVGElement | null {
        try {
            const behaviorText = this._calculateBehaviorTextNode(textNode) as BehaviorText;
            let computedStyleParent = window.getComputedStyle(parentNode);
            if (!behaviorText.isTextFitWidthCell && behaviorText.textAnchor === 'start') {
                const svgWrap = this._wrapTextIntoSvg(textNode, parentNode, behaviorText, computedStyleParent);
                return svgWrap;
            }
            const textSvgEl = drawText(textNode.textContent as string, behaviorText as BehaviorText, computedStyleParent);
            this.element.appendChild(textSvgEl);
            return textSvgEl;
        } catch (error) {
            new Error('Occurs when draw text in cell!!');
            return null;
        }
    }

    public drawImageInCell(imageNode: HTMLImageElement, parentNode: Element): SVGElement {
        const imageBoundingRect = imageNode.getBoundingClientRect();
        let { x: xImage, y: yImage, width: widthImage, height: heightImage } = this.changeOriginCoordinates(imageBoundingRect);
        let { width: widthParent, height: heightParent } = parentNode.getBoundingClientRect();
        if ((heightParent < heightImage) || (widthParent < widthImage)) {
            const svgWrap = this._wrapImageIntoSvg(imageNode, parentNode);
            return svgWrap;
        }
        const imageSvgEl = this.drawImage(imageNode.src, xImage, yImage, widthImage, heightImage);
        return imageSvgEl;
    }

    private _drawInputInCell() { }

    private _wrapTextIntoSvg(textNode: Text, parentNode: Element, behaviorText: BehaviorText, parentStyle: CSSStyleDeclaration): SVGElement {
        const textSvgEl = drawText(textNode.textContent as string, behaviorText as BehaviorText, parentStyle);
        const rectSvg: Partial<DOMRect> = {};
        const { leftTotalSiblingWidth, rightTotalSiblingWidth } = this._getTotalWidthSiblingTextNode(textNode);
        const paddingLeft = +parentStyle.paddingLeft.replace('px', '');
        const paddingRight = +parentStyle.paddingRight.replace('px', '');
        rectSvg.width = (parentNode as HTMLElement).offsetWidth - leftTotalSiblingWidth - rightTotalSiblingWidth - paddingLeft - paddingRight;
        rectSvg.x = behaviorText.point.x;
        rectSvg.y = behaviorText.point.y * 2;
        rectSvg.height = (parentNode as HTMLElement).clientHeight;
        const svgWrapText = creatorSVG(rectSvg);
        textSvgEl.setAttribute('x', '0');
        textSvgEl.setAttribute('y', '0');
        svgWrapText.appendChild(textSvgEl);
        this.element.appendChild(svgWrapText);
        return svgWrapText;
    }

    private _wrapImageIntoSvg(imageEl: HTMLImageElement, parentEl: Element): SVGElement {
        const rectSvgEl: Partial<DOMRect> = {};
        const parentBoundingRect = parentEl.getBoundingClientRect();
        let { x: xParent, y: yParent, width: parentWidth, height: parentHeight } = this.changeOriginCoordinates(parentBoundingRect);
        rectSvgEl.width = parentWidth;
        rectSvgEl.height = parentHeight;
        rectSvgEl.x = xParent;
        rectSvgEl.y = yParent;
        const svgWrapImage = creatorSVG(rectSvgEl);
        const imageSvgEl = drawImage(imageEl.src, 0, 0, imageEl.width, imageEl.height);
        svgWrapImage.appendChild(imageSvgEl);
        this.element.appendChild(svgWrapImage);
        return svgWrapImage;
    }
    //* Calculate Behavior Of TextNode Here
    private _calculateBehaviorTextNode(textNode: Text): BehaviorText | null {
        // if (textNode.nodeValue === ' (15 items)') {
        //     debugger;
        // }
        try {
            const parentEl = textNode.parentElement;
            const parentBoundingRect = parentEl!.getBoundingClientRect();
            const parentComputedStyle = window.getComputedStyle(parentEl as HTMLElement);
            const alginText = parentComputedStyle.textAlign;
            const { leftTotalSiblingWidth, rightTotalSiblingWidth } = this._getTotalWidthSiblingTextNode(textNode); //! false
            const { width: parentWidth, x: xParent, y: yParent } = this.changeOriginCoordinates(parentBoundingRect);
            let paddingLeft: number = +parentComputedStyle.paddingLeft.replace('px', '');//! check case inline
            let paddingTop: number = +parentComputedStyle.paddingTop.replace('px', '');
            let paddingRight: number = +parentComputedStyle.paddingRight.replace('px', '');
            let xTextDefault: number = xParent + paddingLeft;
            let yTextDefault: number = (yParent + paddingTop) / 2;
            //default behavior text
            let behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextDefault, yTextDefault), textAnchor: 'start' };
            switch (alginText) {
                case TextAlign.Left:
                case TextAlign.Start:
                    behaviorTextBase.point!.x += leftTotalSiblingWidth;
                    behaviorTextBase.textAnchor = 'start';
                    behaviorTextBase.isTextFitWidthCell = this._isTextFitWidthCell(textNode);
                    return (behaviorTextBase as BehaviorText);
                case TextAlign.Center:
                    if (this._isTextFitWidthCell(textNode)) {
                        behaviorTextBase.point!.x += (parentWidth / 2) - leftTotalSiblingWidth - rightTotalSiblingWidth;
                        if (leftTotalSiblingWidth && rightTotalSiblingWidth) behaviorTextBase.point!.x - paddingLeft;
                        behaviorTextBase.textAnchor = 'middle';
                        behaviorTextBase.isTextFitWidthCell = true;
                        return (behaviorTextBase as BehaviorText);
                    }
                    behaviorTextBase.isTextFitWidthCell = false;
                    return (behaviorTextBase as BehaviorText);
                case TextAlign.Right:
                case TextAlign.End:
                    if (this._isTextFitWidthCell(textNode)) {
                        behaviorTextBase.point!.x += (parentWidth - paddingRight - paddingLeft) - rightTotalSiblingWidth;
                        behaviorTextBase.textAnchor = 'end';
                        behaviorTextBase.isTextFitWidthCell = true;
                        return (behaviorTextBase as BehaviorText);
                    }
                    behaviorTextBase.isTextFitWidthCell = false;
                    return (behaviorTextBase as BehaviorText);
                default: //? default text alignment left and dominant baseline 'hanging', textAnchor: 'start
                    behaviorTextBase.isTextFitWidthCell = true;
                    return (behaviorTextBase as BehaviorText);
            }
        } catch (error) {
            console.log('Occurs when trying to calculate position text node!');
            return null;
        }
    };
}
