import { FlexGrid, GridPanel } from '@grapecity/wijmo.grid';
import {
  Point
} from '@grapecity/wijmo';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { BehaviorText, TextAlign } from './core/text.type';
import { isTransparent, hasBorderBottom, hasBorderTop, hasBorderRight, hasBorderLeft, isInline } from './core/css.util';
import { Font } from './bravo-graphics/font';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { BravoSvgEngine } from './bravo.svg.engine';
import { creatorSVG, drawImage, drawText, ISize } from './core/svg.engine.util';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { isTextNode, isElement, isHTMLImageElement, isHTMLInputElement } from './core/dom.util';

export interface ISiblings {
  leftSideCurrentNode: ChildNode[], rightSideCurrentNode: ChildNode[];
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
  private _reSizeViewPortSubscription: Subscription = new Subscription();
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
    this._reSizeViewPortSubscription = this.reSizeViewPortAction$.subscribe((size: ISize) => {
      this.setViewportSize(size.width, size.height);
    });
  }

  override endRender(): void {
    super.endRender();
    //-> unsubscribe observable when endRender completes
    this._reSizeViewPortSubscription.unsubscribe();
  }

  public static onResizeViewPortAction(size: ISize) {
    FlexGridSvgEngine.reSizeViewPortSubject.next(size);
  }
  public changeOriginCoordinates(elDOMRect: DOMRect): DOMRect {
    //! Note: mutable object! This is impure function
    elDOMRect.x -= this.captureElementCoordinates.x;
    elDOMRect.y -= this.captureElementCoordinates.y;
    return elDOMRect;
  }
  public static setAttributeFromCssForSvgEl(pElement: SVGElement, styles: CSSStyleDeclaration) {
    styles.backgroundColor && !isTransparent(styles.backgroundColor) && pElement.setAttribute('fill', styles.backgroundColor || 'rgba(0, 0, 0, 0)');
  }
  //*handle and draw cell
  public _drawBorderCell(boundingRect: DOMRect, styles: CSSStyleDeclaration) {
    const { x, y, bottom, right } = boundingRect;
    if (hasBorderBottom(styles)) {
      const lineSvgEl = this.drawLine(x, bottom, right, bottom);
      lineSvgEl.setAttribute('stroke-width', styles.borderBottomWidth);
      lineSvgEl.setAttribute('stroke', styles.borderBottomColor);
    }
    if (hasBorderTop(styles)) {
      const lineSvgEl = this.drawLine(x, y, right, y);
      lineSvgEl.setAttribute('stroke-width', styles.borderTopWidth);
      lineSvgEl.setAttribute('stroke', styles.borderTopColor);
    }
    if (hasBorderRight(styles)) {
      const lineSvgEl = this.drawLine(right, y, right, bottom);
      lineSvgEl.setAttribute('stroke-width', styles.borderRightWidth);
      lineSvgEl.setAttribute('stroke', styles.borderRightColor);
    }
    if (hasBorderLeft(styles)) {
      const lineSvgEl = this.drawLine(x, y, x, bottom);
      lineSvgEl.setAttribute('stroke-width', styles.borderLeftWidth);
      lineSvgEl.setAttribute('stroke', styles.borderLeftColor);
    }
  }


  public drawCellPanel(panel: GridPanel) {
    //!case pin columns not complete
    //!case expand and collapse rows not complete
    const { row: rowStart, row2: rowEnd, col: colStart, col2: colEnd } = panel.viewRange;

    for (let colIndex = colStart; colIndex <= colEnd; colIndex++) {
      for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
        let cellEl = panel.getCellElement(rowIndex, colIndex);
        if (!cellEl || (colIndex > colStart && cellEl.className.includes('wj-group'))) continue;
        let cellBoundingRect = this.changeOriginCoordinates(cellEl.getBoundingClientRect());
        let cellStyles = window.getComputedStyle(cellEl);
        const groupSvgEl = this.startGroup(cellEl.className);
        const svg = this.drawRect(cellBoundingRect.x, cellBoundingRect.y, cellBoundingRect.width, cellBoundingRect.height);
        FlexGridSvgEngine.setAttributeFromCssForSvgEl(svg, cellStyles);
        this._drawBorderCell(cellBoundingRect, cellStyles);
        this._scanCell(cellEl, groupSvgEl);
        this.endGroup();
      }
    }
  }
  //TODO: Not complete!!!
  //scan cell
  private _scanCell(el: Element, group: SVGElement) {
    if (el.hasChildNodes()) {
      el.childNodes.forEach((node: Node) => {
        //?text node;
        if (isTextNode(node)) {
          const svgEl = this.drawTextInCell(node, el);
          svgEl && group.appendChild(svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(node as HTMLElement)) {
          const svgEl = this.drawImageInCell(node as HTMLImageElement, el);
          svgEl && group.appendChild(svgEl as Node);
        }
        //?case input
        if (isHTMLInputElement(node as Element)) { // case input checkbox
          const inputNode = node as HTMLInputElement;
          const inputBoundingRect = inputNode.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(node as Element);
          const { x: xInputNode, y: yInputNode, width: widthInputNode, height: heightInputNode } = this.changeOriginCoordinates(inputBoundingRect);
          const svgInput = this.drawRect(xInputNode, yInputNode, widthInputNode, heightInputNode);
          svgInput.setAttribute('rx', '2');
          svgInput.setAttribute('fill', '#fff');
          svgInput.setAttribute('stroke', '#767676');
          svgInput.setAttribute('stroke-width', '1.2');
          if (inputNode.checked) {
            svgInput.setAttribute('fill', '#1da1f2');
          }
        };
        this._scanCell(node as Element, group);
      });
    }

  }

  private _drawRectCellPanel() {

  }

  //*Handle and draw Text Here:
  //? Calculate Behavior Of TextNode Here
  private _calculateBehaviorTextNode(textNode: Text): BehaviorText | null {
    try {
      const parentEl = textNode.parentElement;
      const parentBoundingRect = parentEl!.getBoundingClientRect();
      const parentComputedStyle = window.getComputedStyle(parentEl as HTMLElement);
      const alginText = parentComputedStyle.textAlign;
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      let deviationHeight = 0;
      if (isInline(parentComputedStyle)) {
        let heightOfText = this._measureTextNode(textNode)?.height || 0;
        deviationHeight = (parentBoundingRect.height - heightOfText) / 2;
      }
      const { width: parentWidth, x: xParent, y: yParent } = this.changeOriginCoordinates(parentBoundingRect);
      let paddingLeft: number = +parentComputedStyle.paddingLeft.replace('px', '');
      let paddingTop: number = +parentComputedStyle.paddingTop.replace('px', '');
      let paddingRight: number = +parentComputedStyle.paddingRight.replace('px', '');
      let xTextDefault: number = xParent + paddingLeft;
      let yTextDefault: number = yParent + paddingTop + deviationHeight;
      //default behavior text
      let behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextDefault, yTextDefault), textAnchor: 'start' };
      switch (alginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          behaviorTextBase.point!.x += leftTotalSiblingsWidth;
          behaviorTextBase.textAnchor = 'start';
          behaviorTextBase.isTextFitWidthCell = this._isTextFitWidthCell(textNode);
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (this._isTextFitWidthCell(textNode)) {
            behaviorTextBase.point!.x += (parentWidth / 2) - leftTotalSiblingsWidth - rightTotalSiblingsWidth;
            if (leftTotalSiblingsWidth && rightTotalSiblingsWidth) behaviorTextBase.point!.x - paddingLeft;
            behaviorTextBase.textAnchor = 'middle';
            behaviorTextBase.isTextFitWidthCell = true;
            return (behaviorTextBase as BehaviorText);
          }
          behaviorTextBase.isTextFitWidthCell = false;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.End:
          if (this._isTextFitWidthCell(textNode)) {
            behaviorTextBase.point!.x += (parentWidth - paddingRight - paddingLeft) - rightTotalSiblingsWidth;
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
      new Error('Occurs when trying to calculate position text node!');
      return null;
    }
  };
  private _isTextFitWidthCell(textNode: Text, pBreakWords: boolean = false): boolean {
    try {
      const { width: parentWidth } = textNode.parentElement!.getBoundingClientRect();
      let paddingLeft: number = +window.getComputedStyle(textNode.parentElement as HTMLElement).paddingLeft.replace('px', '');
      let paddingRight: number = +window.getComputedStyle(textNode.parentElement as HTMLElement).paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const textWidth = this._measureTextNode(textNode)?.width || 0;
      return textWidth <= (parentWidth - leftTotalSiblingsWidth - rightTotalSiblingsWidth - paddingLeft - paddingRight);
    } catch (error) {
      new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
      return false;
    }
  }

  private _measureTextNode(textNode: Text, pBreakWords: boolean = false): BravoTextMetrics | undefined {
    try {
      const parentNode = textNode.parentElement;
      if (!parentNode) return undefined;
      const computedStyleParent = window.getComputedStyle(parentNode as HTMLElement);
      let font = new Font(computedStyleParent.fontFamily, computedStyleParent.fontSize, computedStyleParent.fontWeight);
      const { width: parentWidth } = parentNode.getBoundingClientRect();
      const dimensionOfText = BravoGraphicsRenderer.measureString(textNode.textContent as string, font, parentWidth, pBreakWords);
      return dimensionOfText;
    } catch (error) {
      new Error('Occurs when calculate  width of the text content!');
      return undefined;
    }
  }
  public drawTextInCell(textNode: Text, parentNode: Element): SVGElement | null {
    try {
      const behaviorText = this._calculateBehaviorTextNode(textNode) as BehaviorText;
      let computedStyleParent = window.getComputedStyle(parentNode);
      if (!behaviorText.isTextFitWidthCell && behaviorText.textAnchor === 'start') {
        const svgWrap = this._wrapTextIntoSvg(textNode, parentNode, behaviorText, computedStyleParent);
        return svgWrap;
      }
      let textContent = textNode.textContent || '';
      if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
        textContent = ' '.concat(textContent);
      }
      const textSvgEl = drawText(textContent, behaviorText as BehaviorText, computedStyleParent, 'preserve');
      this.element.appendChild(textSvgEl);
      return textSvgEl;
    } catch (error) {
      new Error('Occurs when draw text in cell!!');
      return null;
    }
  }
  private _wrapTextIntoSvg(textNode: Text, parentNode: Element, behaviorText: BehaviorText, parentStyle: CSSStyleDeclaration): SVGElement {
    //draw svg
    const rectSvg: Partial<DOMRect> = {};
    const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
    const paddingLeft = +parentStyle.paddingLeft.replace('px', '');
    const paddingRight = +parentStyle.paddingRight.replace('px', '');
    rectSvg.width = (parentNode as HTMLElement).offsetWidth - leftTotalSiblingsWidth - rightTotalSiblingsWidth - paddingLeft - paddingRight;
    rectSvg.x = behaviorText.point.x;
    rectSvg.y = behaviorText.point.y;
    rectSvg.height = (parentNode as HTMLElement).clientHeight;
    const svgWrapText = creatorSVG(rectSvg);
    //draw text
    let textContent = textNode.textContent || '';
    if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
      textContent = ' '.concat(textContent);
    }
    const textSvgEl = drawText(textContent, behaviorText as BehaviorText, parentStyle, 'preserve');
    textSvgEl.setAttribute('x', '1');
    textSvgEl.setAttribute('y', '1');
    svgWrapText.appendChild(textSvgEl);
    this.element.appendChild(svgWrapText);
    return svgWrapText;
  }

  //*util methods
  private _calculateTotalWidthSiblings(siblings: ChildNode[]): number {
    let totalWidth: number = siblings.reduce((acc, node) => {
      if (isTextNode(node)) {
        const dimensionOfText = this._measureTextNode(node, true);
        if (dimensionOfText) {
          acc += dimensionOfText.width;
        }
      }
      if (isElement(node)) {
        acc += (node as HTMLElement).offsetWidth;
      }
      return acc;
    }, 0);
    return totalWidth;
  }

  private _getTotalWidthSiblingNode(node: Node) {
    let rightTotalSiblingsWidth = 0;
    let leftTotalSiblingsWidth = 0;
    const siblings: ISiblings = this.scanSiblingsNode(node);
    if (siblings.leftSideCurrentNode.length === 0 && siblings.rightSideCurrentNode.length === 0) return { rightTotalSiblingsWidth, leftTotalSiblingsWidth };
    leftTotalSiblingsWidth = this._calculateTotalWidthSiblings(siblings.leftSideCurrentNode);
    rightTotalSiblingsWidth = this._calculateTotalWidthSiblings(siblings.rightSideCurrentNode);
    return {
      rightTotalSiblingsWidth,
      leftTotalSiblingsWidth
    };
  }

  //*Handle and draw image
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

}
