import { Column as ColumnWj } from '@grapecity/wijmo.grid';
import { Alignment, Borders, BorderStyle, Column, Fill, FillPattern, Font, Row, Style, Worksheet } from 'exceljs';
import { convertFormatColorToHex } from './color.method.util';
export type VerticalExcelProp = 'superscript' | 'subscript';
export type UnderlineExcelProp = boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
export type Horizontal = 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
export type Vertical = 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';

//*Get and set Style excel 

export function getStyleExcelFromStyleElement(element: HTMLElement, styleSetup?: Partial<Style>): Partial<Style> {
    let crawlStyle: Partial<Style> = {};
    if (!element) return crawlStyle;
    crawlStyle.font = getFontExcelFromStyleElement(element);
    crawlStyle.border = getBorderExcelFromStyleElement(element);
    crawlStyle.fill = getFillExcelFromStyleElement(element) as FillPattern;
    crawlStyle.alignment = getAlignmentFromStyleElement(element);
    return { ...crawlStyle, ...styleSetup };
}
//* Get and set Font Excel 
export function getFontExcelFromStyleElement(element: HTMLElement, fontSetup?: Partial<Font>): Partial<Font> {
    let crawlStyle: Partial<Font> = {};
    if (!element) return crawlStyle;
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    //name
    crawlStyle.name = getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'name') as string;
    //size
    crawlStyle.size = convertFontSizeToNumber(computedStyle.getPropertyValue('font-size'));
    //bold
    crawlStyle.bold = computedStyle.getPropertyValue('font-weight') === '700';
    //family
    crawlStyle.family = getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'family') as number;
    //italic
    crawlStyle.italic = computedStyle.getPropertyValue('font-style') === 'italic';
    //vertical
    if (computedStyle.getPropertyValue('vertical-align') == 'sub' || computedStyle.getPropertyValue('vertical-align') == 'super') {
        crawlStyle.vertAlign = computedStyle.getPropertyValue('vertical-align') as VerticalExcelProp;
    }
    //text-decoration-line
    crawlStyle.strike = computedStyle.getPropertyValue('text-decoration-line') === 'line-through';
    //underline
    crawlStyle.underline = convertUnderlineExcel(computedStyle.getPropertyValue('text-decoration-line'), computedStyle.getPropertyValue('text-decoration-style'));
    //outline
    crawlStyle.outline = !(computedStyle.getPropertyValue('outline-width') === '0px');
    //color
    crawlStyle.color = {
        argb: convertFormatColorToHex(computedStyle.getPropertyValue('color')) as string
    };
    return { ...crawlStyle, ...fontSetup };
}
export function setFontExcel(baseFont: Partial<Font>, newFont: Partial<Font>): Partial<Font> {
    return {
        ...baseFont,
        ...newFont
    };
}
//* Get and set Alignment Excel
export function getAlignmentFromStyleElement(element: HTMLElement, alignmentSetup?: Partial<Alignment>): Partial<Alignment> {
    let crawlStyle: Partial<Alignment> = {};
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    if (!computedStyle) return crawlStyle;
    crawlStyle.horizontal ??= convertHorizontalExcel(computedStyle.getPropertyValue('text-align')) as Horizontal;
    crawlStyle.wrapText ??= computedStyle.getPropertyValue('word-wrap') === 'break-word';
    crawlStyle.shrinkToFit ??= (computedStyle.getPropertyValue('flex-shrink') === '0');
    return { ...crawlStyle, ...alignmentSetup };
}
export function setAlignment(baseAlignment: Partial<Alignment>, newAlignment: Partial<Alignment>): Partial<Alignment> {
    return {
        ...baseAlignment,
        ...newAlignment
    };
}
//* Get and set Fills Excel
//default fill Pattern
export function getFillExcelFromStyleElement(element: HTMLElement, fillSetup?: Partial<FillPattern>): Partial<FillPattern> {
    let crawlStyle: Partial<FillPattern> = {};
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    if (!computedStyle) return crawlStyle;
    crawlStyle.type ??= 'pattern';
    crawlStyle.pattern ??= 'solid';
    crawlStyle.fgColor ??= {
        argb: convertFormatColorToHex(computedStyle.backgroundColor) as string,
    };
    return { ...crawlStyle, ...fillSetup };
}

export function setFillExcel(baseFill: Partial<FillPattern>, newFill: Partial<FillPattern>): Partial<FillPattern> {
    return { ...baseFill, ...newFill };
}

