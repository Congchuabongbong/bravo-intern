import { Component, OnInit } from '@angular/core';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-test-excel-js',
  templateUrl: './test-excel-js.component.html',
  styleUrls: ['./test-excel-js.component.scss']
})
export class TestExcelJsComponent implements OnInit {
  public workbook = new Excel.Workbook();
  public worksheet!: Excel.Worksheet;
  constructor() { }

  initialWorkBook(creator: string, lastModifiedBy: string, created: Date, modified: Date, lastPrinted: Date) {
    this.workbook.creator = creator;
    this.workbook.lastModifiedBy = lastModifiedBy;
    this.workbook.created = created;
    this.workbook.modified = modified;
    this.workbook.lastPrinted = lastPrinted;
    this.workbook.views = [{
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 0, visibility: 'visible'
    }];
  }

  initialWorkSheet(name: string, optionConfig?: Partial<Excel.AddWorksheetOptions> | undefined) {
    this.worksheet = this.workbook.addWorksheet(name, optionConfig);
    this.workbook.addWorksheet('12', optionConfig);
  }
  async ngOnInit(): Promise<void> {
    //**option config Excel */
    const optionConfig: Partial<Excel.AddWorksheetOptions> = {
      properties: {
        tabColor: { argb: 'FFC0000' },
      },
      views: [{ showGridLines: true, state: 'frozen', xSplit: 1, ySplit: 1 }],
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
      },
      headerFooter: {
        oddFooter: "Page &P of &N",
        oddHeader: 'Odd Page'
      },
    };
    //**initialize workBook
    this.initialWorkBook('Nguyen Van Binh', 'Somebody', new Date(2022, 11, 11), new Date(), new Date(2022, 11, 11));
    //** initialWorkSheet */
    this.initialWorkSheet('My Sheet', optionConfig);
    this.worksheet.autoFilter = {
      from: 'A1',
      to: 'C1'
    };
    //** Add column */
    this.worksheet.columns = [{ header: 'Id', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Age', key: 'age' }];
    //**add row 
    const data = [{ id: 1, name: 'John Doe', age: 35 }, { id: 2, name: 'Somebody', age: 45 }];
    const rows = this.worksheet.addRows(data);
    //Adding a new row using array:
    //You can use an array as well to add new data. It will assign to the columns in order (A, B, C):
    const row = this.worksheet.addRow([3, 'Mary Sue', 22]);

    const row2 = this.worksheet.addRow([4, 'Nobody', 29]);

    this.worksheet.eachColumnKey((col, index) => {

    });

    this.worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell: Excel.Cell) => {
        cell.border = cell.fullAddress.col == 1 ? {
          top: { style: 'double', color: { argb: 'FF00FF00' } },
          left: { style: 'double', color: { argb: 'FF00FF00' } },
          bottom: { style: 'double', color: { argb: 'FF00FF00' } },
          right: { style: 'double', color: { argb: 'FF00FF00' } }
        } : {};
      });
    });




    //**validation cell */
    this.worksheet.getCell('A2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"One,Two,Three,Four"']
    };
    this.worksheet.getCell('A3').style = {
      fill: {
        type: 'pattern',
        pattern: 'none',
        bgColor: { argb: 'FF0000FF' }
      }
    };

  }
  async onExportExcel() {
    const buf = await this.workbook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buf]), `demo.xlsx`);
  }
}
