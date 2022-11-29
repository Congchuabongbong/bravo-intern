import { FlexGrid } from '@grapecity/wijmo.grid';
import { Alignment, Color, Font, Style } from 'exceljs';
export class ExcelFlexUtil {
    //*declaration public properties
    public hostElement!: HTMLElement;
    public flexGrid!: FlexGrid;
    public cellBaseElement!: HTMLElement | null;
    public cellAlternatingRowStepElement!: HTMLElement | null;
    public cellColumnHeader!: HTMLElement | null;
    //*Declaration private properties
    private _selectorCellBase: string = '.wj-cell:not(.wj-state-active)[role~="gridcell"]';
    private _selectorCellAlternatingRowStep: string = '.wj-cell.wj-alt:not(.wj-state-active)[role~="gridcell"]';
    private _selectorCellColumnHeader: string = '.wj-colheaders.wj-row.wj-cell.wj-header:not(.wj-state-multi-selected)';
    set selectorCellBase(value: string) {
        if (this.selectorCellBase !== value) {
            this._selectorCellBase = value;
            this.cellBaseElement = this.getElementInHostElement(value);
        }
    }
    get selectorCellBase(): string {
        return this._selectorCellBase;
    }
    set selectorCellAlternatingRowStep(value: string) {
        if (this.selectorCellAlternatingRowStep !== value) {
            this._selectorCellAlternatingRowStep = value;
            this.cellAlternatingRowStepElement = this.getElementInHostElement(value);
        }
    }
    get selectorCellAlternatingRowStep(): string {
        return this._selectorCellAlternatingRowStep;
    }

    set selectorCellColumnHeader(value: string) {
        if (this.selectorCellColumnHeader !== value) {
            this._selectorCellColumnHeader = value;
            this.cellColumnHeader = this.getElementInHostElement(value);
        }
    }
    get selectorCellColumnHeader(): string {
        return this._selectorCellColumnHeader;
    }
    //*constructor
    constructor(_flex: FlexGrid) {
        this.flexGrid = _flex;
        this.hostElement = _flex.hostElement;
        this.cellAlternatingRowStepElement = this.getElementInHostElement(this._selectorCellAlternatingRowStep);
        this.cellBaseElement = this.getElementInHostElement(this._selectorCellBase);
        this.cellColumnHeader = this.getElementInHostElement(this._selectorCellColumnHeader);
    }
    public getElementInHostElement(selector: string): HTMLElement | null {
        return this.hostElement.querySelector(selector);
    }
}