//* Get and set border excel
export function getBorderExcelFromStyleElement(element: HTMLElement, borderSetup?: Partial<Borders>): Partial<Borders> {
    let crawlStyle: Partial<Borders> = {};
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    if (!computedStyle) return crawlStyle;
    if (computedStyle.border) {
        crawlStyle.top, crawlStyle.left, crawlStyle.right, crawlStyle.bottom ??= {
            style: convertBorderStyleExcel(computedStyle.borderStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderColor) as string }
        };
        return { ...crawlStyle, ...borderSetup };
    }

    if (computedStyle.borderTop.split(' ')[1] !== 'none') {
        crawlStyle.top = {
            style: convertBorderStyleExcel(computedStyle.borderTopStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderTopColor) as string }
        };
    }

    if (computedStyle.borderBottom.split(' ')[1] !== 'none') {
        crawlStyle.bottom ??= {
            style: convertBorderStyleExcel(computedStyle.borderBottomStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderBottomColor) as string }
        };
    }
    if (computedStyle.borderLeft.split(' ')[1] !== 'none') {
        crawlStyle.left ??= {
            style: convertBorderStyleExcel(computedStyle.borderLeftStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderLeftColor) as string }
        };
    }
    if (computedStyle.borderRight.split(' ')[1] !== 'none') {
        crawlStyle.right ??= {
            style: convertBorderStyleExcel(computedStyle.borderRightStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderRightColor) as string }
        };
    }
    return crawlStyle;
}
export function setBorderExcel() {

}
//* creator Style, Font, Alignment, Fill
const creatorStyleExcel = (): Partial<Style> => ({});
const creatorFontExcel = (): Partial<Font> => ({});
const creatorAlignmentExcel = (): Partial<Alignment> => ({});
const creatorFillExcel = (): Partial<FillPattern> => ({});
// ? handle convert function
export function convertHorizontalExcel(textAlign: string): Horizontal {
    if (textAlign === 'center') return 'center';
    if (textAlign === 'right') return 'right';
    if (textAlign === 'justify') return 'justify';
    if (textAlign === 'initial') return 'left';
    return 'left';
}
export function convertFontSizeToNumber(fontsize: string | null): number {
    let sizeStrings: string[] | null = fontsize && fontsize.match(/\d+/) || null;
    if (sizeStrings && sizeStrings.length > 0) {
        return +sizeStrings[0] as number;
    }
    return 16;
}

export function getNameOrFamilyExcel(fontFamily: string, returnType: 'name' | 'family'): number | string {
    let fontFamilyTrim = fontFamily.split(',').map(font => font.trim());
    if (returnType === 'family') {
        if (fontFamilyTrim.includes('serif')) return 1;
        if (fontFamilyTrim.includes('sans-serif')) return 2;
        if (fontFamilyTrim.includes('mono')) return 3;
        return 4;
    } else {
        return fontFamilyTrim[0];
    }
}

export function convertUnderlineExcel(textDecorationLine: string, textDecorationStyle: string): UnderlineExcelProp {
    if (textDecorationLine == 'underline') {
        if (textDecorationStyle == 'double') return 'double';
        return 'single';
    }
    return 'none';
}

export function convertBorderStyleExcel(borderStyle: string, borderWidth: number): BorderStyle {
    switch (borderStyle) {
        case 'dotted':
            return 'dotted';
        case 'dashed':
            return 'dashDot';
        case 'solid':
            if (borderWidth && borderWidth >= 1 && borderWidth < 3) {
                return 'thin';
            }
            if (borderWidth && borderWidth >= 3 && borderWidth < 5) {
                return 'medium';
            }
            if (borderWidth && borderWidth <= 5) {
                return 'thick';
            }
            return 'thin';
        case 'double':
            return 'double';
        default:
            return 'thin';
    }
}

//*merge Cell
function mergeCells(ws: Worksheet, row: Row, from: number, to: number): void {
    ws.mergeCells(`${row.getCell(from).address}:${row.getCell(to).address}`);
}
//*add Rows
function addRows() { }
//*generate Column;
export function generateColumnsExcel(cols: ColumnWj[], style?: Partial<Style>): Partial<Column>[] {
    let colsExcel: Partial<Column>[] = [];
    cols.forEach(col => {
        const colExcel: Partial<Column> = {
            style: style,
            header: (col.header || col.binding) as string,
            key: col.binding as string,
            width: col.width as number,
        };
        if (style) colExcel.style = style;
        colsExcel.push(colExcel);
    });
    return colsExcel;
}
//css Selector
export function getElementNotSelector(hostElement: HTMLElement, typeSelector: string, selector: string, selectorCondition: string) {
    return hostElement.querySelector('');
    // if (e instanceof Element) return e;
    // if (isString(e)) try {
    //     return document.querySelector(e);
    // } catch (e) { }
    // return e && e.jquery ? e[0] : null;
}


