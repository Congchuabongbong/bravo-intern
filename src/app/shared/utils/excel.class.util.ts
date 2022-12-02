import { FlexGrid } from '@grapecity/wijmo.grid';
import { AddWorksheetOptions, Row, Style, Worksheet, Column, Workbook, Cell } from 'exceljs';
import { Event as wjEven, CollectionViewGroup, ObservableArray } from '@grapecity/wijmo';
import { generateColumnsExcel, getStyleExcelFromStyleElement } from './excel.method.ultil';
import * as FileSaver from 'file-saver';

export interface IExcelFlexUtil {
  flexGrid: FlexGrid;
  hostElement: HTMLElement;
  worksheet: Worksheet;
  workbook: Workbook;
  alternatingRowStep: number;
  selectorCellBase: string;
  cellBaseElement: HTMLElement | null;
  columnsHeader: ObservableArray<Partial<Column>>;
  columnsHeaderInserted: wjEven<Worksheet, DataPayload<Partial<Column>[]>>;
  idImgs: ObservableArray<number>;
  defaultHeight: number;
  maxGroupLevel: number;
  onColumnsHeaderInserted: (ws: Worksheet, cols?: DataPayload<Partial<Column>[]>) => void;
  rowInserted: wjEven<Worksheet, DataPayload<Row>>;
  onRowInserted: (ws: Worksheet, payload: DataPayload<Row>) => void;
  worksheetCommitting: wjEven<ExcelFlexUtil, Worksheet>;
  onWorksheetCommitting: () => void;
  exportExcelAction: () => Promise<void>;
  creatorWorkSheet: () => Worksheet;
  cleanEvent: () => void;
  getElement: (selector: string) => HTMLElement | null;
}

export class DataPayload<T> {
  /**
  * Gets the index of the data item in the list.
  */
  public readonly index?: number;
  /**
   * Gets the data item being formatted.
   */
  public readonly data!: T;

  public readonly item!: any;
  public readonly level?: number;
  constructor(_data: T, _item?: any, _index?: number, _level?: number) {
    this.index = _index;
    this.item = _item;
    this.data = _data;
    this.level = _level;
  }
}
export class ExcelFlexUtil implements IExcelFlexUtil {
  //*declaration properties
  public flexGrid!: FlexGrid;
  public hostElement!: HTMLElement;
  public workbook: Workbook = new Workbook();
  public worksheet: Worksheet = this.workbook.addWorksheet();
  public alternatingRowStep!: number;
  public cellBaseElement!: HTMLElement | null;
  public columnsHeader!: ObservableArray<Partial<Column>>;
  public idImgs: ObservableArray<number> = new ObservableArray([]);
  public defaultHeight!: number;
  public maxGroupLevel!: number;
  private _selectorCellBase: string = '.wj-cell:not(.wj-state-active)[role~="gridcell"]';
  set selectorCellBase(value: string) {
    this._selectorCellBase = value;
    this.cellBaseElement = this.getElement(this.selectorCellBase);
  }
  get selectorCellBase(): string {
    return this._selectorCellBase;
  };
  //*event
  public columnsHeaderInserted: wjEven<Worksheet, DataPayload<Partial<Column>[]>> = new wjEven<Worksheet, DataPayload<Partial<Column>[]>>();
  public rowInserted: wjEven<Worksheet, DataPayload<Row>> = new wjEven<Worksheet, DataPayload<Row>>;
  public rowGroupInserted: wjEven<Worksheet, DataPayload<Row>> = new wjEven<Worksheet, DataPayload<Row>>;
  public worksheetCommitting: wjEven<ExcelFlexUtil, Worksheet> = new wjEven<ExcelFlexUtil, Worksheet>();
  //*constructor
  constructor(_flexGrid: FlexGrid) {
    this.flexGrid = _flexGrid;
    this.hostElement = this.flexGrid.hostElement;
    this.alternatingRowStep = this.flexGrid.alternatingRowStep;
    this.columnsHeader = generateColumnsExcel(this.flexGrid.columns);
    this.cellBaseElement = this.getElement(this._selectorCellBase);
    this.defaultHeight = this.flexGrid.rows.defaultSize;
    this.maxGroupLevel = this.flexGrid.rows.maxGroupLevel;
  }
  //*raise event
  public onRowInserted(ws: Worksheet, payload: DataPayload<Row>): void {
    this.rowInserted.hasHandlers && this.rowInserted.raise(ws, payload);
  };
  public onRowGroupInserted(ws: Worksheet, payload: DataPayload<Row>): void {
    this.rowGroupInserted.hasHandlers && this.rowGroupInserted.raise(ws, payload);
  };

