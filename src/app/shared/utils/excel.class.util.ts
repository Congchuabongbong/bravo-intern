import { Alignment, Color, Font, Style } from 'exceljs';
export class ExcelUtil {
    public hostElement!: HTMLElement;
    // public baseFont!: Partial<Font>;
    public baseStyle!: Partial<Style>;
    // public baseAlignment!: Partial<Alignment>;
    constructor(_hostElement: HTMLElement, _baseStyle: Style) {
        this.hostElement = _hostElement;
        this.baseStyle = _baseStyle;
    }


    getBaseAlignment(): Partial<Alignment> | undefined {
        return this.baseStyle.alignment;
    }
    getBaseFont(): Partial<Font> | undefined {
        return this.baseStyle.font;
    }
}