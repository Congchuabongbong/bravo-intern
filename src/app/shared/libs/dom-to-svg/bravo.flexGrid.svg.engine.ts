import { FlexGrid } from '@grapecity/wijmo.grid';
import {
    Point
} from '@grapecity/wijmo';
import { Subscription, BehaviorSubject } from 'rxjs';
import { BehaviorText, TextAlign, textAttributes } from './core/text';
import { hasUniformBorder, isFloatRight, isFloatLeft, isTransparent } from './core/css';
import { Font } from './bravo-graphics/font';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';

import { BravoSvgEngine } from './bravo.svg.engine';
import { creatorSVG, drawImage, drawText } from './core/svg.engine.util';



interface IFlexGridSvgEngine {

}
export default class FlexGridSvgEngine extends BravoSvgEngine {
    //*Declaration here...
    //? anchor element
    public anchorElement!: Element;
    //? captureElement
    public captureElement!: Element;
    public captureElementCoordinates!: Point;
    private static reSizeViewPortSubject = new BehaviorSubject<{ width: number, height: number; }>({ width: 0, height: 0 });
    private reSizeViewPortAction$ = FlexGridSvgEngine.reSizeViewPortSubject.asObservable();
    private reSizeViewPortSubscription: Subscription = new Subscription();
    //*constructor
    constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
        super(_anchorElement);
        //Todo: lazy initialize
        this.anchorElement = _anchorElement; // anchorElement
        //capture
        this.captureElement = _flex.hostElement;
        this.captureElementCoordinates = new Point(this.captureElement.getBoundingClientRect().x, this.captureElement.getBoundingClientRect().y);
        this.reSizeViewPortSubscription = this.reSizeViewPortAction$.subscribe(((size: { width: number, height: number; }) => {
            this.setViewportSize(size.width, size.height);
        }));
    }

    override endRender(): void {
        super.endRender();
        this.reSizeViewPortSubscription.unsubscribe(); //-> unsubscribe observable when endRender completes
    }

    public static onResizeViewPortAction(size: { width: number, height: number; }) {
        FlexGridSvgEngine.reSizeViewPortSubject.next(size);
    }

    /**
     * @deprecated
     *(thay thế) Sử dụng line để vẽ border
    */
    public static setAttributeFromCssForSvgEl(pElement: SVGElement, styles: CSSStyleDeclaration) {
        styles.backgroundColor && !isTransparent(styles.backgroundColor) && pElement.setAttribute('fill', styles.backgroundColor || 'rgba(0, 0, 0, 0)');
        !hasUniformBorder(styles) && pElement.setAttribute('stroke', styles.borderTopColor || styles.borderBottomColor || styles.borderLeftColor || styles.borderRightColor || 'rgb(0,0,0)');
        let strokeWidth = +styles.borderTopWidth.replace('px', '') || +styles.borderBottomWidth.replace('px', '') || +styles.borderLeftWidth.replace('px', '') || +styles.borderRightWidth.replace('px', '');
        strokeWidth ? pElement.setAttribute('stroke-width', `${strokeWidth}px`) : pElement.setAttribute('stroke-width', '1px');
    }

    public static applyTextStyles(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
        for (const textProperty of textAttributes) {
            const value = styles.getPropertyValue(textProperty);
            if (value) {
                svgElement.setAttribute(textProperty, value);
            }
        }
        svgElement.setAttribute('fill', styles.color);
    }

    private _isTextFitWidthCell(textNode: Text, pBreakWords: boolean = false): boolean {
        try {
            const { width: parentWidth } = textNode.parentElement!.getBoundingClientRect();
            let paddingLeft: number = +getComputedStyle(textNode.parentElement as HTMLElement).paddingLeft.replace('px', '');
            let paddingRight: number = +getComputedStyle(textNode.parentElement as HTMLElement).paddingRight.replace('px', '');
            //Todo: Check if node have next sibling and previous sibling width
            let nextSiblingWidth = textNode.nextElementSibling ? (textNode.nextElementSibling as HTMLElement).offsetWidth : 0; //?
            let previousWidth = textNode.previousElementSibling ? (textNode.previousElementSibling as HTMLElement).offsetWidth : 0; //?
            const dimensionOfText = this._measureTextNode(textNode, pBreakWords);
            if (dimensionOfText) {
                return Math.floor(dimensionOfText.width) <= (parentWidth - nextSiblingWidth - previousWidth - paddingLeft - paddingRight);
            }
            return false;
        } catch (error) {
            new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
            return false;
        }
    }

    private _measureTextNode(textNode: Text, pBreakWords: boolean = false) {
        const parentNode = textNode.parentElement;
        const computedStyleParent = window.getComputedStyle(parentNode as HTMLElement);
        let font = new Font(computedStyleParent.fontFamily.toString(), computedStyleParent.fontSize, computedStyleParent.fontWeight);
        const { width: parentWidth } = parentNode!.getBoundingClientRect();
        const dimensionOfText = BravoGraphicsRenderer.measureString(textNode.textContent as string, font, parentWidth, pBreakWords);
        return dimensionOfText;
    }


    public getSizeSiblingTextNode(textNode: Text) {
        let nextSiblingWidth = textNode.nextElementSibling ? (textNode.nextElementSibling as HTMLElement).offsetWidth : 0; //?
        let previousWidth = textNode.previousElementSibling ? (textNode.previousElementSibling as HTMLElement).offsetWidth : 0; //?
        return {
            nextSiblingWidth,
            previousWidth
        };
    }

    //*scan cell
    private _scanCell(cell: Element) { };



    //*Draw action here...
    private _drawRectCellPanel() {

    }
    public drawTextInCell(textNode: Text, parentNode: Element) {
        try {
            const behaviorText = this._calculateBehaviorTextNode(textNode);
            let computedStyleParent = window.getComputedStyle(parentNode);
            if (!behaviorText?.isTextFitWidthCell && behaviorText?.textAnchor === 'start') {
                this._wrapTextIntoSvg(textNode, parentNode, behaviorText, computedStyleParent);
                return;
            }
            const textSvgDemo = drawText(textNode.textContent as string, behaviorText as BehaviorText, computedStyleParent);
            this.element.appendChild(textSvgDemo);
        } catch (error) {
            new Error('Occurs when draw text in cell!!');
        }
    }


    public drawImageInCell(imageNode: HTMLImageElement, parentNode: Element) {
        let imageEl = imageNode;
        let src = imageEl.src;
        let { x: xImage, y: yImage, width: widthImage, height: heightImage } = imageEl.getBoundingClientRect();
        let { width: widthParent, height: heightParent } = parentNode.getBoundingClientRect();
        if (heightParent < heightImage || widthParent < widthImage) {
            this._wrapImageIntoSvg(imageEl, parentNode);
            return;
        }
        this.drawImage(src, xImage - this.captureElementCoordinates.x, yImage - this.captureElementCoordinates.y, widthImage, heightImage);
    }


    private _drawInputInCell() { }

    private _wrapTextIntoSvg(textNode: Text, parentNode: Element, behaviorText: BehaviorText, parentStyle: CSSStyleDeclaration): void {
        const textSvgEl = drawText(textNode.textContent as string, behaviorText as BehaviorText, parentStyle);
        const rectSvg: Partial<DOMRect> = {};
        const { nextSiblingWidth, previousWidth } = this.getSizeSiblingTextNode(textNode);
        const paddingLeft = +parentStyle.paddingLeft.replace('px', '');
        const paddingRight = +parentStyle.paddingRight.replace('px', '');
        rectSvg.width = (parentNode as HTMLElement).offsetWidth - nextSiblingWidth - previousWidth - paddingLeft - paddingRight;
        rectSvg.x = behaviorText.point.x;
        rectSvg.y = behaviorText.point.y * 2;
        rectSvg.height = (parentNode as HTMLElement).clientHeight;
        const svgWrapText = creatorSVG(rectSvg);
        textSvgEl.setAttribute('x', '0');
        textSvgEl.setAttribute('y', '0');
        svgWrapText.appendChild(textSvgEl);
        this.element.appendChild(svgWrapText);
        return;
    }

    private _wrapImageIntoSvg(imageEl: HTMLImageElement, parentEl: Element) {
        const rectSvg: Partial<DOMRect> = {};
        let { x: xParent, y: yParent, width: parentWidth, height: parentHeight } = parentEl.getBoundingClientRect();
        rectSvg.width = parentWidth;
        rectSvg.height = parentHeight;
        rectSvg.x = xParent - this.captureElementCoordinates.x;
        rectSvg.y = yParent - this.captureElementCoordinates.y;
        const svgWrapImage = creatorSVG(rectSvg);
        const imageSvg = drawImage(imageEl.src, 0, 0, imageEl.width, imageEl.height);
        svgWrapImage.appendChild(imageSvg);
        this.element.appendChild(svgWrapImage);
    }


    //* Calculate Behavior Of TextNode Here
    /*
    - Optimize and clean code
    */
    private _calculateBehaviorTextNode(node: Text): BehaviorText | null {
        try {
            const parentEl = node.parentElement;
            const parentComputedStyle = window.getComputedStyle(parentEl as HTMLElement);
            const alginText = parentComputedStyle.textAlign;
            const { width: parentWidth, x: xParent, y: yParent } = parentEl!.getBoundingClientRect();
            let paddingLeft: number = +parentComputedStyle.paddingLeft.replace('px', '');
            let paddingTop: number = +parentComputedStyle.paddingLeft.replace('px', '');
            let paddingRight: number = +parentComputedStyle.paddingRight.replace('px', '');
            let xTextBase: number = xParent - this.captureElementCoordinates.x;
            let yTextBase: number = (yParent - this.captureElementCoordinates.y + paddingTop) / 2; //
            //default behavior text
            let behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextBase, yTextBase), textAnchor: 'start' };
            switch (alginText) {
                case TextAlign.Left:
                case TextAlign.Start:
                    behaviorTextBase.point!.x += paddingLeft;
                    if (node.previousElementSibling && !isFloatRight(getComputedStyle(node.previousElementSibling))) {
                        behaviorTextBase.point!.x += (node.previousElementSibling as HTMLElement).offsetWidth;
                    }
                    if (node.nextElementSibling && isFloatLeft(getComputedStyle(node.nextElementSibling))) {
                        behaviorTextBase.point!.x += (node.nextElementSibling as HTMLElement).offsetWidth;
                    }
                    behaviorTextBase.textAnchor = 'start';
                    behaviorTextBase.isTextFitWidthCell = this._isTextFitWidthCell(node);
                    return (behaviorTextBase as BehaviorText);
                case TextAlign.Center:
                    if (this._isTextFitWidthCell(node)) {
                        const { nextSiblingWidth, previousWidth } = this.getSizeSiblingTextNode(node);
                        behaviorTextBase.point!.x += (parentWidth - nextSiblingWidth - previousWidth) / 2;
                        behaviorTextBase.textAnchor = 'middle';
                        behaviorTextBase.isTextFitWidthCell = true;
                        return (behaviorTextBase as BehaviorText);
                    }
                    behaviorTextBase.point!.x += paddingLeft;
                    behaviorTextBase.isTextFitWidthCell = false;
                    return (behaviorTextBase as BehaviorText);
                case TextAlign.Right:
                case TextAlign.End:
                    if (this._isTextFitWidthCell(node)) {
                        behaviorTextBase.point!.x += (parentWidth - paddingRight);
                        if (node.previousElementSibling && isFloatRight(getComputedStyle(node.previousElementSibling))) {
                            behaviorTextBase.point!.x -= (node.previousElementSibling as HTMLElement).offsetWidth;
                        }
                        if (node.nextElementSibling && isFloatRight(getComputedStyle(node.nextElementSibling))) {
                            behaviorTextBase.point!.x -= (node.nextElementSibling as HTMLElement).offsetWidth;
                        }
                        behaviorTextBase.textAnchor = 'end';
                        behaviorTextBase.isTextFitWidthCell = true;
                        return (behaviorTextBase as BehaviorText);
                    }
                    behaviorTextBase.point!.x += paddingLeft;
                    behaviorTextBase.isTextFitWidthCell = false;
                    return (behaviorTextBase as BehaviorText);
                default: //? default text alignment left and dominant baseline 'hanging', textAnchor: 'start
                    behaviorTextBase.point!.x += paddingLeft;
                    behaviorTextBase.isTextFitWidthCell = true;
                    return (behaviorTextBase as BehaviorText);
            }
        } catch (error) {
            console.log('Occurs when trying to calculate position text node!');
            return null;
        }
    };
}
