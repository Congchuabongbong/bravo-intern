import { Event as wjEven, Point, Rect } from '@grapecity/wijmo';
import { CellRange, CellType, FlexGrid, GridPanel } from '@grapecity/wijmo.grid';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent } from './core/css.util';
import { isElement, isHTMLImageElement, isHTMLInputElement, isTextNode } from './core/dom.util';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText } from './core/svg.engine.util';
import { BehaviorText, IPayloadEvent, ISiblings, PayloadCache, TextAlign } from './core/type.util';
export default class FlexGridSvgEngine extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public captureElement!: Element;
  public captureElementCoordinates!: Point;
  public flexGrid!: FlexGrid;
  private _payloadCache!: PayloadCache;
  //**events declared here
  public drewRect: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drawingText: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewText: wjEven<FlexGridSvgEngine, IPayloadEvent> = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  //*constructor
  constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
    super(_anchorElement);
    //? lazy initialize
    // anchorElement
    this.anchorElement = _anchorElement;
    this.flexGrid = _flex;
    //capture
    this.captureElement = _flex.hostElement;
    const { x: xCaptureElement, y: yCaptureElement } = this.captureElement.getBoundingClientRect();
    this.captureElementCoordinates = new Point(xCaptureElement, yCaptureElement);
  }

  public changeOriginCoordinates(elDOMRect: DOMRect): Rect {
    const boundingRect = Rect.fromBoundingRect(elDOMRect);
    boundingRect.left -= this.captureElementCoordinates.x;
    boundingRect.top -= this.captureElementCoordinates.y;
    return boundingRect;
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
  private _getPayloadEvent(payloadCache: PayloadCache): IPayloadEvent {
    const payloadEvent: Partial<IPayloadEvent> = {};
    payloadEvent.col = payloadCache.col;
    payloadEvent.row = payloadCache.row;
    payloadEvent.panel = payloadCache.panel;
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
      //?draw cells panel and cells frozen
      this._drawCellPanel(cellsPanel);
      this._drawCellPanelFrozen(cellsPanel);
      //?draw cells rows header and cells row header frozen
      this._drawCellPanel(rowsHeaderPanel);
      this._drawCellPanelFrozen(rowsHeaderPanel);
      //?draw cells columns header and cells columns header frozen
      this._drawCellPanel(colsHeaderPanel);
      this._drawCellPanelFrozen(colsHeaderPanel);
      //?draw cells columns footer and cells columns footer frozen
      this._drawCellPanel(colsFooterPanel);
      this._drawCellPanelFrozen(colsFooterPanel);
      this.setViewportSize(this.flexGrid.hostElement.offsetWidth, this.flexGrid.hostElement.offsetHeight);
      const svgEl = declareNamespaceSvg(this.element as SVGElement);
      return svgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when render visible flex grid SVG!');
    } finally {
      this.endRender();
    }
  }

  private _drawCellPanelFrozen(panel: GridPanel) {
    if (!this.flexGrid.columns.frozen) return;
    const { row2, row } = panel.viewRange;
    const viewRange = new CellRange(row, 0, row2, this.flexGrid.columns.frozen - 1);
    this._drawCellPanel(panel, viewRange);
  }
  //*handle and draw cell
  private _drawBorderCell() {
    const { left, top, bottom, right } = this._payloadCache.cellBoundingRect;
    if (hasBorderBottom(this._payloadCache.cellStyles)) {
      const lineSvgEl = this.drawLine(left, bottom, right, bottom);
      lineSvgEl.setAttribute('stroke-width', this._payloadCache.cellStyles.borderBottomWidth);
      lineSvgEl.setAttribute('stroke', this._payloadCache.cellStyles.borderBottomColor);
    }
    if (hasBorderTop(this._payloadCache.cellStyles)) {
      const lineSvgEl = this.drawLine(left, top, right, top);
      lineSvgEl.setAttribute('stroke-width', this._payloadCache.cellStyles.borderTopWidth);
      lineSvgEl.setAttribute('stroke', this._payloadCache.cellStyles.borderTopColor);
    }
    if (hasBorderRight(this._payloadCache.cellStyles)) {
      const lineSvgEl = this.drawLine(right, top, right, bottom);
      lineSvgEl.setAttribute('stroke-width', this._payloadCache.cellStyles.borderRightWidth);
      lineSvgEl.setAttribute('stroke', this._payloadCache.cellStyles.borderRightColor);
    }
    if (hasBorderLeft(this._payloadCache.cellStyles)) {
      const lineSvgEl = this.drawLine(left, top, left, bottom);
      lineSvgEl.setAttribute('stroke-width', this._payloadCache.cellStyles.borderLeftWidth);
      lineSvgEl.setAttribute('stroke', this._payloadCache.cellStyles.borderLeftColor);
    }
  }

  private _drawCellPanel(panel: GridPanel, viewRange?: CellRange) {
    const { row: rowStart, row2: rowEnd, col: colStart, col2: colEnd } = viewRange || panel.viewRange;
    for (let colIndex = colStart; colIndex <= colEnd; colIndex++) {
      for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
        let cellEl = panel.getCellElement(rowIndex, colIndex);
        if (!cellEl) continue;
        if ((cellEl.className.includes('wj-group') || cellEl.className.includes('wj-header') || cellEl.className.includes('wj-footer')) && (panel.cellType === CellType.Cell || panel.cellType === CellType.ColumnHeader || panel.cellType === CellType.ColumnFooter)) {
          const cellRange = this.flexGrid.getMergedRange(panel, rowIndex, colIndex);
          if (cellRange) {
            const columnStartGroup = cellRange.col;
            const rowStartGroup = cellRange.row;
            //column ignore when drew first time
            if (colStart <= columnStartGroup && colIndex > columnStartGroup) {
              continue;
            } else if (colStart > columnStartGroup && colIndex > colStart) {
              continue;
            }
            //row ignore when drew first time
            if (rowStart <= rowStartGroup && rowIndex > rowStartGroup) {
              continue;
            } else if (rowStart > rowStartGroup && rowIndex > rowStart) {
              continue;
            }
          }
        }
        //!Cache data: col,row, panel, cellElement
        this._payloadCache = {} as PayloadCache;
        this._payloadCache.col = colIndex;
        this._payloadCache.row = rowIndex;
        this._payloadCache.panel = panel;
        this._payloadCache.cellElement = cellEl;
        this._drawRectCell();
      }
    }
  }

  private _drawRectCell(): void {
    const cellBoundingRect = this.changeOriginCoordinates(this._payloadCache.cellElement.getBoundingClientRect());
    const cellStyles = window.getComputedStyle(this._payloadCache.cellElement);
    const groupSvgEl = this.startGroup(this._payloadCache.cellElement.className);
    const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, cellBoundingRect.width, cellBoundingRect.height);
    cellStyles.backgroundColor && !isTransparent(cellStyles.backgroundColor) && rectSvgEl.setAttribute('fill', cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    //!cache cellStyles,cellBoundingRect,group
    this._payloadCache.cellStyles = cellStyles;
    this._payloadCache.cellBoundingRect = cellBoundingRect;
    this._payloadCache.group = groupSvgEl;
    this._drawBorderCell();
    this._scanCell(this._payloadCache.cellElement);
    this.endGroup();
  }

  private _scanCell(elementScanned: Element,) {
    if (elementScanned.hasChildNodes()) {
      elementScanned.childNodes.forEach((node: Node) => {
        //?text node;
        if (isTextNode(node)) {
          const svgEl = this._drawTextInCell(node);
          svgEl && this._payloadCache.group.appendChild(svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(node as HTMLElement)) {
          const svgEl = this._drawImageInCell(node as HTMLImageElement, elementScanned);
          svgEl && this._payloadCache.group.appendChild(svgEl as Node);
        }
        //?case input
        if (isHTMLInputElement(node as Element)) { // case input checkbox
          const inputNode = node as HTMLInputElement;
          const inputBoundingRect = this.changeOriginCoordinates(inputNode.getBoundingClientRect());
          const svgInput = this.drawRect(inputBoundingRect.left, inputBoundingRect.top, inputBoundingRect.width, inputBoundingRect.height);
          svgInput.setAttribute('rx', '2');
          svgInput.setAttribute('fill', '#fff');
          svgInput.setAttribute('stroke', '#767676');
          svgInput.setAttribute('stroke-width', '1.2');
          if (inputNode.checked) {
            svgInput.setAttribute('fill', '#1da1f2');
          }
        };
        this._scanCell(node as Element);
      });
    }
  }

  //*Handle and draw Text Here:
  private _calculateBehaviorTextNode(textNode: Text): BehaviorText {
    try {
      if (textNode.textContent === 'Dịch vụ ') debugger;
      const { parentBoundingRect, parentStyles } = this._getInformationParentNode(textNode);
      let deviationHeight = 0;
      //!catch dimensionText
      this._payloadCache.dimensionText = this._measureTextNode(textNode);
      //?kiểm tra trường hợp nếu là inline element tính độ chênh lệch chiều cao nội dung bên trong và thẻ chứa nội dung
      if (isInline(parentStyles)) {
        let heightOfText = this._payloadCache.dimensionText?.lineHeight || 0;
        deviationHeight = (parentBoundingRect.height - heightOfText) / 2;
      }
      const alginText = parentStyles.textAlign;
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const paddingLeft: number = +parentStyles.paddingLeft.replace('px', '');
      const paddingTop: number = +parentStyles.paddingTop.replace('px', '');
      const paddingRight: number = +parentStyles.paddingRight.replace('px', '');
      const xTextDefault: number = parentBoundingRect.left + paddingLeft;
      const yTextDefault: number = parentBoundingRect.top + paddingTop + deviationHeight;
      /*
        ?tạo default behavior text base.
        ?default text alignment left and dominant baseline 'hanging', textAnchor: 'start'
      */
      let behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextDefault, yTextDefault), textAnchor: 'start' };
      let isFitContent: boolean = this._isTextFitWidthCell(textNode);
      switch (alginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          behaviorTextBase.point!.x += leftTotalSiblingsWidth;
          behaviorTextBase.textAnchor = 'start';
          behaviorTextBase.isTextFitWidthCell = isFitContent;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (isFitContent) {
            behaviorTextBase.point!.x += (parentBoundingRect.width - leftTotalSiblingsWidth - rightTotalSiblingsWidth) / 2 - paddingRight;
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
        default:
          behaviorTextBase.isTextFitWidthCell = true;
          return (behaviorTextBase as BehaviorText);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  };
  private _isTextFitWidthCell(textNode: Text, pBreakWords: boolean = false): boolean {
    try {
      const { parentBoundingRect, parentStyles } = this._getInformationParentNode(textNode);
      const paddingLeft: number = +parentStyles.paddingLeft.replace('px', '');
      const paddingRight: number = +parentStyles.paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const textWidth = this._payloadCache.dimensionText?.width || 0;
      return textWidth <= (parentBoundingRect.width - leftTotalSiblingsWidth - rightTotalSiblingsWidth - paddingLeft - paddingRight);
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
    }
  }

  private _measureTextNode(textNode: Text, pBreakWords: boolean = false): BravoTextMetrics | undefined {
    try {
      const { parentNode, parentStyles, parentBoundingRect } = this._getInformationParentNode(textNode);
      if (!parentNode) return undefined;
      const font = new Font(parentStyles.fontFamily, parentStyles.fontSize, parentStyles.fontWeight);
      const dimensionOfText = BravoGraphicsRenderer.measureString(textNode.textContent as string, font, parentBoundingRect.width, pBreakWords);
      return dimensionOfText;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when calculate  width of the text content!');
    }
  }
  private _drawTextInCell(textNode: Text,): SVGElement | null {
    try {
      const { parentStyles } = this._getInformationParentNode(textNode);
      const behaviorText: BehaviorText = this._calculateBehaviorTextNode(textNode) as BehaviorText;
      //!catch behaviorText
      this._payloadCache.behaviorText = behaviorText;
      let widthTextNode = this._payloadCache.dimensionText?.width || 0;
      /*
      ? Trường hợp không phải text node duy nhất hoặc là thẻ inline wrap text node
      ?Nếu width của cell nhỏ hơn tọa độ x của text return null ko draw
      ?Nếu width của cell nằm trong tọa độ x đến right thì thay đổi isTextFitWidthCell = false và switch case wrap svg
      */
      if (!this.isOnlyNode(textNode, Node.TEXT_NODE) || isInline(parentStyles)) {
        if (this._payloadCache.cellBoundingRect.width < this._payloadCache.behaviorText.point.x) {
          return null;
        } else if (this._payloadCache.cellBoundingRect.width >= this._payloadCache.behaviorText.point.x && this._payloadCache.cellElement.offsetWidth <= this._payloadCache.behaviorText.point.x + widthTextNode) {
          this._payloadCache.behaviorText.isTextFitWidthCell = false;
        }
      }
      //?case swap text by svg
      if (!this._payloadCache.behaviorText.isTextFitWidthCell) {
        const svgWrap = this._wrapTextIntoSvg(textNode);
        return svgWrap;
      }
      let textContent = textNode.textContent || '';
      if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
        textContent = ' '.concat(textContent);
      }
      const textSvgEl = drawText((textContent as string), this._payloadCache.behaviorText, parentStyles, 'preserve');
      return textSvgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when draw text in cell!!');
    }
  }
  private _wrapTextIntoSvg(textNode: Text): SVGElement {
    try {
      const { parentStyles, parentNode } = this._getInformationParentNode(textNode);
      const rectSvg: Partial<DOMRect> = {};
      const { leftTotalSiblingsWidth, rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(textNode);
      const paddingLeft = +this._payloadCache.cellStyles.paddingLeft.replace('px', '') || 0;
      const paddingRight = +this._payloadCache.cellStyles.paddingRight.replace('px', '') || 0;
      /*
      ?case 1 inline wrap text: width svg = phần còn lại của width trừ đi tổng left siblings và padding left và right
      ?case 2 nếu là text node duy nhất thì trừ đi cả right siblings! còn không thì không
      ?case 3 nếu là ko là text node duy nhất thì không trừ đi right siblings (trừ sẽ bị âm)
      */
      if (isInline(parentStyles)) {
        let { leftTotalSiblingsWidth } = this._getTotalWidthSiblingNode(parentNode);
        rectSvg.width = this._payloadCache.cellBoundingRect.width - leftTotalSiblingsWidth - paddingLeft - paddingRight;
      } else {
        rectSvg.width = this._payloadCache.cellBoundingRect.width - leftTotalSiblingsWidth - paddingLeft - paddingRight;
        if (this.isOnlyNode(textNode, Node.TEXT_NODE)) {
          rectSvg.width -= rightTotalSiblingsWidth;
        }
      }
      rectSvg.x = this._payloadCache.behaviorText.point.x;
      rectSvg.y = this._payloadCache.behaviorText.point.y;
      rectSvg.height = this._payloadCache.cellElement.clientHeight || 0;
      const svgWrapText = creatorSVG(rectSvg);
      //draw text
      let textContent = textNode.textContent || '';
      if (!this.isFirstNode(textNode, Node.TEXT_NODE)) {
        textContent = ' '.concat(textContent);
      }
      const textSvgEl = drawText(textContent, this._payloadCache.behaviorText as BehaviorText, parentStyles, 'preserve');
      textSvgEl.setAttribute('x', '0');
      textSvgEl.setAttribute('y', '0');
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
        const dimensionOfText = this._measureTextNode(node, false);
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

  private _getInformationParentNode(node: Node) {
    let parentNode: Element;
    let parentBoundingRect: Rect;
    let parentStyles: CSSStyleDeclaration;
    if (node.parentElement === this._payloadCache.cellElement) {
      parentNode = this._payloadCache.cellElement;
      parentStyles = this._payloadCache.cellStyles;
      parentBoundingRect = this._payloadCache.cellBoundingRect;
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
    const imageSvgEl = this.drawImage(imageNode.src, imageBoundingRect.left, imageBoundingRect.top, imageBoundingRect.width, imageBoundingRect.height);
    return imageSvgEl;
  }

  private _wrapImageIntoSvg(imageEl: HTMLImageElement, parentNode: Element): SVGElement {
    const rectSvgEl: Partial<Rect> = {};
    const parentBoundingRect = this.changeOriginCoordinates(parentNode.getBoundingClientRect());
    rectSvgEl.width = parentBoundingRect.width;
    rectSvgEl.height = parentBoundingRect.height;
    rectSvgEl.left = parentBoundingRect.left;
    rectSvgEl.top = parentBoundingRect.top;
    const svgWrapImage = creatorSVG(rectSvgEl);
    const imageSvgEl = drawImage(imageEl.src, 0, 0, imageEl.width, imageEl.height);
    svgWrapImage.appendChild(imageSvgEl);
    this.element.appendChild(svgWrapImage);
    return svgWrapImage;
  }

}
