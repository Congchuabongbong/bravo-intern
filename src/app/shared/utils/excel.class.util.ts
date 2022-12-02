import { FlexGrid } from '@grapecity/wijmo.grid';
import { Alignment, AddWorksheetOptions, Color, Font, Row, Style, Worksheet, Column, Workbook, Cell } from 'exceljs';
import { Control, EventArgs, addClass, Binding, Event as wjEven, CollectionView, isDate, ObservableArray } from '@grapecity/wijmo';
import { FormatItemEventArgs } from '@grapecity/wijmo.input';
import { generateColumnsExcel } from './excel.method.ultil';
import * as FileSaver from 'file-saver';
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
  constructor(_data: T, _item?: any, _index?: number) {
    this.index = _index;
    this.item = _item;
    this.data = _data;
  }
}

interface IExcelFlexUtil {
  flexGrid: FlexGrid;
  hostElement: HTMLElement;
  worksheet: Worksheet;
  workbook: Workbook;
  alternatingRowStep: number;
  selectorCellBase: string;
  cellBaseElement: HTMLElement | null;
  columnsHeader: ObservableArray<Partial<Column>>;
  columnsHeaderInserted: wjEven<Worksheet, Partial<Column>[]>;
  onColumnsHeaderInserted: (ws: Worksheet, cols?: Partial<Column>[]) => void;
  rowChanged: wjEven<Worksheet, FormatItemEventArgs>;
  onRowChanged: () => void;
  rowChanging: wjEven<Worksheet, FormatItemEventArgs>;
  onRowChanging: () => void;
  cellChanged: wjEven<Worksheet, FormatItemEventArgs>;
  onCellChanged: () => void;
  cellChanging: wjEven<Worksheet, FormatItemEventArgs>;
  onCellChanging: () => void;
  rowCommitted: wjEven<Worksheet, Row>;
  rowCommitting: wjEven<Worksheet, Row>;
  cellCommitting: wjEven<Row, Cell>;
  cellCommitted: wjEven<Row, Cell>;
  exportExcelAction: () => Promise<void>;
  creatorWorkSheet: () => Worksheet;
  cleanEvent: () => void;
  getElement: (selector: string) => HTMLElement | null;
  // addRow: () => void;
  // mergeCell: () => void;
}



export class ExcelFlexUtil {
  //*declaration properties
  public flexGrid!: FlexGrid;
  public hostElement!: HTMLElement;
  public workbook: Workbook = new Workbook();
  public worksheet: Worksheet = this.workbook.addWorksheet();
  public alternatingRowStep!: number;
  private _selectorCellBase: string = '.wj-cell:not(.wj-state-active)[role~="gridcell"]';
  public cellBaseElement!: HTMLElement | null;
  public columnsHeader!: ObservableArray<Partial<Column>>;
  public columnsHeaderInserted: wjEven<Worksheet, DataPayload<Partial<Column>[]>> = new wjEven<Worksheet, DataPayload<Partial<Column>[]>>();
  public rowInserted: wjEven<Worksheet, DataPayload<Row>> = new wjEven<Worksheet, DataPayload<Row>>;
  public imgs: ObservableArray<number> = new ObservableArray([]);
  // public rowChanging!: wjEven<Worksheet, FormatItemEventArgs>;
  // public rowCommitted!: wjEven<Worksheet, Row>;
  // public rowCommitting!: wjEven<Worksheet, Row>;


  set selectorCellBase(value: string) {
    this._selectorCellBase = value;
    this.cellBaseElement = this.getElement(this.selectorCellBase);
  }
  get selectorCellBase(): string {
    return this._selectorCellBase;
  }
  //*constructor
  constructor(_flexGrid: FlexGrid) {
    this.flexGrid = _flexGrid;
    this.hostElement = this.flexGrid.hostElement;
    this.alternatingRowStep = this.flexGrid.alternatingRowStep;
    this.columnsHeader = generateColumnsExcel(this.flexGrid.columns);
    this.cellBaseElement = this.getElement(this._selectorCellBase);
  }

  //raise event
  public onRowInserted(ws: Worksheet, payload: DataPayload<Row>): void {
    this.rowInserted.hasHandlers && this.rowInserted.raise(ws, payload);
  };


  public onColumnsHeaderInserted(ws: Worksheet, cols?: DataPayload<Partial<Column>[]>): void {
    this.columnsHeaderInserted.hasHandlers && this.columnsHeaderInserted.raise(ws, cols);
  };

  //*method here
  creatorWorkSheet(name?: string | undefined, options?: Partial<AddWorksheetOptions> | undefined): Worksheet {
    this.worksheet = this.workbook.addWorksheet(name, options);
    return this.worksheet;
  };

  public async exportExcelAction(): Promise<void> {
    //add columns header
    const cols = this.worksheet.columns = this.columnsHeader;

    const colsPayload = new DataPayload<Partial<Column>[]>(cols);
    this.onColumnsHeaderInserted(this.worksheet, colsPayload);
    if (this.flexGrid.collectionView.groups && this.flexGrid.collectionView.groups.length) {

    } else {
      this.flexGrid.collectionView.items.forEach((item: any, index: number) => {
        const row = this.worksheet.addRow(item);
        const payload = new DataPayload<Row>(row, item, index);
        this.onRowInserted(this.worksheet, payload);
      });
    }
    this.worksheet.commit;
    //read buffer and fileSaver
    const buf = await this.workbook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buf]), `demo.xlsx`);
    this.cleanEvent();
  }

  public addImageIntoWorkBookByBuffer(buffer: ArrayBuffer, extension: 'png' | 'jpeg'): number {
    let idImg = this.workbook.addImage({ buffer, extension });
    this.imgs.push(idImg);
    return idImg;
  }
  public async addImageIntoWorkBookByUrl(url: string, extension: 'png' | 'jpeg'): Promise<number> {
    const bufferArr = await this.getArrayBufferFromUrl(url);
    const idImg = this.addImageIntoWorkBookByBuffer(bufferArr, extension);
    this.imgs.push(idImg);
    return idImg;
  }
  async getArrayBufferFromUrl(url: string): Promise<ArrayBuffer> {
    const data = await fetch(url);
    const blob = await data.blob();
    return blob.arrayBuffer();
  };
  getElement(selector: string): HTMLElement | null {
    return this.hostElement.querySelector(selector);
  };
  cleanEvent() {
    this.rowInserted.hasHandlers && this.rowInserted.removeAllHandlers();
    // this.rowChanging.hasHandlers && this.rowChanging.removeAllHandlers();
  };





}
