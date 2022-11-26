import { SlicePipe } from '@angular/common';
import { FlexGrid } from '@grapecity/wijmo.grid';
import * as Excel from 'exceljs';
import { convertFormatColorToHex } from './color.method.ultil';
import { UnderlineExcelProp, VerticalExcelProp } from './excel.method.ultil';

// export class ExcelJsUtils {
//     private hostElement!: HTMLElement;
//     //**Constructor */
//     constructor(_hostElement: HTMLElement) {
//         this.hostElement = _hostElement;
//     }
//     public getFontExcelFromElement(elementSelected: HTMLElement, setFont?: Partial<Excel.Font>): Partial<Excel.Font> {
//         let crawlStyle: Partial<Excel.Font> = { ...setFont };
//         let computedStyle: CSSStyleDeclaration = window.getComputedStyle(elementSelected);
//         //name
//         crawlStyle.name ??= getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'name') as string;
//         //size
//         crawlStyle.size ??= convertFontSizeToNumber(computedStyle.getPropertyValue('font-size'));
//         //bold
//         crawlStyle.bold ??= computedStyle.getPropertyValue('font-weight') === '700';
//         //family
//         crawlStyle.family ??= getNameOrFamilyExcel(computedStyle.getPropertyValue('font-family'), 'family') as number;
//         //italic
//         crawlStyle.italic ??= computedStyle.getPropertyValue('font-style') === 'italic';
//         //vertical
//         if (computedStyle.getPropertyValue('vertical-align') == 'sub' || computedStyle.getPropertyValue('vertical-align') == 'super') {
//             crawlStyle.vertAlign ??= computedStyle.getPropertyValue('vertical-align') as VerticalExcelProp;
//         }
//         //text-decoration-line
//         crawlStyle.strike ??= computedStyle.getPropertyValue('text-decoration-line') === 'line-through';
//         //underline
//         crawlStyle.underline ??= convertUnderlineExcel(computedStyle.getPropertyValue('text-decoration-line'), computedStyle.getPropertyValue('text-decoration-style'));
//         //outline
//         crawlStyle.outline ??= !(computedStyle.getPropertyValue('outline-width') === '0px');
//         //color
//         crawlStyle.color ??= {
//             argb: convertFormatColorToHex(computedStyle.getPropertyValue('color')) as string
//         }
//         return crawlStyle;
//     }



// export interface Font {
//     name: string; //
//     size: number; //
//     family: number;//
//     scheme: 'minor' | 'major' | 'none';
//     charset: number;
//     color: Partial<Excel.Color>;//
//     bold: boolean;//
//     italic: boolean;//
//     underline: boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';//
//     vertAlign: 'superscript' | 'subscript'; //
//     strike: boolean;//
//     outline: boolean;//
// }


