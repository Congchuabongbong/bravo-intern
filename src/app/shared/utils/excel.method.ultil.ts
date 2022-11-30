import { Column as ColumnWj } from '@grapecity/wijmo.grid';
import { Alignment, Borders, BorderStyle, Column, FillPattern, Font, Row, Style, Worksheet } from 'exceljs';
import { convertFormatColorToHex } from './color.method.util';
export type VerticalExcelProp = 'superscript' | 'subscript';
export type UnderlineExcelProp = boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
export type Horizontal = 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
export type Vertical = 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';

//*Get and set Style excel 

export function getStyleExcelFromStyleElement(styleSetup: Partial<CSSStyleDeclaration>, elementOverrideStyle?: HTMLElement, styleExcelOps?: Partial<Style>): Partial<Style> {
    let crawlStyle: Partial<Style> = {};
    crawlStyle.font = getFontExcelFromStyleElement(styleSetup, elementOverrideStyle);
    crawlStyle.border = getBorderExcelFromStyleElement(styleSetup, elementOverrideStyle);
    crawlStyle.fill = getFillExcelFromStyleElement(styleSetup, elementOverrideStyle) as FillPattern;
    crawlStyle.alignment = getAlignmentFromStyleElement(styleSetup, elementOverrideStyle);
    if (styleExcelOps) return { ...crawlStyle, ...styleExcelOps };
    return crawlStyle;
}
//* Get and set Font Excel 
export function getFontExcelFromStyleElement(styleSetup: Partial<CSSStyleDeclaration>, elementOverrideStyle?: HTMLElement, fontExcelOps?: Partial<Font>): Partial<Font> {
    let crawlStyle: Partial<Font> = {};
    let computedStyle: CSSStyleDeclaration = elementOverrideStyle ? { ...window.getComputedStyle(elementOverrideStyle), ...styleSetup } as CSSStyleDeclaration : styleSetup as CSSStyleDeclaration;
    //name
    if (computedStyle.fontFamily) crawlStyle.name = getNameOrFamilyExcel(computedStyle.fontFamily, 'name') as string;
    //size
    if (computedStyle.fontSize) crawlStyle.size = convertFontSizeToNumber(computedStyle.fontSize);
    //bold
    if (computedStyle.fontWeight) crawlStyle.bold = computedStyle.fontWeight === '700' || computedStyle.fontWeight === 'bold';
    //family
    if (computedStyle.fontFamily) crawlStyle.family = getNameOrFamilyExcel(computedStyle.fontFamily, 'family') as number;
    //italic
    if (computedStyle.fontStyle) crawlStyle.italic = computedStyle.fontStyle === 'italic';
    //vertical
    if (computedStyle.verticalAlign == 'sub' || computedStyle.verticalAlign == 'super') crawlStyle.vertAlign = computedStyle.verticalAlign as VerticalExcelProp;
    //text-decoration-line
    crawlStyle.strike = computedStyle.textDecorationLine === 'line-through';
    //underline
    if (computedStyle.textDecorationLine && computedStyle.textDecorationStyle) crawlStyle.underline = convertUnderlineExcel(computedStyle.textDecorationLine, computedStyle.textDecorationStyle);
    //outline
    if (computedStyle.outlineWidth) crawlStyle.outline = !(computedStyle.outlineWidth === '0px');
    //color
    if (computedStyle.color) crawlStyle.color = {
        argb: convertFormatColorToHex(computedStyle.color) as string
    };
    if (fontExcelOps) return { ...crawlStyle, ...fontExcelOps };
    return crawlStyle;
}

//* Get and set Alignment Excel
export function getAlignmentFromStyleElement(styleSetup: Partial<CSSStyleDeclaration>, elementOverrideStyle?: HTMLElement, alignmentOps?: Partial<Alignment>): Partial<Alignment> {
    let crawlStyle: Partial<Alignment> = {};
    let computedStyle: CSSStyleDeclaration = elementOverrideStyle ? { ...window.getComputedStyle(elementOverrideStyle), ...styleSetup } as CSSStyleDeclaration : styleSetup as CSSStyleDeclaration;
    crawlStyle.horizontal = convertHorizontalExcel(computedStyle.textAlign) as Horizontal;
    crawlStyle.wrapText = computedStyle.wordWrap === 'break-word';
    crawlStyle.shrinkToFit = (computedStyle.flexShrink === '0');
    crawlStyle.vertical = 'middle';
    if (alignmentOps) return { ...crawlStyle, ...alignmentOps };
    return crawlStyle;
}

