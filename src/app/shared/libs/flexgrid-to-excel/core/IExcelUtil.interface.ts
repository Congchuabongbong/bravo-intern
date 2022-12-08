
import { FlexGrid } from '@grapecity/wijmo.grid';
import { Row, Worksheet, Column, Workbook } from 'exceljs';
import { Event as wjEven, ObservableArray } from '@grapecity/wijmo';
import ExcelFlexUtil, { DataPayload } from '../excel.class';
export default interface IExcelFlexUtil {
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
  rowInserted: wjEven<Worksheet, DataPayload<Row>>;
  rowGroupInserted: wjEven<Worksheet, DataPayload<Row>>;
  worksheetCommitting: wjEven<ExcelFlexUtil, Worksheet>;
  onColumnsHeaderInserted: (ws: Worksheet, cols?: DataPayload<Partial<Column>[]>) => void;
  onRowInserted: (ws: Worksheet, payload: DataPayload<Row>) => void;
  onWorksheetCommitting: () => void;
  onRowGroupInserted: (ws: Worksheet, payload: DataPayload<Row>) => void;
  exportExcelAction: () => void;
  creatorWorkSheet?: () => Worksheet;
  cleanupEvents: () => void;
  getElement: (selector: string) => HTMLElement | null;
}
