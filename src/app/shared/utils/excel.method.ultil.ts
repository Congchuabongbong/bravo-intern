import { Alignment, Font, Style } from 'exceljs';
import { convertFormatColorToHex } from './color.method.util';
export type VerticalExcelProp = 'superscript' | 'subscript';
export type UnderlineExcelProp = boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
export type Horizontal = 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
export type Vertical = 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
export function getFontExcelFromElement(element: HTMLElement, setFont?: Partial<Font>): Partial<Font> {
    let crawlStyle: Partial<Font> = { ...setFont };
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    //name
    crawlStyle.name ??= getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'name') as string;
    //size
    crawlStyle.size ??= convertFontSizeToNumber(computedStyle.getPropertyValue('font-size'));
    //bold
    crawlStyle.bold ??= computedStyle.getPropertyValue('font-weight') === '700';
    //family
    crawlStyle.family ??= getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'family') as number;
    //italic
    crawlStyle.italic ??= computedStyle.getPropertyValue('font-style') === 'italic';
    //vertical
    if (computedStyle.getPropertyValue('vertical-align') == 'sub' || computedStyle.getPropertyValue('vertical-align') == 'super') {
        crawlStyle.vertAlign ??= computedStyle.getPropertyValue('vertical-align') as VerticalExcelProp;
    }
    //text-decoration-line
    crawlStyle.strike ??= computedStyle.getPropertyValue('text-decoration-line') === 'line-through';
    //underline
    crawlStyle.underline ??= convertUnderlineExcel(computedStyle.getPropertyValue('text-decoration-line'), computedStyle.getPropertyValue('text-decoration-style'));
    //outline
    crawlStyle.outline ??= !(computedStyle.getPropertyValue('outline-width') === '0px');
    //color
    crawlStyle.color ??= {
        argb: convertFormatColorToHex(computedStyle.getPropertyValue('color')) as string
    }
    return crawlStyle;
}

export function getAlignmentFromElement(element: HTMLElement, setAlignment?: Partial<Alignment>): Partial<Alignment> {
    let crawlStyle: Partial<Alignment> = { ...setAlignment };
    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    crawlStyle.horizontal = convertHorizontalExcel(computedStyle.getPropertyValue('text-align')) as Horizontal;
    return crawlStyle;
}

export function convertHorizontalExcel(textAlign: string): Horizontal {
    if (textAlign === 'center') return 'center';
    if (textAlign === 'right') return 'right';
    if (textAlign === 'justify') return 'justify';
    if (textAlign === 'initial') return 'left';
    return 'left';
}

// export interface Alignment {
//     horizontal: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
//     vertical: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
//     wrapText: boolean;
//     shrinkToFit: boolean;
//     indent: number;
//     readingOrder: 'rtl' | 'ltr';
//     textRotation: number | 'vertical';
// }



function creatorStyleExcelDefault(): Partial<Style> {
    return {}
}




// export interface Style {
// 	numFmt: string;
// 	font: Partial<Font>;
// 	alignment: Partial<Alignment>;
// 	protection: Partial<Protection>;
// 	border: Partial<Borders>;
// 	fill: Fill;
// }




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
        return 4
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