//* Get and set Fills Excel
//default fill Pattern
export function getFillExcelFromStyleElement(styleSetup: Partial<CSSStyleDeclaration>, elementOverrideStyle?: HTMLElement, fillExcelOps?: FillPattern): Partial<FillPattern> {
    let crawlStyle: Partial<FillPattern> = {};
    let computedStyle: CSSStyleDeclaration = elementOverrideStyle ? { ...window.getComputedStyle(elementOverrideStyle), ...styleSetup } as CSSStyleDeclaration : styleSetup as CSSStyleDeclaration;
    crawlStyle.type = 'pattern';
    crawlStyle.pattern = 'solid';
    if (computedStyle.backgroundColor) crawlStyle.fgColor = {
        argb: convertFormatColorToHex(computedStyle.backgroundColor) as string
    };
    if (fillExcelOps) return { ...crawlStyle, ...fillExcelOps };
    return crawlStyle;
}



//* Get and set border excel
export function getBorderExcelFromStyleElement(styleSetup: Partial<CSSStyleDeclaration>, elementOverrideStyle?: HTMLElement, borderExcelOps?: Partial<Borders>): Partial<Borders> {
    let crawlStyle: Partial<Borders> = {};
    let computedStyle: CSSStyleDeclaration = elementOverrideStyle ? { ...window.getComputedStyle(elementOverrideStyle), ...styleSetup } as CSSStyleDeclaration : styleSetup as CSSStyleDeclaration;
    //use case have border or properties border
    if (computedStyle.border) {
        crawlStyle.top = crawlStyle.left = crawlStyle.right = crawlStyle.bottom = {
            style: convertBorderStyleExcel(computedStyle.borderStyle, convertFontSizeToNumber(computedStyle.borderWidth)),
            color: { argb: convertFormatColorToHex(computedStyle.borderColor) as string }
        };
        if (borderExcelOps) return { ...crawlStyle, ...borderExcelOps };
        return crawlStyle;
    }
    //use case have borderRight,left,bottom,top or properties border left,top,right,bottom
    if (computedStyle.borderTopStyle !== 'none' && computedStyle.borderTopColor && computedStyle.borderTopWidth) {
        crawlStyle.top = {
            style: convertBorderStyleExcel(computedStyle.borderTopStyle, convertFontSizeToNumber(computedStyle.borderTopWidth, 'border')),
            color: { argb: convertFormatColorToHex(computedStyle.borderTopColor) as string }
        };
    }
    if (computedStyle.borderBottomStyle !== 'none' && computedStyle.borderBottomColor && computedStyle.borderBottomWidth) {
        crawlStyle.bottom = {
            style: convertBorderStyleExcel(computedStyle.borderBottomStyle, convertFontSizeToNumber(computedStyle.borderBottomWidth, 'border')),
            color: { argb: convertFormatColorToHex(computedStyle.borderBottomColor) as string }
        };
    }
    if (computedStyle.borderLeftStyle !== 'none' && computedStyle.borderLeftColor && computedStyle.borderLeftWidth) {
        crawlStyle.left = {
            style: convertBorderStyleExcel(computedStyle.borderLeftStyle, convertFontSizeToNumber(computedStyle.borderLeftWidth, 'border')),
            color: { argb: convertFormatColorToHex(computedStyle.borderLeftColor) as string }
        };
    }
    if (computedStyle.borderRightStyle !== 'none' && computedStyle.borderRightColor && computedStyle.borderRightWidth) {
        crawlStyle.right = {
            style: convertBorderStyleExcel(computedStyle.borderRightStyle, convertFontSizeToNumber(computedStyle.borderRightWidth, 'border')),
            color: { argb: convertFormatColorToHex(computedStyle.borderRightColor) as string }
        };
    }
    if (borderExcelOps) return { ...crawlStyle, ...borderExcelOps };
    return crawlStyle;
}

//* creator Style, Font, Alignment, Fill
// ? handle convert function
export function convertHorizontalExcel(textAlign: string): Horizontal {
    if (textAlign === 'center') return 'center';
    if (textAlign === 'right') return 'right';
    if (textAlign === 'justify') return 'justify';
    if (textAlign === 'initial') return 'left';
    return 'left';
}
export function convertFontSizeToNumber(fontsize: string, type?: string): number {
    let sizeStrings: string[] | null = fontsize && fontsize.match(/\d+/) || null;
    if (sizeStrings && sizeStrings.length > 0) {
        return +sizeStrings[0] as number;
    }
    if (type === 'border') return 1;
    return 16;
}

export function getNameOrFamilyExcel(fontFamily: string, returnType: 'name' | 'family'): number | string {
    let fontFamilyTrim = fontFamily && fontFamily.split(',').map(font => font.trim());
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
            if (borderWidth >= 1 && borderWidth < 3) {
                return 'thin';
            }
            if (borderWidth >= 3 && borderWidth < 5) {
                return 'medium';
            }
            if (borderWidth >= 5) {
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
export function mergeCells(ws: Worksheet, row: Row, from: number, to: number): void {
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
            width: (col.renderWidth as number) / 10,
        };
        if (style) colExcel.style = style;
        colsExcel.push(colExcel);
    });
    return colsExcel;
}
