import { Point, Rect, Event as wjEven, DataType } from '@grapecity/wijmo';
import { CellRange, CellType, FlexGrid, GridPanel, GroupRow } from '@grapecity/wijmo.grid';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent } from './core/css.util';
import { isElement, isHTMLImageElement, isHTMLInputElement, isTextNode } from './core/dom.util';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText } from './core/svg.engine.util';
import { copyTextStyles } from './core/text.util';
import { BehaviorText, IPayloadEvent, ISiblings, PayloadCache, TextAlign } from './core/type.util';

type CellPadding = {
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
};
export default class FlexGridSvgEngine extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public captureElement!: Element;
  public captureElementCoordinates!: Point;
  public flexGrid!: FlexGrid;
  private _payloadCache!: PayloadCache;
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
    this.stylesHostElement = getComputedStyle(this.flexGrid.hostElement);
    this.fontDefault = new Font(this.stylesHostElement.fontFamily, this.stylesHostElement.fontSize, this.stylesHostElement.fontWeight);
  }

  public changeOriginCoordinates(elDOMRect: DOMRect): Rect {
    const boundingRect = Rect.fromBoundingRect(elDOMRect);
    boundingRect.left -= this.captureElementCoordinates.x;
    boundingRect.top -= this.captureElementCoordinates.y;
    return boundingRect;
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
      this._payloadCache = {} as PayloadCache; //clean cache
    }
  }

  private _drawCellPanelFrozen(panel: GridPanel) {
    if (!this.flexGrid.frozenColumns) return;
    console.log(this.flexGrid.frozenColumns);
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
    //!initial Cache data
    this._payloadCache = {} as PayloadCache;
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
        const groupSvgEl = this.startGroup(cellEl.className);
        //!Cache data here
        this._payloadCache.cellElement = cellEl;
        this._payloadCache.cellStyles = getComputedStyle(cellEl);
        this._payloadCache.cellBoundingRect = this.changeOriginCoordinates(cellEl.getBoundingClientRect());
        this._payloadCache.group = groupSvgEl;
        this._drawRectCell();
        this.endGroup();
      }
    }
  }

  private _drawRectCell(): void {
    const cellBoundingRect = this._payloadCache.cellBoundingRect;
    const cellStyles = this._payloadCache.cellStyles;
    const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, cellBoundingRect.width, cellBoundingRect.height);
    cellStyles.backgroundColor && !isTransparent(cellStyles.backgroundColor) && rectSvgEl.setAttribute('fill', cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    this._drawBorderCell();
    this._scanCell(this._payloadCache.cellElement);
  }

  private _scanCell(elScanned: Element,) {
    if (elScanned.hasChildNodes()) {
      elScanned.childNodes.forEach((node: Node) => {
        //?text node;
        if (isTextNode(node)) {
          const svgEl = this._drawTextNodeInCell(node);
          svgEl && this._payloadCache.group.appendChild(svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(node as HTMLElement)) {
          const svgEl = this._drawImageInCell(node as HTMLImageElement, elScanned);
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
      let isFitContent: boolean = this._isTextNodeFitWidthCell(textNode);
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

  private _isTextNodeFitWidthCell(textNode: Text, pBreakWords: boolean = false): boolean {
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

  private _drawTextNodeInCell(textNode: Text,): SVGElement | null {
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
        } else if (this._payloadCache.cellBoundingRect.width > this._payloadCache.behaviorText.point.x && this._payloadCache.cellElement.offsetWidth < this._payloadCache.behaviorText.point.x + widthTextNode) {
          this._payloadCache.behaviorText.isTextFitWidthCell = false;
        }
      }
      //?case swap text by svg
      if (!this._payloadCache.behaviorText.isTextFitWidthCell) {
        const svgWrap = this._wrapTextNodeIntoSvg(textNode);
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

  private _wrapTextNodeIntoSvg(textNode: Text): SVGElement | null {
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
      rectSvg.height = this._payloadCache.cellElement.clientHeight || 0;
      if (rectSvg.width <= 0 || rectSvg.height <= 0) {
        return null;
      }
      rectSvg.x = this._payloadCache.behaviorText.point.x;
      rectSvg.y = this._payloadCache.behaviorText.point.y;
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
  //================================================================================================================================
  //================================================================================================================================
  //================================================================================================================================
  //================================================================================================================================
  //================================================================================================================================
  //**Draw raw svg start here:
  //**declared property here */
  public stylesHostElement!: CSSStyleDeclaration;
  public fontDefault!: Font;
  public cellPadding: CellPadding = { paddingBottom: 8, paddingLeft: 8, paddingTop: 8, paddingRight: 8 };
  //**events declared here
  public drewRectHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderRightHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderBottomHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drawingTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();

  //*method raise event here::
  public onDrewRect(payloadEvent: IPayloadEvent) {
    this.drewRectHandler.raise(this, payloadEvent);
  }

  public onDrawingText(payloadEvent: IPayloadEvent) {
    this.drawingTextHandler.raise(this, payloadEvent);
  }

  public onDrewText(payloadEvent: IPayloadEvent) {
    this.drewTextHandler.raise(this, payloadEvent);
  }
  public onDrawBorderRight(payloadEvent: IPayloadEvent) {
    this.drewBorderRightHandler.raise(this, payloadEvent);
  }
  public onDrawBorderBottom(payloadEvent: IPayloadEvent) {
    this.drewBorderBottomHandler.raise(this, payloadEvent);
  }
  private _getPayloadEvent(payloadCache: PayloadCache): IPayloadEvent {
    const payloadEvent: Partial<IPayloadEvent> = {};
    payloadEvent.col = payloadCache.col;
    payloadEvent.row = payloadCache.row;
    payloadEvent.panel = payloadCache.panel;
    payloadCache.cellBoundingRect = payloadCache.cellBoundingRect;
    payloadEvent.cellValue = payloadCache.cellValue;
    return payloadEvent as IPayloadEvent;
  }
  //!Todo render flex svg raw here;
  public renderFlexSvgRaw(): SVGElement {
    try {
      this.beginRender();
      const colsHeaderPanel = this.flexGrid.columnHeaders;
      const colsFooterPanel = this.flexGrid.columnFooters;
      const cellsPanel = this.flexGrid.cells;
      const rowsHeaderPanel = this.flexGrid.rowHeaders;
      //?draw cells panel and cells frozen
      this._drawRawCellPanel(cellsPanel);
      //?draw cells rows header and cells row header frozen
      this.flexGrid.headersVisibility === 2 && this._drawRawCellPanel(rowsHeaderPanel);
      //?draw cells columns header and cells columns header frozen
      this._drawRawCellPanel(colsHeaderPanel);
      //?draw cells columns footer and cells columns footer frozen
      this._drawRawCellPanel(colsFooterPanel);
      const widthSvg = this.flexGrid.columns.getTotalSize() + 100;
      const heightSvg = this.flexGrid.rows.getTotalSize() + this.flexGrid.columnHeaders.height;
      this.setViewportSize(widthSvg, heightSvg);
      const svgEl = declareNamespaceSvg(this.element as SVGElement);
      return svgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when render raw flex grid SVG!');
    } finally {
      this.endRender();
      //clean cache
      this._payloadCache = {} as PayloadCache;
    }
  }

  //Todo draw draw cell panel:
  private _drawRawCellPanel(panel: GridPanel) {
    const columns = panel.columns;
    const rows = panel.rows;
    const lengthColsHeader = columns.length;
    const lengthRowsHeader = rows.length;
    //!initialize cache data here
    this._payloadCache = {} as PayloadCache;
    this._payloadCache.panel = panel;
    for (let colIndex = 0; colIndex < lengthColsHeader; colIndex++) {
      for (let rowIndex = 0; rowIndex < lengthRowsHeader; rowIndex++) {
        const cellRange = this.flexGrid.getMergedRange(panel, rowIndex, colIndex, false);
        const cellBoundingRect = panel.getCellBoundingRect(rowIndex, colIndex, true);
        const cellValue = panel.getCellData(rowIndex, colIndex, false);
        //!cache data
        this._payloadCache.col = colIndex;
        this._payloadCache.row = rowIndex;
        this._payloadCache.cellBoundingRect = cellBoundingRect;
        this._payloadCache.cellRange = cellRange;
        this._payloadCache.cellValue = cellValue;
        /* đẩy header và body and footer với chiều cao tương ứng */
        if (panel.cellType === CellType.Cell) {
          cellBoundingRect.top += this.flexGrid.columnHeaders.height;
        } else if (panel.cellType === CellType.ColumnFooter) {
          cellBoundingRect.top += this.flexGrid.columnHeaders.height + this.flexGrid.columnHeaders.height;
        }
        //check cell is grouped or not grouped
        if (!cellRange) {
          if (rows[rowIndex].visibleIndex !== -1) {
            const groupEl = this.startGroup();
            //!cache group
            this._payloadCache.group = groupEl;
            this._drawRawRectCell();
            this._drawContentInCell();
            this.endGroup();
          }
        } else {
          if ((rowIndex == cellRange.row && colIndex === cellRange.col && rows[rowIndex].visibleIndex !== -1)) {
            const groupEl = this.startGroup();
            this._payloadCache.group = groupEl;
            this._drawRawRectCell();
            this._drawContentInCell();
            this.endGroup();
          }
        }
      }
    }
  }

  //Todo: draw raw rectangle cell
  private _drawRawRectCell(): void {
    const rect = this._payloadCache.cellBoundingRect;
    const panel = this._payloadCache.panel;
    let cellRange = this._payloadCache.cellRange;
    if (cellRange) {
      for (let index = cellRange.col + 1; index <= cellRange.col2; index++) {
        rect.width += panel.columns[index].renderWidth;
      }
      for (let index = cellRange.row + 1; index <= cellRange.row2; index++) {
        rect.height += panel.rows[index].renderHeight;
      }
    }
    const rectSvgEl = this.drawRect(rect.left, rect.top, rect.width, rect.height);
    const payloadEvent = this._getPayloadEvent(this._payloadCache);
    payloadEvent.svgDrew = rectSvgEl;
    rectSvgEl.setAttribute('fill', 'none'); // default none
    this.onDrewRect(payloadEvent);
    this._drawRawBorderCell();
  }
  //Todo: Draw raw border cell
  private _drawRawBorderCell() {
    const rect = this._payloadCache.cellBoundingRect;
    const payloadEvent = this._getPayloadEvent(this._payloadCache);
    //border bottom
    const lineBottomSvgEl = this.drawLine(rect.left, rect.bottom, rect.right, rect.bottom);
    lineBottomSvgEl.setAttribute('stroke-width', '1px'); //default stroke width = 1px
    lineBottomSvgEl.setAttribute('stroke', 'black'); // default stroke is black
    payloadEvent.svgDrew = lineBottomSvgEl;
    this.onDrawBorderBottom(payloadEvent); //raise event drew border bottom here
    //border right
    const lineRightSvgEl = this.drawLine(rect.right, rect.top, rect.right, rect.bottom);
    lineRightSvgEl.setAttribute('stroke-width', '1px');//default stroke width = 1px
    lineRightSvgEl.setAttribute('stroke', 'black');// default stroke is black
    payloadEvent.svgDrew = lineRightSvgEl;
    this.onDrawBorderRight(payloadEvent);//raise event drew border right here
  }

  private _drawContentInCell() {
    const panel = this._payloadCache.panel;
    const currentCol = this._payloadCache.col;
    const cols = panel.columns;
    const cellValue = this._payloadCache.cellValue;
    if (panel.cellType === CellType.Cell && cols[currentCol].dataType === DataType.Boolean) {
      //case checkbox:
    } else if (cellValue) {
      const payloadEvent = this._getPayloadEvent(this._payloadCache);
      this.onDrawingText(payloadEvent);
      this._payloadCache = { ...this._payloadCache, ...payloadEvent };
      this._drawTextRawInCell();
    }
  }


  //Todo: calculate behavior text raw
  private _calculateBehaviorTextRaw(): BehaviorText {
    try {
      const panel = this._payloadCache.panel;
      const currentCol = this._payloadCache.col;
      const currentRow = this._payloadCache.row;
      const cellValue = this._payloadCache.cellValue;
      const cellBoundingRect = this._payloadCache.cellBoundingRect;
      let paddingLeft = this.cellPadding.paddingLeft;
      let paddingRight = this.cellPadding.paddingRight;
      let paddingTop = this.cellPadding.paddingTop;
      let xTextDefault = cellBoundingRect.left + paddingLeft;
      const yTextDefault = cellBoundingRect.top + paddingTop;
      let alginText = panel.columns[currentCol].align || 'left'; //default left
      if (panel.rows[currentRow] instanceof GroupRow) {
        xTextDefault += (panel.rows[currentRow] as GroupRow).level * 12;
        alginText = panel.rows[currentRow].align || 'left';//default left
      }
      const behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(xTextDefault, yTextDefault), textAnchor: 'start' };
      const dimensionOfText = BravoGraphicsRenderer.measureString(cellValue, this.fontDefault, cellBoundingRect.width, false);
      let isFitContent: boolean = (dimensionOfText?.width || 0) <= (cellBoundingRect.width - paddingLeft - paddingRight);
      switch (alginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          behaviorTextBase.textAnchor = 'start';
          behaviorTextBase.isTextFitWidthCell = isFitContent;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (isFitContent) {
            behaviorTextBase.point!.x += (cellBoundingRect.width) / 2 - paddingRight;
            behaviorTextBase.textAnchor = 'middle';
            behaviorTextBase.isTextFitWidthCell = true;
            return (behaviorTextBase as BehaviorText);
          }
          behaviorTextBase.isTextFitWidthCell = false;
          return (behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.End:
          if (isFitContent) {
            behaviorTextBase.point!.x += (cellBoundingRect.width - paddingRight - paddingLeft);
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
  }

  //Todo: draw text raw in cell
  private _drawTextRawInCell(): SVGElement | null {
    const textBehavior = this._calculateBehaviorTextRaw();
    //!cache text behavior
    this._payloadCache.behaviorText = textBehavior;
    if (!textBehavior.isTextFitWidthCell) {
      return this._wrapTextRawIntoSvg();
    }
    const textSvgEl = drawText(this._payloadCache.cellValue, textBehavior as BehaviorText, this.stylesHostElement);
    textSvgEl.setAttribute('fill', this.stylesHostElement.color);
    this._payloadCache.group.appendChild(textSvgEl);
    copyTextStyles(textSvgEl, this.stylesHostElement);
    return textSvgEl as SVGElement;
  }

  //Todo: wrap svg text raw in cell
  private _wrapTextRawIntoSvg(): SVGElement | null {
    try {
      const rectSvg: Partial<DOMRect> = {};
      rectSvg.width = this._payloadCache.cellBoundingRect.width - this.cellPadding.paddingLeft - this.cellPadding.paddingRight;
      rectSvg.height = this._payloadCache.cellBoundingRect.height || 0;
      if (rectSvg.width <= 0 || rectSvg.height <= 0) {
        return null;
      }
      rectSvg.x = this._payloadCache.behaviorText.point.x;
      rectSvg.y = this._payloadCache.behaviorText.point.y;
      const svgWrapText = creatorSVG(rectSvg);
      const textSvgEl = drawText(this._payloadCache.cellValue, this._payloadCache.behaviorText as BehaviorText, this.stylesHostElement, 'preserve');
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
}
