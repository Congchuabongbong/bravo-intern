import {
  Point, Event as wjEven
} from '@grapecity/wijmo';
import { CellRange, FlexGrid, GridPanel } from '@grapecity/wijmo.grid';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent } from './core/css.util';
import { isElement, isHTMLImageElement, isHTMLInputElement, isTextNode } from './core/dom.util';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText } from './core/svg.engine.util';
import { BehaviorText, TextAlign } from './core/text.type';

export interface ISiblings {
  leftSideCurrentNode: ChildNode[], rightSideCurrentNode: ChildNode[];
}
export type Payload = {
  panel: GridPanel;
  row: number;
  col: number;
  cellElement: HTMLElement;
  cellStyles: CSSStyleDeclaration;
  cellBoundingRect: DOMRect;
  group: Element;
  dimensionText: BravoTextMetrics | undefined,
};

export interface IPayloadEvent extends Pick<Payload, 'panel' | 'row' | 'col'> {
  contentDraw: Node | string; // nội dung được vẽ
  svgDrew?: Element; // svg được vẽ,
}
export default class FlexGridSvgEngine extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public captureElement!: Element;
  public captureElementCoordinates!: Point;
  public flexGrid!: FlexGrid;
  public _svgWrapper!: Element | null;
  //**events declared here
  public drewRect: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drawingText: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewText: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();

  //*constructor
  constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
    super(_anchorElement);
    //Todo: lazy initialize
    // anchorElement
    this.anchorElement = _anchorElement;
    this.flexGrid = _flex;
    //capture
    this.captureElement = _flex.hostElement;
    const { x: xCaptureElement, y: yCaptureElement } = this.captureElement.getBoundingClientRect();
    this.captureElementCoordinates = new Point(xCaptureElement, yCaptureElement);
  }

  public changeOriginCoordinates(elDOMRect: DOMRect): DOMRect {
    //! Note: mutable object! This is impure function
    elDOMRect.x -= this.captureElementCoordinates.x;
    elDOMRect.y -= this.captureElementCoordinates.y;
    return elDOMRect;
  }

  //*method raise event here::
  public onDrewRect(payloadEvent: IPayloadEvent) {
    this.drewRect.raise(this, payloadEvent);
  }

  public onDrawingText(payloadEvent: IPayloadEvent) {
    this.drawingText.raise(this, payloadEvent);
  }

  public onDrewText(payloadEvent: IPayloadEvent) {
    this.drewText.raise(this, payloadEvent);
  }
  private _getPayloadEvent(payload: Payload): IPayloadEvent {
    const payloadEvent: Partial<IPayloadEvent> = {};
    payloadEvent.col = payload.col;
    payloadEvent.row = payload.row;
    payloadEvent.panel = payload.panel;
    return payloadEvent as IPayloadEvent;
  }
  //*render svg
  public renderFlexSvgVisible(): SVGElement {
    try {
      this.beginRender();
      const colsHeaderPanel = this.flexGrid.columnHeaders;
      const colsFooterPanel = this.flexGrid.columnFooters;
      const cellsPanel = this.flexGrid.cells;
      const rowsHeaderPanel = this.flexGrid.rowHeaders;
      //draw cells panel and cells frozen
      this._drawCellPanel(cellsPanel);
      const viewRangeCellsFrozen = this._getRangeCellsFrozen(cellsPanel);
      viewRangeCellsFrozen && this._drawCellPanel(cellsPanel, viewRangeCellsFrozen);
      //draw cells columns header and cells columns header frozen
      this._drawCellPanel(colsHeaderPanel);
      const viewRangeColsHeaderFrozen = this._getRangeCellsFrozen(colsHeaderPanel);
      viewRangeColsHeaderFrozen && this._drawCellPanel(colsHeaderPanel, viewRangeColsHeaderFrozen);
      //draw cells columns footer and cells columns footer frozen
      this._drawCellPanel(colsHeaderPanel);
      const viewRangeColsFooterFrozen = this._getRangeCellsFrozen(colsFooterPanel);
      viewRangeColsFooterFrozen && this._drawCellPanel(colsFooterPanel, viewRangeColsFooterFrozen);
      //draw cells rows header and cells row header frozen
      this._drawCellPanel(rowsHeaderPanel);
      const viewRangeRowsHeaderFrozen = this._getRangeCellsFrozen(rowsHeaderPanel);
      viewRangeRowsHeaderFrozen && this._drawCellPanel(rowsHeaderPanel, viewRangeRowsHeaderFrozen);
      this.setViewportSize(this.flexGrid.hostElement.offsetWidth, this.flexGrid.hostElement.offsetHeight);
      const svgEl = declareNamespaceSvg(this.element as SVGElement);
      return svgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when render visible flex grid SVG!');
    } finally { this.endRender(); }
  }

  private _getRangeCellsFrozen(gridPanel: GridPanel): CellRange | null {
    const { row2, row } = gridPanel.viewRange;
    if (!this.flexGrid.columns.frozen) return null;
    const viewRange = new CellRange(row, 0, row2, this.flexGrid.columns.frozen - 1);
    return viewRange;
  }

  //*handle and draw cell
  private _drawBorderCell(payload: Payload) {
    const { x, y, bottom, right } = payload.cellBoundingRect;
    if (hasBorderBottom(payload.cellStyles)) {
      const lineSvgEl = this.drawLine(x, bottom, right, bottom);
      lineSvgEl.setAttribute('stroke-width', payload.cellStyles.borderBottomWidth);
      lineSvgEl.setAttribute('stroke', payload.cellStyles.borderBottomColor);
    }
    if (hasBorderTop(payload.cellStyles)) {
      const lineSvgEl = this.drawLine(x, y, right, y);
      lineSvgEl.setAttribute('stroke-width', payload.cellStyles.borderTopWidth);
      lineSvgEl.setAttribute('stroke', payload.cellStyles.borderTopColor);
    }
    if (hasBorderRight(payload.cellStyles)) {
      const lineSvgEl = this.drawLine(right, y, right, bottom);
      lineSvgEl.setAttribute('stroke-width', payload.cellStyles.borderRightWidth);
      lineSvgEl.setAttribute('stroke', payload.cellStyles.borderRightColor);
    }
    if (hasBorderLeft(payload.cellStyles)) {
      const lineSvgEl = this.drawLine(x, y, x, bottom);
      lineSvgEl.setAttribute('stroke-width', payload.cellStyles.borderLeftWidth);
      lineSvgEl.setAttribute('stroke', payload.cellStyles.borderLeftColor);
    }
  }

  private _drawCellPanel(panel: GridPanel, viewRange?: CellRange) {
    const { row: rowStart, row2: rowEnd, col: colStart, col2: colEnd } = viewRange || panel.viewRange;
    for (let colIndex = colStart; colIndex <= colEnd; colIndex++) {
      for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
        let cellEl = panel.getCellElement(rowIndex, colIndex);
        if (!cellEl || (colIndex > colStart && cellEl.className.includes('wj-group'))) continue;
        let payload: Partial<Payload> = {};
        payload.col = colIndex;
        payload.row = rowIndex;
        payload.panel = panel;
        payload.cellElement = cellEl;
        this._drawRectCell(payload as Payload);
      }
    }
  }
  private _drawRectCell(payload: Payload): void {
    //TODO: tối ứu code ở đây not complete!
    //!clean code here
    const cellBoundingRect = this.changeOriginCoordinates(payload.cellElement.getBoundingClientRect());
    const cellStyles = window.getComputedStyle(payload.cellElement);
    const groupSvgEl = this.startGroup(payload.cellElement.className);
    const rectSvgEl = this.drawRect(cellBoundingRect.x, cellBoundingRect.y, cellBoundingRect.width, cellBoundingRect.height);
    cellStyles.backgroundColor && !isTransparent(cellStyles.backgroundColor) && rectSvgEl.setAttribute('fill', cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    payload.cellStyles = cellStyles;
    payload.cellBoundingRect = cellBoundingRect;
    payload.group = groupSvgEl;
    this._drawBorderCell(payload);
    this._scanCell(payload.cellElement, payload);
    this.endGroup();
  }

  //scan cell
  private _scanCell(elementScanned: Element, payload: Payload) {
    if (elementScanned.hasChildNodes()) {
      elementScanned.childNodes.forEach((node: Node) => {
        //?text node;
        if (isTextNode(node)) {
          const svgEl = this._drawTextInCell(node, payload);
          svgEl && payload.group.appendChild(svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(node as HTMLElement)) {
          const svgEl = this._drawImageInCell(node as HTMLImageElement, elementScanned);
          svgEl && payload.group.appendChild(svgEl as Node);
        }
        //?case input
        if (isHTMLInputElement(node as Element)) { // case input checkbox
          const inputNode = node as HTMLInputElement;
          const inputBoundingRect = this.changeOriginCoordinates(inputNode.getBoundingClientRect());
          // const computedStyle = window.getComputedStyle(node as Element);
          const svgInput = this.drawRect(inputBoundingRect.x, inputBoundingRect.y, inputBoundingRect.width, inputBoundingRect.height);
          svgInput.setAttribute('rx', '2');
          svgInput.setAttribute('fill', '#fff');
          svgInput.setAttribute('stroke', '#767676');
          svgInput.setAttribute('stroke-width', '1.2');
          if (inputNode.checked) {
            svgInput.setAttribute('fill', '#1da1f2');
          }
        };
        this._scanCell(node as Element, payload);
      });
    }
  }

  //*Handle and draw Text Here:
  private _calculateBehaviorTextNode(textNode: Text, payload: Payload): BehaviorText {
    try {
      let { parentBoundingRect, parentNode, parentStyles } = this._getInformationParentNode(textNode, payload);
      //?case inline b tag or i tag wrap text node in cell etc...
      let deviationHeight = 0;
      if (isInline(parentStyles)) {
        let heightOfText = this._measureTextNode(textNode)?.height || 0;
        let paddingTop = parentNode.parentElement && +getComputedStyle(parentNode?.parentElement).paddingTop.replace('px', '') || 0;
        deviationHeight = (parentBoundingRect.height - heightOfText + paddingTop) / 4;
      }
      const alginText = parentStyles.textAlign;
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      let paddingLeft: number = +parentStyles.paddingLeft.replace('px', '');
      let paddingTop: number = +parentStyles.paddingTop.replace('px', '');
      let paddingRight: number = +parentStyles.paddingRight.replace('px', '');
      let xTextDefault: number = parentBoundingRect.x + paddingLeft;
      let yTextDefault: number = Math.floor(parentBoundingRect.y + paddingTop + deviationHeight);
      //default behavior text
      let behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextDefault, yTextDefault), textAnchor: 'start' };

      payload.dimensionText = this._measureTextNode(textNode);
      let isFitContent: boolean = this._isTextFitWidthCell(textNode, payload);
      switch (alginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          behaviorTextBase.point!.x += leftTotalSiblingsWidth;
          behaviorTextBase.textAnchor = 'start';
          behaviorTextBase.isTextFitWidthCell = isFitContent;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (isFitContent) {
            behaviorTextBase.point!.x += (parentBoundingRect.width / 2) - leftTotalSiblingsWidth - rightTotalSiblingsWidth;
            if (leftTotalSiblingsWidth && rightTotalSiblingsWidth) behaviorTextBase.point!.x - paddingLeft;
            behaviorTextBase.textAnchor = 'middle';
            behaviorTextBase.isTextFitWidthCell = true;
            return (behaviorTextBase as BehaviorText);
          }
          behaviorTextBase.isTextFitWidthCell = false;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.End:
          if (isFitContent) {
            behaviorTextBase.point!.x += (parentBoundingRect.width - paddingRight - paddingLeft) - rightTotalSiblingsWidth;
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
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  };
  private _isTextFitWidthCell(textNode: Text, payload: Payload, pBreakWords: boolean = false): boolean {
    try {
      const { parentBoundingRect, parentStyles } = this._getInformationParentNode(textNode, payload);
      let alignText = parentStyles.textAlign;
      let paddingLeft: number = +parentStyles.paddingLeft.replace('px', '');
      let paddingRight: number = +parentStyles.paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const textWidth = payload.dimensionText?.width || 0;
      /*
        kiểm tra trường hợp nếu text nằm bên trái hay bên phải hay giữa để trừ đi độ rộng sibling tương ứng
      */
      if (parentBoundingRect.width >= leftTotalSiblingsWidth + rightTotalSiblingsWidth + paddingLeft + paddingRight + textWidth) {
        return textWidth <= (parentBoundingRect.width - leftTotalSiblingsWidth - rightTotalSiblingsWidth - paddingLeft - paddingRight);
      } else {
        return textWidth <= parentBoundingRect.width - leftTotalSiblingsWidth - paddingLeft;
      }

    } catch (error) {
      console.error(error);
      throw new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
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
      console.error(error);
      throw new Error('Occurs when calculate  width of the text content!');
    }
  }
  private _drawTextInCell(textNode: Text, payload: Payload): SVGElement | null {
    try {
      const { parentStyles, parentNode } = this._getInformationParentNode(textNode, payload);
      let behaviorText: BehaviorText = this._calculateBehaviorTextNode(textNode, payload) as BehaviorText;
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const paddingLeft = +parentStyles.paddingLeft.replace('px', '');
      if (parentNode.clientWidth < leftTotalSiblingsWidth + paddingLeft) {
        return null;
      }
      if (!behaviorText.isTextFitWidthCell && behaviorText.textAnchor === 'start') {
        //case wrapper svg text
        const svgWrap = this._wrapTextIntoSvg(textNode, behaviorText, payload);
        return svgWrap;
      }
      let textContent = textNode.textContent || '';
      if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
        textContent = ' '.concat(textContent);
      }
      const textSvgEl = drawText((textContent as string), behaviorText as BehaviorText, parentStyles, 'preserve');
      return textSvgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when draw text in cell!!');
    }
  }
  private _wrapTextIntoSvg(textNode: Text, behaviorText: BehaviorText, payload: Payload): SVGElement {
    try {

      const { parentStyles, parentNode } = this._getInformationParentNode(textNode, payload);
      const rectSvg: Partial<DOMRect> = {};
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const paddingLeft = +parentStyles.paddingLeft.replace('px', '') || 0;
      const paddingRight = +parentStyles.paddingRight.replace('px', '') || 0;
      const parentWidth = (parentNode as HTMLElement).offsetWidth;
      const textNodeWidth = payload.dimensionText?.width || 0;
      /*
        kiểm tra độ rộng của parent có lớn hay nhỏ hơn so với tổng số chiều dài của children không!
        kiểm tra trường hợp nếu text nằm bên trái hay bên phải hay giữa để trừ đi độ rộng sibling tương ứng
      */
      if (parentWidth > leftTotalSiblingsWidth + rightTotalSiblingsWidth + textNodeWidth) {
        rectSvg.width = parentWidth - leftTotalSiblingsWidth - paddingLeft - paddingRight;
      } else {
        rectSvg.width = parentWidth - paddingLeft - paddingRight - leftTotalSiblingsWidth;
      }
      rectSvg.x = behaviorText.point.x;
      rectSvg.y = behaviorText.point.y;
      rectSvg.height = (parentNode as HTMLElement).clientHeight;
      const svgWrapText = creatorSVG(rectSvg);
      //draw text
      let textContent = textNode.textContent || '';
      if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
        textContent = ' '.concat(textContent);
      }
      const textSvgEl = drawText(textContent, behaviorText as BehaviorText, parentStyles, 'preserve');
      textSvgEl.setAttribute('x', '1');
      textSvgEl.setAttribute('y', '1');
      svgWrapText.appendChild(textSvgEl);
      this.element.appendChild(svgWrapText);
      return svgWrapText;
    } catch (error) {
      console.error(error);
      throw new Error('Something wrong when wrap text in svg');
    }
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

  private _getInformationParentNode(node: Node, payload: Payload) {
    let parentNode: Element;
    let parentBoundingRect: DOMRect;
    let parentStyles: CSSStyleDeclaration;
    if (node.parentElement === payload.cellElement) {
      parentNode = payload.cellElement;
      parentStyles = payload.cellStyles;
      parentBoundingRect = payload.cellBoundingRect;
    } else {
      parentNode = node.parentElement as Element;
      parentStyles = getComputedStyle(parentNode);
      parentBoundingRect = this.changeOriginCoordinates(parentNode.getBoundingClientRect());
    }
    return {
      parentNode,
      parentBoundingRect,
      parentStyles
    };
  }

  //*Handle and draw image
  private _drawImageInCell(imageNode: HTMLImageElement, parentNode: Element): SVGElement {
    const imageBoundingRect = this.changeOriginCoordinates(imageNode.getBoundingClientRect());
    let parentBoundingRect = parentNode.getBoundingClientRect();
    if ((parentBoundingRect.height < imageBoundingRect.height) || (parentBoundingRect.width < imageBoundingRect.width)) {
      const svgWrap = this._wrapImageIntoSvg(imageNode, parentNode);
      return svgWrap;
    }
    const imageSvgEl = this.drawImage(imageNode.src, imageBoundingRect.x, imageBoundingRect.y, imageBoundingRect.width, imageBoundingRect.height);
    return imageSvgEl;
  }

  private _wrapImageIntoSvg(imageEl: HTMLImageElement, parentEl: Element): SVGElement {
    const rectSvgEl: Partial<DOMRect> = {};
    const parentBoundingRect = this.changeOriginCoordinates(parentEl.getBoundingClientRect());
    rectSvgEl.width = parentBoundingRect.width;
    rectSvgEl.height = parentBoundingRect.height;
    rectSvgEl.x = parentBoundingRect.x;
    rectSvgEl.y = parentBoundingRect.y;
    const svgWrapImage = creatorSVG(rectSvgEl);
    const imageSvgEl = drawImage(imageEl.src, 0, 0, imageEl.width, imageEl.height);
    svgWrapImage.appendChild(imageSvgEl);
    this.element.appendChild(svgWrapImage);
    return svgWrapImage;
  }

}
