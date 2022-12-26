import { Point, Rect, Event as wjEven, DataType } from '@grapecity/wijmo';
import { FlexGrid, GroupRow, GridPanel, CellRange, CellType } from '@grapecity/wijmo.grid';
import { Font } from './bravo-graphics/font';
import { BravoSvgEngine } from './bravo.svg.engine';
import { drawText } from './core/svg.engine.util';
import { copyTextStyles } from './core/text.util';
import { IPayloadEvent, PayloadCache, BehaviorText } from './core/type.util';
export class FlexGridSvgEngineRaw extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public flexGrid!: FlexGrid;
  public stylesHostElement!: CSSStyleDeclaration;
  public font!: Font;
  public _payloadCache!: PayloadCache;
  constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
    super(_anchorElement);
    this.anchorElement = _anchorElement;
    this.flexGrid = _flex;
    this.stylesHostElement = getComputedStyle(this.flexGrid.hostElement);
    this.font = new Font(this.stylesHostElement.fontFamily, this.stylesHostElement.fontSize, this.stylesHostElement.fontWeight);
  };
  //**Draw By Dom here */
  //**events declared here
  public drewRect = new wjEven<FlexGridSvgEngineRaw, IPayloadEvent>();
  public drawingText = new wjEven<FlexGridSvgEngineRaw, IPayloadEvent>();
  public drewText = new wjEven<FlexGridSvgEngineRaw, IPayloadEvent>();
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


  renderFlexSvgRaw(): SVGElement {
    try {
      this.beginRender();
      this.DrawCellPanel(this.flexGrid.cells);
      this.DrawCellPanel(this.flexGrid.columnHeaders);
      const widthSvg = this.flexGrid.columns.getTotalSize() + 100;
      const heightSvg = this.flexGrid.rows.getTotalSize() + this.flexGrid.columnHeaders.height;
      this.setViewportSize(widthSvg, heightSvg);
      return this.element as SVGElement;
    } catch (error) {
      console.error(error);
      throw new Error('');
    } finally {
      this.endRender();
    }
  }



  private _drawContentInCell(): SVGElement | null | void {
    let currentRow = this._payloadCache.row;
    let currentCol = this._payloadCache.col;
    let cellBoundingRect = this._payloadCache.cellBoundingRect;
    let cellValue = this._payloadCache.panel.getCellData(currentRow, currentCol, true);
    let dataType = this._payloadCache.panel.columns[currentCol].dataType;
    if (!cellValue) return null;
    if (this._payloadCache.panel.cellType !== CellType.Cell) {
      const pointText = new Point(cellBoundingRect.left + 8, (cellBoundingRect.top + 8));
      const textBehavior: Partial<BehaviorText> = {};
      textBehavior.dominantBaseline = 'hanging';
      textBehavior.textAnchor = 'start';
      textBehavior.point = pointText;
      const textSvgEl = drawText(cellValue, textBehavior as BehaviorText, this.stylesHostElement);
      textSvgEl.setAttribute('fill', this.stylesHostElement.color);
      this.element.append(textSvgEl);
      copyTextStyles(textSvgEl, this.stylesHostElement);
      return textSvgEl as SVGElement;
    }
    return null;
  }






  private _drawRectCell(rect: Rect, cellRange: CellRange | null) {
    let widthCell = rect.width;
    let heightCell = rect.height;
    if (cellRange) {
      const numberOfRow = cellRange.row2 - cellRange.row + 1;
      const numberOfColumn = cellRange.col2 - cellRange.col + 1;
      widthCell = widthCell * numberOfColumn;
      heightCell = heightCell * numberOfRow;
    }
    const rectSvgEl = this.drawRect(rect.left, rect.top, widthCell, heightCell);
    rectSvgEl.setAttribute('fill', 'none');
    rectSvgEl.setAttribute('stroke', 'black');
  }
  private _drawBorderCell() { }


  public DrawCellPanel(panel: GridPanel, viewRange?: CellRange) {
    const columns = panel.columns;
    const rows = panel.rows;
    const lengthColsHeader = columns.length;
    const lengthRowsHeader = rows.length;
    this._payloadCache = {} as PayloadCache;
    this._payloadCache.panel = panel;
    for (let colIndex = 0; colIndex < lengthColsHeader; colIndex++) {
      for (let rowIndex = 0; rowIndex < lengthRowsHeader; rowIndex++) {
        const cellMergeRange = this.flexGrid.getMergedRange(panel, rowIndex, colIndex, false);
        const cellBoundingRect = panel.getCellBoundingRect(rowIndex, colIndex, true);
        this._payloadCache.col = colIndex;
        this._payloadCache.row = rowIndex;
        this._payloadCache.cellBoundingRect = cellBoundingRect;
        /* đẩy header và body and footer với chiều cao tương ứng */
        if (panel.cellType === CellType.Cell) {
          cellBoundingRect.top += this.flexGrid.columnHeaders.height;
        } else if (panel.cellType === CellType.ColumnFooter) {
          cellBoundingRect.top += this.flexGrid.columnHeaders.height + this.flexGrid.columnHeaders.height;
        }
        if (!cellMergeRange) {
          this._drawRectCell(cellBoundingRect, null);
          this._drawContentInCell();
        } else if (cellMergeRange && rowIndex == cellMergeRange.row && colIndex === cellMergeRange.col) {
          this._drawRectCell(cellBoundingRect, cellMergeRange); //?draw rectangle
          this._drawContentInCell();
        }
      }
    }
  }







}
