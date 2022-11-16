import { setCss } from '@grapecity/wijmo';
import { IStyleOptions } from './../data-type/grid-layout.data.type';
export function updateStyle(styleOptions: IStyleOptions, element: HTMLElement) {
    styleOptions && setCss(element, styleOptions);
}