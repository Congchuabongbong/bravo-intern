import { FlexGrid } from '@grapecity/wijmo.grid';
import { Row, Style, Worksheet, Column, Workbook, Cell } from 'exceljs';
import { Event as wjEven, CollectionViewGroup, ObservableArray } from '@grapecity/wijmo';
import { generateColumnsExcel, getStyleExcelFromStyleElement } from './excel.method';
import * as FileSaver from 'file-saver';
import { IExcelFlexUtil } from './IExcelUtil.interface';

export class DataPayload<T> {
  public readonly index?: number;
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
export default class ExcelFlexUtil implements IExcelFlexUtil {
  //*declaration properties
  public flexGrid!: FlexGrid;
  public hostElement!: HTMLElement;
  public workbook: Workbook;
  public worksheet: Worksheet;
  public alternatingRowStep!: number;
  public cellBaseElement!: HTMLElement | null;
  public columnsHeader!: ObservableArray<Partial<Column>>;
  public idImgs: ObservableArray<number> = new ObservableArray([]);
  public defaultHeight!: number;
  public maxGroupLevel!: number;
  private _selectorCellBase!: string;
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
    //TODO lazy initialize
    this._selectorCellBase = '.wj-cell:not(.wj-state-active)[role~="gridcell"]';
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('My Sheet', { views: [{ showGridLines: false }] });
    //TODO initialize properties of class
    this.flexGrid = _flexGrid;
    this.hostElement = this.flexGrid.hostElement;
    this.alternatingRowStep = this.flexGrid.alternatingRowStep;
    this.columnsHeader = generateColumnsExcel(this.flexGrid.columns);
    this.cellBaseElement = this.getElement(this._selectorCellBase);
    this.defaultHeight = this.flexGrid.rows.defaultSize;
    this.maxGroupLevel = this.flexGrid.rows.maxGroupLevel;
  }
  //*raise event
  /**
  * @desc : raise event when row inserted
  * @param ws worksheet parameter
  * @param payload attached data
  * @return void
  */
  public onRowInserted(ws: Worksheet, payload: DataPayload<Row>): void {
    this.rowInserted.hasHandlers && this.rowInserted.raise(ws, payload);
  };
  /**
  * @desc : raise event when row group inserted
  * @param ws worksheet parameter
  * @param payload attached data
  * @return void
  */
  public onRowGroupInserted(ws: Worksheet, payload: DataPayload<Row>): void {
    this.rowGroupInserted.hasHandlers && this.rowGroupInserted.raise(ws, payload);
  };
  /**
   * @desc : raise event when column header inserted
   * @param ws worksheet parameter
   * @param cols attached data
   * @return void
   */
  public onColumnsHeaderInserted(ws: Worksheet, cols?: DataPayload<Partial<Column>[]>): void {
    this.columnsHeaderInserted.hasHandlers && this.columnsHeaderInserted.raise(ws, cols);
  };
  /**
   * @desc : raise event when column header inserted
   * @return void
   */
  public onWorksheetCommitting() {
    this.worksheetCommitting.hasHandlers && this.worksheetCommitting.raise(this, this.worksheet);
  };
  //*method here
  /**
    * @desc : export action use to generate excel
    * @return void
    */
  public exportExcelAction(): void {
    //add columns header
    try {
      const cols = this.worksheet.columns = this.columnsHeader;
      const colsPayload = new DataPayload<Partial<Column>[]>(cols);
      this.onColumnsHeaderInserted(this.worksheet, colsPayload);
      if (this.flexGrid.rows.maxGroupLevel !== -1) {
        this.insertRowGroup(this.flexGrid.collectionView.groups);
      } else {
        this.flexGrid.collectionView.items.forEach((item: any, index: number) => {
          this.insertRow(item, index);
        });
      }
      this.onWorksheetCommitting();
      this.worksheet.commit;
    } catch (error) {
      throw new Error('Error occurred when exported excel!!');
    } finally {
      this.cleanEvents();
    }
  }
  /**
    * @desc used to save excel file after generating excel
    * @param fileName name file default value = 'myExcel'
    * @return Promise<void>
    */
  public async saveFileAction(fileName: string = 'myExcel'): Promise<void> {
    const buf = await this.workbook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buf]), `${fileName}.xlsx`);
  }
  /**
     * @desc used to save add image into workbook by buffer
     * @param buffer : ArrayBuffer
     * @param extension : extension of image
     * @return number
     */
  public addImageIntoWorkBookByBuffer(buffer: ArrayBuffer, extension: 'png' | 'jpeg'): number {
    let idImg = this.workbook.addImage({ buffer, extension });
    this.idImgs.push(idImg);
    return idImg;
  }
  /**
    * @desc used to save add image into workbook by url
    * @param url : url of image
    * @param extension : extension of image
    * @return  Promise number
    */
  public async addImageIntoWorkBookByUrl(url: string, extension: 'png' | 'jpeg'): Promise<number> {
    const bufferArr = await ExcelFlexUtil.getArrayBufferFromUrl(url);
    const idImg = this.addImageIntoWorkBookByBuffer(bufferArr, extension);
    this.idImgs.push(idImg);
    return idImg;
  }

  /**
   * @desc static method used to style for cell.
   * @param cell cell object (cell of excelJs)
   * @param style  Partial CSSStyleDeclaration
   * @param baseElement HTMLElement object
   * @param styleOps Partial Style object (style of excelJs)
   * @return  void
   */
  public static addStyleForCell(cell: Cell, style: Partial<CSSStyleDeclaration>, baseElement?: HTMLElement, styleOps?: Partial<Style>): void {
    cell.style = getStyleExcelFromStyleElement(style, baseElement, styleOps);
  }
  /**
    * @desc static method used to get array buffer from ulr.
    * @param url url of image
    * @return  Promise ArrayBuffer
    */
  public static async getArrayBufferFromUrl(url: string): Promise<ArrayBuffer> {
    const data = await fetch(url);
    const blob = await data.blob();
    return blob.arrayBuffer();
  };
  /**
      * @desc use to merge cell
      * @param row row object
      * @param from from number
      * @param to to number
      * @return void
      */
  public mergeCells(row: Row, from: number, to: number): void {
    this.worksheet.mergeCells(`${row.getCell(from).address}:${row.getCell(to).address}`);
  }
  /**
  * @desc use to get element in host element
  * @param selector string
  * @return HTMLElement | null
  */
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
      if (!group.isBottomLevel) {
        this.insertRowGroup(group.groups);
      }
      if (group.level === this.maxGroupLevel) {
        group.items.forEach((item: any, index: number) => {
          this.insertRow(item, index, true);
        });
      }
      rowGroup.commit();
    });
  }

  public insertRow(item: any, index: number, isOutlineLevel?: boolean): void {
    const row = this.worksheet.addRow(item);
    if (isOutlineLevel) {
      row.outlineLevel = this.maxGroupLevel + 1;
    }
    row.height = this.flexGrid.rows[index].renderHeight;
    const payload = new DataPayload<Row>(row, item, this.flexGrid.collectionView.items.indexOf(item));
    this.onRowInserted(this.worksheet, payload);
    row.commit();
  }
  /**
  * @desc use to clean all event
  * @return void
  */
  public cleanEvents(): void {
    this.rowInserted.hasHandlers && this.rowInserted.removeAllHandlers();
    this.rowGroupInserted.hasHandlers && this.rowGroupInserted.removeAllHandlers();
    this.columnsHeaderInserted.hasHandlers && this.columnsHeaderInserted.removeAllHandlers();
    this.worksheetCommitting.hasHandlers && this.columnsHeaderInserted.removeAllHandlers();
  };
}