  public onColumnsHeaderInserted(ws: Worksheet, cols?: DataPayload<Partial<Column>[]>): void {
    this.columnsHeaderInserted.hasHandlers && this.columnsHeaderInserted.raise(ws, cols);
  };

  public onWorksheetCommitting() {
    this.worksheetCommitting.hasHandlers && this.worksheetCommitting.raise(this, this.worksheet);
  };
  //*method here
  creatorWorkSheet(name?: string | undefined, options?: Partial<AddWorksheetOptions> | undefined): Worksheet {
    this.worksheet = this.workbook.addWorksheet(name, options);
    return this.worksheet;
  };
  public async exportExcelAction(): Promise<void> {
    //add columns header
    try {
      const cols = this.worksheet.columns = this.columnsHeader;
      const colsPayload = new DataPayload<Partial<Column>[]>(cols);
      this.onColumnsHeaderInserted(this.worksheet, colsPayload);
      if (this.flexGrid.rows.maxGroupLevel !== -1) {
        this.insertRowGroup(this.flexGrid.collectionView.groups);
      } else {
        this.flexGrid.collectionView.items.forEach((item: any, index: number) => {
          const row = this.worksheet.addRow(item);
          row.height = this.flexGrid.rows[index].renderHeight;
          const payload = new DataPayload<Row>(row, item, index);
          this.onRowInserted(this.worksheet, payload);
          row.commit();
        });
      }
      this.onWorksheetCommitting();
      this.worksheet.commit;
      const buf = await this.workbook.xlsx.writeBuffer();
      FileSaver.saveAs(new Blob([buf]), `demo.xlsx`);
    } catch (error) {
      new Error('Error occurred when exported excel!!');
    } finally {
      this.cleanEvent();
    }
  }

  public addImageIntoWorkBookByBuffer(buffer: ArrayBuffer, extension: 'png' | 'jpeg'): number {
    let idImg = this.workbook.addImage({ buffer, extension });
    this.idImgs.push(idImg);
    return idImg;
  }
  public async addImageIntoWorkBookByUrl(url: string, extension: 'png' | 'jpeg'): Promise<number> {
    const bufferArr = await ExcelFlexUtil.getArrayBufferFromUrl(url);
    const idImg = this.addImageIntoWorkBookByBuffer(bufferArr, extension);
    this.idImgs.push(idImg);
    return idImg;
  }
  public static addStyleForCell(cell: Cell, style: Partial<CSSStyleDeclaration>, baseElement?: HTMLElement, styleOps?: Partial<Style>): void {
    cell.style = getStyleExcelFromStyleElement(style, baseElement, styleOps);
  }
  public static async getArrayBufferFromUrl(url: string): Promise<ArrayBuffer> {
    const data = await fetch(url);
    const blob = await data.blob();
    return blob.arrayBuffer();
  };
  public mergeCells(row: Row, from: number, to: number): void {
    this.worksheet.mergeCells(`${row.getCell(from).address}:${row.getCell(to).address}`);
  }

  public getElement(selector: string): HTMLElement | null {
    return this.hostElement.querySelector(selector);
  };

  private insertRowGroup(groups: CollectionViewGroup[]): void {
    groups.forEach((group: CollectionViewGroup) => {
      const rowGroup = this.worksheet.addRow([`${group.name}: ${group.items.length} items`]);
      rowGroup.outlineLevel = group.level;
      rowGroup.height = this.defaultHeight;
      this.mergeCells(rowGroup, 1, this.worksheet.columns.length);
      const payload = new DataPayload<Row>(rowGroup, group.items, undefined, group.level);
      this.onRowGroupInserted(this.worksheet, payload);
      if (group.groups.length > 0) {
        this.insertRowGroup(group.groups);
      }
      if (group.level === this.maxGroupLevel) {
        group.items.forEach((item: any, index: number) => {
          const row = this.worksheet.addRow(item);
          row.outlineLevel = this.maxGroupLevel + 1;
          row.height = this.flexGrid.rows[index].renderHeight;
          const payload = new DataPayload<Row>(row, item, this.flexGrid.collectionView.items.indexOf(item));
          this.onRowInserted(this.worksheet, payload);
          row.commit();
        });
      }
      rowGroup.commit();
    });
  }

  cleanEvent() {
    this.rowInserted.hasHandlers && this.rowInserted.removeAllHandlers();
    this.rowGroupInserted.hasHandlers && this.rowGroupInserted.removeAllHandlers();
    this.columnsHeaderInserted.hasHandlers && this.columnsHeaderInserted.removeAllHandlers();
    this.worksheetCommitting.hasHandlers && this.columnsHeaderInserted.removeAllHandlers();
  };
}
