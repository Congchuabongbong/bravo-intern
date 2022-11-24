import { Column, Row, Worksheet } from "exceljs";

interface IExcelAction {
    mergeCells(ws: Worksheet, row: Row, from: number, to: number): void;
    addRow(): Row;
    addCol(): Column;
    exportToExcelPro(): void;
    exportToExcel(): void;
}


abstract class excelJS implements IExcelAction {
    addCol(): Column {
        throw new Error("Method not implemented.");
    }
    mergeCells(ws: Worksheet, row: Row, from: number, to: number): void {
        throw new Error("Method not implemented.");
    }
    addRow(): Row {
        throw new Error("Method not implemented.");
    }
    exportToExcelPro(): void {
        throw new Error("Method not implemented.");
    }
    exportToExcel(): void {
        throw new Error("Method not implemented.");
    }
}