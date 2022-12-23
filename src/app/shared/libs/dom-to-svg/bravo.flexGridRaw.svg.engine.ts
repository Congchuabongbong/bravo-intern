import { Point, Rect, Event as wjEven } from '@grapecity/wijmo';
import { FlexGrid, GroupRow, GridPanel, CellRange } from '@grapecity/wijmo.grid';
import { BravoSvgEngine } from './bravo.svg.engine';
import { IPayloadEvent, PayloadCache } from './core/type.util';
export class FlexGridSvgEngineRaw extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public captureElement!: Element;
  public captureElementCoordinates!: Point;
  public flexGrid!: FlexGrid;
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
  //*method
  public changeOriginCoordinates(elRect: Rect): Rect {
    const boundingRect = Rect.fromBoundingRect(elRect);
    boundingRect.left -= this.captureElementCoordinates.x;
    boundingRect.top -= this.captureElementCoordinates.y;
    return boundingRect;
  }

  renderFlexSvgRaw() {
    this.beginRender();
    this.DrawCellPanel(this.flexGrid.cells);
    this.DrawCellPanel(this.flexGrid.columnHeaders);
    const widthSvg = this.flexGrid.columns.getTotalSize();
    const heightSvg = this.flexGrid.rows.getTotalSize() + this.flexGrid.columnHeaders.height + 100;
    this.setViewportSize(widthSvg, heightSvg);
    this.endRender();
  }

  public DrawColsHeaderPanel(): void {
    const columnsHeader = this.flexGrid.columnHeaders;
    const columns = columnsHeader.columns;
    const rows = columnsHeader.rows;
    const lengthColsHeader = columns.length;
    const lengthRowsHeader = rows.length;
    for (let columnIndex = 0; columnIndex < lengthColsHeader; columnIndex++) {
      for (let rowIndex = 0; rowIndex < lengthRowsHeader; rowIndex++) {
        const cellMergeRange = this.flexGrid.getMergedRange(columnsHeader, rowIndex, columnIndex, false);
        const cellBoundingRect = columnsHeader.getCellBoundingRect(rowIndex, columnIndex, true);
        if (cellMergeRange && rowIndex == cellMergeRange.row && columnIndex === cellMergeRange.col) {
          const numberOfRow = cellMergeRange.row2 - cellMergeRange.row + 1;
          const numberOfColumn = cellMergeRange.col2 - cellMergeRange.col + 1;
          console.log(numberOfColumn);
          const widthCell = cellBoundingRect.width * numberOfColumn;
          const heightCell = cellBoundingRect.height * numberOfRow;
          const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, widthCell, heightCell);
          rectSvgEl.setAttribute('fill', 'none');
          rectSvgEl.setAttribute('stroke', 'red');
        }
        if (!cellMergeRange) {
          const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, cellBoundingRect.width, cellBoundingRect.height);
          rectSvgEl.setAttribute('fill', 'none');
          rectSvgEl.setAttribute('stroke', 'red');
        }
      }
    }
  }

  public DrawCellPanel(panel: GridPanel, viewRange?: CellRange) {
    const columns = panel.columns;
    const rows = panel.rows;
    const lengthColsHeader = columns.length;
    const lengthRowsHeader = rows.length;
    for (let columnIndex = 0; columnIndex < lengthColsHeader; columnIndex++) {
      for (let rowIndex = 0; rowIndex < lengthRowsHeader; rowIndex++) {
        const cellMergeRange = this.flexGrid.getMergedRange(panel, rowIndex, columnIndex, false);
        const cellBoundingRect = this.changeOriginCoordinates(panel.getCellBoundingRect(rowIndex, columnIndex, false));
        if (cellMergeRange && rowIndex == cellMergeRange.row && columnIndex === cellMergeRange.col) {
          const numberOfRow = cellMergeRange.row2 - cellMergeRange.row + 1;
          const numberOfColumn = cellMergeRange.col2 - cellMergeRange.col + 1;
          console.log(numberOfColumn);
          const widthCell = cellBoundingRect.width * numberOfColumn;
          const heightCell = cellBoundingRect.height * numberOfRow;
          const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, widthCell, heightCell);
          rectSvgEl.setAttribute('fill', 'none');
          rectSvgEl.setAttribute('stroke', 'red');
        }
        if (!cellMergeRange) {
          const rectSvgEl = this.drawRect(cellBoundingRect.left, cellBoundingRect.top, cellBoundingRect.width, cellBoundingRect.height);
          rectSvgEl.setAttribute('fill', 'none');
          rectSvgEl.setAttribute('stroke', 'red');
        }
      }
    }
  }



}
