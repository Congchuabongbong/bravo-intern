import * as crypto from 'crypto-js';
import * as wjc from '@grapecity/wijmo';
import * as wjg from '@grapecity/wijmo.grid';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { BravoSettings } from './bravo.settings';
// import { GridCellTypeEnum, StyleElementFlags, ReportUnit, ContentAlignment, ImageLayout } from './enums';
// import { CellStyle, BravoFormatItemEventArgs } from './controls/bravo.web.grid';
// import { BravoCore, CryptoExtension, isExactlyProperty, BravoDataTypeConverter, AggregateEnum, FileTypeEnum } from '../core/core';
// import { BravoGlobalize } from '../core/bravo.globalize';
// import { BravoValueAccessor } from './bravo.value.accessor';
import { WjFlexGrid } from '@grapecity/wijmo.angular2.grid';
import { Popup, Menu } from '@grapecity/wijmo.input';

const IgnoreHeaderEditmask = 'AA';
const IgnoreNumber = /(\D)/;

export class BravoUIExtension {
  public static pxToPt(val: number) {
    return (val * 72) / BravoSettings.BaseDpi.x;
  }

  // public static ptToPx(value: number) {
  //     return Math.round((value * BravoSettings.BaseDpi.x) / 72);
  // }

  // public static pxToInch(value: number) {
  //     let _num = (value / BravoSettings.BaseDpi.x);
  //     return Number.isNaN(_num) ? 0 : _num.round(3);
  // }

  // public static pxToHundredthsOfInch(value: number) {
  //     let _num = (value / BravoSettings.BaseDpi.x) * 100;
  //     return Number.isNaN(_num) ? 0 : _num.round(3);
  // }

  // public static pxToCentimeters(value: number) {
  //     let _num = (value / BravoSettings.BaseDpi.x) * 2.54;
  //     return Number.isNaN(_num) ? 0 : _num.round(3);
  // }

  // public static CentimetersToPx(value: number) {
  //     let _num = (value / 2.54) * BravoSettings.BaseDpi.x;
  //     return Number.isNaN(_num) ? 0 : _num.round(3);
  // }

  // public static pxToMillimeters(value: number) {
  //     let _num = (value / BravoSettings.BaseDpi.x) * 2.54 * 10;
  //     return Number.isNaN(_num) ? 0 : _num.round(3);
  // }

  // public static inchToPx(value: number) {
  //     let _num = value * BravoSettings.BaseDpi.x;
  //     return Number.isNaN(_num) ? 0 : _num;
  // }

  // public static pxTo(unit: ReportUnit, pnValue: number) {
  //     switch (unit) {
  //         case ReportUnit.Inches:
  //             return BravoUIExtension.pxToInch(pnValue);
  //         case ReportUnit.Centimeters:
  //             return BravoUIExtension.pxToCentimeters(pnValue);
  //         case ReportUnit.HundredthsOfInch:
  //             return BravoUIExtension.pxToHundredthsOfInch(pnValue);
  //         case ReportUnit.Millimeters:
  //             return BravoUIExtension.pxToMillimeters(pnValue);
  //     }
  // }

  // public static reportUnitToPx(unit: ReportUnit, pnValue: number) {
  //     switch (unit) {
  //         case ReportUnit.Inches:
  //             return BravoUIExtension.inchToPx(pnValue);
  //         case ReportUnit.Centimeters:
  //             return BravoUIExtension.CentimetersToPx(pnValue);
  //         case ReportUnit.HundredthsOfInch:
  //             return BravoUIExtension.inchToPx(pnValue / 100);
  //         case ReportUnit.Millimeters:
  //             return BravoUIExtension.CentimetersToPx(pnValue / 10);
  //     }
  // }

  // public static convertNumericFormat(pzNumericFormat: string) {
  //     if (!pzNumericFormat)
  //         return "G";

  //     if (pzNumericFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.progress])) {
  //         let _zFormat = "P0";
  //         if (pzNumericFormat.toLowerCase().startsWith(
  //             GridCellTypeEnum[GridCellTypeEnum.progress] + "."))
  //             _zFormat = pzNumericFormat.substring(
  //                 (GridCellTypeEnum[GridCellTypeEnum.progress] + ".").length);

  //         return _zFormat;
  //     }

  //     if (pzNumericFormat.includes("#,##")) {
  //         let _nDecCount = 0;
  //         let _nPos = pzNumericFormat.indexOf("0.");
  //         if (_nPos >= 0) {
  //             for (let _i = _nPos + 2; _i < pzNumericFormat.length; _i++) {
  //                 if (pzNumericFormat[_i] == '0') _nDecCount++;
  //                 else break;
  //             }
  //         }

  //         return String.format("N{0}", _nDecCount);
  //     }

  //     if (pzNumericFormat.includes("#%")) {
  //         let _nDecCount = 0;
  //         let _nPos = pzNumericFormat.indexOf("0.");
  //         if (_nPos >= 0) {
  //             for (let _i = _nPos + 2; _i < pzNumericFormat.length; _i++) {
  //                 if (pzNumericFormat[_i] == '#') _nDecCount++;
  //                 else break;
  //             }
  //         }

  //         return String.format("P{0}", _nDecCount);
  //     }

  //     return pzNumericFormat;
  // }

  // public static getAlignPosition(pAlign: ContentAlignment) {
  //     let _css = {'display': '', 'align-items': '', 'justify-content': ''};

  //     if (pAlign == null)
  //         return _css;

  //     _css['display'] = 'flex';

  //     switch (pAlign) {
  //         case ContentAlignment.TopLeft:
  //             _css['align-items'] = 'flex-start';
  //             _css['justify-content'] = 'flex-start';
  //             break;
  //         case ContentAlignment.MiddleLeft:
  //             _css['align-items'] = 'center';
  //             _css['justify-content'] = 'flex-start';
  //             break;
  //         case ContentAlignment.BottomLeft:
  //             _css['align-items'] = 'flex-end';
  //             _css['justify-content'] = 'flex-start';
  //             break;
  //         case ContentAlignment.TopRight:
  //             _css['align-items'] = 'flex-start';
  //             _css['justify-content'] = 'flex-end';
  //             break;
  //         case ContentAlignment.MiddleRight:
  //             _css['align-items'] = 'center';
  //             _css['justify-content'] = 'flex-end';
  //             break;
  //         case ContentAlignment.BottomRight:
  //             _css['align-items'] = 'flex-end';
  //             _css['justify-content'] = 'flex-end';
  //             break;
  //         case ContentAlignment.TopCenter:
  //             _css['align-items'] = 'flex-start';
  //             _css['justify-content'] = 'center';
  //             break;
  //         case ContentAlignment.MiddleCenter:
  //             _css['align-items'] = 'center';
  //             _css['justify-content'] = 'center';
  //             break;
  //         case ContentAlignment.BottomCenter:
  //             _css['align-items'] = 'flex-end';
  //             _css['justify-content'] = 'center';
  //             break;
  //     }

  //     return _css;
  // }

  // public static getBackgroundImageCss(backgroundImageLayout: ImageLayout) {
  //     let _css = {'backgroundPosition': '', 'backgroundSize': '', 'backgroundRepeat': ''};

  //     switch (backgroundImageLayout) {
  //         case ImageLayout.Tile: {
  //             _css['backgroundPosition'] = "left top";
  //             break;
  //         }
  //         case ImageLayout.Stretch: {
  //             _css['backgroundPosition'] = "center";
  //             _css['backgroundSize'] = "100% 100%";
  //             _css['backgroundRepeat'] = "no-repeat";
  //             break;

  //         }
  //         case ImageLayout.Center: {
  //             _css['backgroundPosition'] = "center top";
  //             _css['backgroundRepeat'] = "no-repeat";
  //             break;
  //         }
  //         case ImageLayout.Zoom: {
  //             _css['backgroundPosition'] = "center";
  //             _css['backgroundSize'] = "contain";
  //             _css['backgroundRepeat'] = "no-repeat";
  //             break;
  //         }
  //     }

  //     return _css;
  // }

  // public static getFileTypeIcon(fileType: FileTypeEnum) {
  //     switch (fileType) {
  //         case FileTypeEnum.Pdf:
  //             return 'fa-file-pdf-o';
  //         case FileTypeEnum.Doc:
  //         case FileTypeEnum.Docx:
  //             return 'fa-file-word-o';
  //         case FileTypeEnum.Xls:
  //         case FileTypeEnum.Xlsx:
  //             return 'fa-file-excel-o';
  //         case FileTypeEnum.Bmp:
  //         case FileTypeEnum.Jpg:
  //         case FileTypeEnum.Gif:
  //         case FileTypeEnum.Tif:
  //         case FileTypeEnum.Png:
  //         case FileTypeEnum.Psd:
  //         case FileTypeEnum.Wmf:
  //         case FileTypeEnum.Ico:
  //             return 'fa-file-image-o';
  //         case FileTypeEnum.Mp3:
  //         case FileTypeEnum.Wmv:
  //         case FileTypeEnum.Wma:
  //         case FileTypeEnum.Wav:
  //         case FileTypeEnum.Flac:
  //         case FileTypeEnum.Mkv:
  //             return 'fa-file-audio-o';
  //         case FileTypeEnum.Avi:
  //         case FileTypeEnum.Swf:
  //         case FileTypeEnum.Flv:
  //         case FileTypeEnum.Mp4:
  //         case FileTypeEnum.Mov:
  //             return 'fa-file-video-o';
  //         case FileTypeEnum.Zip:
  //             return 'fa-file-archive-o';
  //         case FileTypeEnum.Xml:
  //             return 'fa-file-code-o';
  //         case FileTypeEnum.Txt:
  //             return 'fa-file-text-o';
  //         default:
  //             return 'fa-file-o';
  //     }
  // }
}

// export class BravoDataMap extends wjg.DataMap {
//     _col: wjg.Column = null;

//     constructor(col: wjg.Column) {
//         super(new wjc.CollectionView(), 'value', 'value');
//         this.sortByDisplayValues = false;
//         this._col = col;
//     }

//     public override getKeyValue(displayValue: string) {
//         if (this._col.format && this._col.format.includes('#'))
//             return displayValue;

//         return super.getKeyValue(displayValue);
//     }

//     public override getDisplayValue(key: any) {
//         if (this._col == null)
//             return null;

//         return BravoGlobalize.format(key, this._col.format);
//     }
// }

// export class BravoWebGridRender {
//     public static fillSearchedText(pGrid: WjFlexGrid, e: BravoFormatItemEventArgs, pHighlightTexts: string[], css?: any, pzSearch?: string) {
//         if ((pHighlightTexts == null || pHighlightTexts.length < 1) && e.cell.textContent == null)
//             return false;

//         let _zContent, _bAppendHtml;
//         /*  if (e.bAppendHtml && e.html) {
//              _bAppendHtml = true;
//              _zContent = String.format("<div>{0} {1}</div>",
//                  "<div>" + wjc.escapeHtml(e.cell.textContent) + "</div>", e.html);
//              e.bAppendHtml = false;
//          }
//          else { */
//         _zContent = e.cell.textContent;
//         // }

//         let _zText = pzSearch ? pzSearch.normalize() : _zContent.normalize();
//         let _lst = new Array<CharacterRange>();

//         for (let _i = 0; _i < pHighlightTexts.length; _i++) {
//             if (String.isNullOrEmpty(pHighlightTexts[_i])) continue;

//             let _zHighlightText = pHighlightTexts[_i].normalize();
//             let _zNonAccentHighlightText = _zHighlightText.normalize().removeAccent();

//             let _bIsAccents = true;
//             let _ct = pGrid.columns[e.col].dataType;

//             if (_ct == null || _ct == wjc.DataType.String)
//                 _bIsAccents = String.compare(_zHighlightText, _zNonAccentHighlightText) != 0;

//             let _nStartPos = -1, _nBeginSearch = 0;
//             let _z = _bIsAccents ? _zText : _zText.removeAccent();

//             let _zLowerCase = _z.toLowerCase();

//             while (true) {
//                 _nStartPos = _zLowerCase.indexOf(_bIsAccents ?
//                     _zHighlightText.toLowerCase() :
//                     _zNonAccentHighlightText.toLowerCase(), _nBeginSearch);

//                 if (_nStartPos >= _nBeginSearch) {
//                     _lst.push(new CharacterRange(_nStartPos, _bIsAccents ? _zHighlightText.length : _zNonAccentHighlightText.length));
//                     if (_lst.length >= 32) break;

//                     _nBeginSearch = _nStartPos + 1;
//                     if (_nBeginSearch >= _z.length)
//                         break;
//                 }
//                 else {
//                     break;
//                 }
//             }

//             if (_lst.length < 1) continue;

//             let _zText1 = _zText,
//                 _args = new Array<string>();

//             for (const _c of _lst) {
//                 let _zSubStr = _zText.substr(_c.first, _c.length);

//                 if (!_zSubStr.match(IgnoreNumber)) {
//                     let _regExp = '((((?<!{(\\d*))(' + _zSubStr + ')(?!({\\d+}))))|(((?<=})(' + _zSubStr + ')(?=({)))))';
//                     _zText1 = _zText1.replace(new RegExp(_regExp), "{" + _lst.indexOf(_c) + "}");
//                 }
//                 else {
//                     _zText1 = _zText1.replace(_zSubStr, "{" + _lst.indexOf(_c) + "}");
//                 }

//                 _args.push(String.format("<span style='background:yellow;'>{0}</span>", wjc.escapeHtml(_zSubStr)));
//             }

//             if (_zText1 && _args.length > 0) {
//                 if (!_bAppendHtml)
//                     _zText1 = _zText1.replace(/ /g, '&nbsp');

//                 try {
//                     e.html = String.format(_zText1, ..._args);
//                     if (css && !_bAppendHtml) css['display'] = 'block';
//                 }
//                 catch (_ex) {
//                     console.log(_ex);
//                 }
//             }
//         }
//     }

//     public static fillSearchedText1(pGrid: WjFlexGrid, e: BravoFormatItemEventArgs, pHighlightTexts: string[], css?: any, pzSearch?: string) {
//         if ((pHighlightTexts == null || pHighlightTexts.length < 1) && e.cell.textContent == null)
//             return;

//         let _zContent, _bAppendHtml;
//         if (String.isNullOrEmpty(pzSearch)) {
//             if (e.bAppendHtml && e.html) {
//                 _bAppendHtml = true;
//                 _zContent = String.format("<div>{0} {1}</div>",
//                     "<div>" + wjc.escapeHtml(e.cell.textContent) + "</div>", e.html);
//                 e.bAppendHtml = false;
//             }
//             else {
//                 _zContent = e.cell.textContent;
//             }
//         }

//         let _zText = pzSearch ? pzSearch.normalize() : _zContent.normalize();
//         let _lst = new Array<CharacterRange>();

//         for (let _i = 0; _i < pHighlightTexts.length; _i++) {
//             if (String.isNullOrEmpty(pHighlightTexts[_i])) continue;

//             let _zHighlightText = pHighlightTexts[_i].normalize();
//             let _zNonAccentHighlightText = _zHighlightText.normalize().removeAccent();

//             let _bIsAccents = true;
//             let _ct = pGrid ? pGrid.columns[e.col].dataType : null;
//             if (_ct == null || _ct == wjc.DataType.String)
//                 _bIsAccents = String.compare(_zHighlightText, _zNonAccentHighlightText) != 0;

//             let _nStartPos = -1, _nBeginSearch = 0;
//             let _z = _bIsAccents ? _zText : _zText.removeAccent();

//             if (_bAppendHtml) {
//                 e.cell.innerHTML = _zContent;

//                 this.highlightText(e.cell.childNodes, _bIsAccents ?
//                     _zHighlightText :
//                     _zNonAccentHighlightText);
//                 e.html = e.cell.innerHTML;

//                 return;
//             }

//             while (true) {
//                 _nStartPos = regexIndexOf(_z, new RegExp(_bIsAccents ?
//                     _zHighlightText : _zNonAccentHighlightText, 'gi'), _nBeginSearch);

//                 if (_nStartPos >= _nBeginSearch) {
//                     _lst.push(new CharacterRange(_nStartPos, _bIsAccents ? _zHighlightText.length : _zNonAccentHighlightText.length));
//                     if (_lst.length >= 32) break;

//                     _nBeginSearch = _nStartPos + 1;
//                     if (_nBeginSearch >= _z.length)
//                         break;
//                 }
//                 else {
//                     break;
//                 }
//             }

//             if (_lst.length < 1) continue;

//             let _zText1 = _zText,
//                 _args = new Array<string>();

//             for (const _c of _lst) {
//                 let _zSubStr = _zText.substr(_c.first, _c.length);

//                 if (!_zSubStr.match(IgnoreNumber)) {
//                     let _regExp = '((((?<!{(\\d*))(' + _zSubStr + ')(?!({\\d+}))))|(((?<=})(' + _zSubStr + ')(?=({)))))';
//                     _zText1 = _zText1.replace(new RegExp(_regExp), "{" + _lst.indexOf(_c) + "}");
//                 }
//                 else {
//                     _zText1 = _zText1.replace(_zSubStr, "{" + _lst.indexOf(_c) + "}");
//                 }

//                 _args.push(String.format("<span style='background:yellow;'>{0}</span>", wjc.escapeHtml(_zSubStr)));
//             }

//             if (_zText1 && _args.length > 0) {
//                 if (!_bAppendHtml)
//                     _zText1 = _zText1.replace(/ /g, '&nbsp');

//                 try {
//                     const _zHtml = String.format(_zText1, ..._args);

//                     if (e) e.html = _zHtml
//                     if (css && !_bAppendHtml) css['display'] = 'block';

//                     return _zHtml;
//                 }
//                 catch (_ex) {
//                     console.log(_ex);
//                 }
//             }
//         }
//     }

//     private static highlightText(nodeList: any, what: any) {
//         // traverse all the children nodes
//         for (var x = 0; x < nodeList.length; x++) {

//             // text node, search directly
//             if (nodeList[x].nodeType == 3) {

//                 // if it contains the text that you are looking for, proceed with the replacement

//                 if (regexIndexOf(nodeList[x].textContent, new RegExp(what, 'gi'), 0) >= 0) {
//                     // create a new element with the replacement text
//                     var replacementNode = document.createElement("span");
//                     replacementNode.innerHTML = this.fillSearchedText1(null, null, [what], {},
//                         nodeList[x].textContent);

//                     // replace the old node with the new one
//                     var parentN = nodeList[x].parentNode;
//                     parentN.replaceChild(replacementNode, parentN.childNodes[x]);

//                 }
//             } else {
//                 // element node --> search in its children nodes
//                 this.highlightText(nodeList[x].childNodes, what);
//             }
//         }
//     }
// }

function regexIndexOf(string: any, regex: any, startpos: any) {
  var indexOf = string.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
}

// export function hasProperty(pOwner: Object, pzPropName: string, outProp?: { name?: string }) {
//     if (pOwner == null || String.isNullOrEmpty(pzPropName))
//         return false;

//     let _zPropName = Reflect.has(pOwner, pzPropName) ? pzPropName : null;

//     if (!isExactlyProperty(pOwner, pzPropName)) {
//         if (String.isNullOrEmpty(_zPropName)) {
//             let _zPropLowerCase = pzPropName.toLowerCase();
//             _zPropName = Reflect.has(pOwner, _zPropLowerCase) ? _zPropLowerCase : null;
//         }

//         if (String.isNullOrEmpty(_zPropName)) {
//             let _zPropFirstLowerCase = pzPropName.firstLowerCase();
//             _zPropName = Reflect.has(pOwner, _zPropFirstLowerCase) ? _zPropFirstLowerCase : null;
//         }
//     }

//     if (!String.isNullOrEmpty(_zPropName)) {
//         if (outProp != null) outProp.name = _zPropName;
//         return true;
//     }

//     return false;
// }

// export function containsRule(selector: string, ruleList: CSSRuleList): boolean {
//     if (String.isNullOrEmpty(selector) || ruleList == null || ruleList.length < 1)
//         return false;

//     for (let i = ruleList.length - 1; i >= 0; i--) {
//         let _rule = ruleList.item(i);
//         if (_rule instanceof CSSStyleRule && _rule.selectorText == selector)
//             return true;
//     }

//     return false;
// }

// export function indexOfRule(selector: string, ruleList: CSSRuleList): number {
//     if (String.isNullOrEmpty(selector) || ruleList == null || ruleList.length < 1)
//         return -1;

//     for (let i = ruleList.length - 1; i >= 0; i--) {
//         let _rule = ruleList.item(i);
//         if (_rule instanceof CSSStyleRule && _rule.selectorText == selector)
//             return i;
//     }

//     return -1;
// }

// export function setIgnored(row: wjg.Row, pbIgnored: boolean);
// export function setIgnored(col: wjg.Column, pbIgnored: boolean);
// export function setIgnored(item: any, pbIgnored?: boolean) {
//     if (item instanceof wjg.Column)
//         item.mask = pbIgnored ? IgnoreHeaderEditmask : String.empty;

//     if (item instanceof wjg.Row)
//         item['_mask'] = pbIgnored ? IgnoreHeaderEditmask : String.empty;
// }

// export function isIgnored(row: wjg.Row);
// export function isIgnored(col: wjg.Column);
export function isIgnored(item: any) {
  if (item instanceof wjg.Column) return item.mask == IgnoreHeaderEditmask;

  if (item instanceof wjg.Row) return item['_mask'] == IgnoreHeaderEditmask;

  return false;
}

export function MakeProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true,
  };
}

// export function BravoValueAccessorFactory(directive: any) {
//     return new BravoValueAccessor(directive);
// }

export function pxToPt(val: number) {
  return (val * 72) / BravoSettings.BaseDpi.x;
}

// export function fontSizeToPxConvert(pzFontSize: string): number {
//     if (String.isNullOrEmpty(pzFontSize)) return BravoSettings.current.nFontSize;

//     if (pzFontSize.includes('px')) {
//         pzFontSize = pzFontSize.replace('px', '');
//         if (Number.isNumber(pzFontSize))
//             return Number.asNumber(pzFontSize);
//     }

//     if (pzFontSize.includes('pt')) {
//         pzFontSize = pzFontSize.replace('pt', '');
//         if (Number.isNumber(pzFontSize))
//             return Math.round((Number.asNumber(pzFontSize) * BravoSettings.BaseDpi.x) / 72);
//     }

//     if (pzFontSize.includes('in')) {
//         pzFontSize = pzFontSize.replace('in', '');
//         if (Number.isNumber(pzFontSize)) {
//             let _num = Number.asNumber(pzFontSize) * BravoSettings.BaseDpi.x;
//             return Number.isNaN(_num) ? BravoSettings.current.nFontSize : _num;
//         }
//     }

//     return BravoSettings.current.nFontSize;
// }

export function buildHashName(content: any) {
  if (!wjc.isString(content)) content = JSON.stringify(content);

  let _zHash = crypto.SHA256(content).toString();
  return _zHash.substr(0, 9);
}

// export function addStyleElement(element: HTMLElement, pzStyleName: string, css: string, selector?: string)
// export function addStyleElement(element: HTMLElement, pzStyleName: string, css: any, selector: string)
// export function addStyleElement(element: HTMLElement, pzStyleName: string, css: any, selector?: string) {
//     if (!String.isNullOrEmpty(selector) && wjc.isObject(css))
//         css = `${selector} {${BravoCore.toCssString(css)}}`;

//     let _style: HTMLStyleElement = element.querySelector(String.format("style#{0}", pzStyleName))
//     if (_style == null) {
//         _style = document.createElement('style');
//         _style.type = 'text/css';
//         _style.id = pzStyleName;

//         element.appendChild(_style);
//     }
//     else {
//         _style.innerText = null;
//     }

//     _style.appendChild(document.createTextNode(css));
// }

export function measureText(
  pzText: string,
  pnWidth: number,
  pCell: HTMLElement,
  cache?: any
): { width: number; height: number; } {
  // if (!BravoCore.isDefined(pzText)) return { width: 0, height: 0 };
  let _style = getComputedStyle(pCell);

  let _str =
    pzText.length +
    ':' +
    pnWidth +
    ':' +
    _style.fontWeight +
    ':' +
    _style.fontFamily +
    ':' +
    _style.fontSize;

  if (wjc.isObject(cache) && cache[_str]) return cache[_str];

  let _eMeasure = document.createElement('div');
  _eMeasure.innerHTML = pzText;
  _eMeasure.style.visibility = 'hidden';

  if (pnWidth) {
    _eMeasure.style.width = pnWidth + 'px';
    _eMeasure.style.textOverflow = 'clip';
  } else {
    _eMeasure.style.paddingRight = _style.paddingRight;
    _eMeasure.style.paddingLeft = _style.paddingLeft;

    _eMeasure.style.fontFamily = _style.fontFamily;
    _eMeasure.style.fontWeight = _style.fontWeight;
    _eMeasure.style.fontSize = _style.fontSize;

    _eMeasure.style.borderRightWidth = _style.borderRightWidth;
    _eMeasure.style.borderRightStyle = _style.borderRightStyle;
    _eMeasure.style.borderRightColor = _style.borderRightColor;
  }

  _eMeasure.style.paddingTop = _style.paddingTop;
  _eMeasure.style.paddingBottom = _style.paddingBottom;

  _eMeasure.style.borderBottomWidth = _style.borderBottomWidth;
  _eMeasure.style.borderBottomStyle = _style.borderBottomStyle;
  _eMeasure.style.borderBottomColor = _style.borderBottomColor;

  _eMeasure.style.cssFloat = 'left';

  document.body.appendChild(_eMeasure);

  let _size = {
    width: _eMeasure.offsetWidth,
    height: _eMeasure.offsetHeight,
  };

  document.body.removeChild(_eMeasure);

  if (typeof cache != 'object') cache = {};

  cache[_str] = _size;

  return _size;
}

// export function getCellType(style: CellStyle): GridCellTypeEnum {
//     if (style == null)
//         return GridCellTypeEnum.Normal;

//     let _zType: string = style[StyleElementFlags[StyleElementFlags.DataType]];
//     if (_zType != null) {
//         if (BravoDataTypeConverter.convertTypeCodeStringToDataType(_zType) == wjc.DataType.Boolean &&
//             style[StyleElementFlags[StyleElementFlags.Display]] != 'None' &&
//             style[StyleElementFlags[StyleElementFlags.Display]] != 'TextOnly')
//             return GridCellTypeEnum.Check;
//     }

//     if (String.isNullOrEmpty(style["Format"]))
//         return GridCellTypeEnum.Normal;

//     let _zFormat: string = style["Format"];

//     if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.img]) == 0)
//         return GridCellTypeEnum.img;

//     if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.rtf]) == 0)
//         return GridCellTypeEnum.rtf;

//     if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.html]) == 0)
//         return GridCellTypeEnum.html;

//     if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.barcode]))
//         return GridCellTypeEnum.barcode;

//     if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.qrcode]))
//         return GridCellTypeEnum.qrcode;

//     if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.progress]))
//         return GridCellTypeEnum.progress;

//     if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.link]))
//         return GridCellTypeEnum.link;

//     return GridCellTypeEnum.Normal;
// }

export function findFormBak(element: HTMLElement) {
  let _forms = document.querySelectorAll('.bravo-form');
  if (_forms.length < 1) return null;

  for (let _i = _forms.length - 1; _i >= 0; _i--) {
    let _formElm = _forms.item(_i);
    if (wjc.contains(_formElm, element)) {
      let _form = wjc.Control.getControl(_formElm);
      if (_form != null) return _form;
    }
  }

  return null;
}

export function findForm(host: HTMLElement) {
  let _hostForm = wjc.closestClass(host, 'bravo-form');
  let _form = wjc.Control.getControl(_hostForm);

  return wjc.tryCast(_form, 'IBravoForm');
}

export function getControl(element: any) {
  let _ctrl: any = null;
  while (element instanceof HTMLElement && element.parentElement) {
    element = element.parentElement;

    _ctrl = wjc.Control.getControl(element);
    if (
      _ctrl &&
      !_ctrl.isDisabled &&
      element instanceof HTMLElement &&
      element.classList.contains('bravo-control')
    )
      break;
  }

  return _ctrl;
}

// export function getDropDownControl() {
//     let _dicDropDown = new Map();
//     let _dropDowns = document.querySelectorAll('.wj-dropdown-panel');
//     let _nMax = 0;

//     _dropDowns.forEach((item: HTMLElement, index) => {
//         let _ctrl = wjc.Control.getControl(item);
//         if (_ctrl) {
//             let _styleCss = getComputedStyle(item);
//             let _zIndex = Number.asNumber(_styleCss.zIndex);
//             if (_nMax < _zIndex)
//                 _nMax = _zIndex;

//             if (!_dicDropDown.has(_zIndex))
//                 _dicDropDown.set(_zIndex, _ctrl);
//         }
//     })

//     let _ctrl = _dicDropDown.size > 0 && _dicDropDown.has(_nMax) ? _dicDropDown.get(_nMax) : null;
//     if (_ctrl instanceof Popup)
//         return _ctrl

//     if (_ctrl instanceof Menu)
//         return _ctrl;

//     if (_ctrl instanceof wjc.Control) {
//         let _cv = wjc.tryCast(_ctrl['itemsSource'], Array) as Array<any>;
//         if (_cv && _cv.length > 0) {
//             let _ctrl0 = _cv.find(item => wjc.tryCast(item, wjc.Control));
//             if (_ctrl0) return _ctrl0;
//         }
//     }

//     return _ctrl;
// }

export function getActiveControl() {
  let _activeElement = wjc.getActiveElement();
  if (_activeElement == null) return;

  let _hostCtrl =
    wjc.closestClass(_activeElement, 'bravo-control') ||
    wjc.closestClass(_activeElement, 'wj-control');
  let _ctrl = wjc.Control.getControl(_hostCtrl);

  return _ctrl;
}

export function isCellValid(
  pPanel: wjg.GridPanel,
  pnRow: number,
  pnCol: number
) {
  return !isCellInValid(pPanel, pnRow, pnCol);
}

export function isCellInValid(
  pPanel: wjg.GridPanel,
  pnRow: number,
  pnCol: number
) {
  if (!isRowInValid(pPanel, pnRow)) return isColInValid(pPanel, pnCol);

  return true;
}

export function isColInValid(pPanel: wjg.GridPanel, pnCol: number) {
  if (pnCol >= 0) return pnCol >= pPanel.columns.length;

  return true;
}

export function isRowInValid(pPanel: wjg.GridPanel, pnRow: number) {
  if (pnRow >= 0) return pnRow >= pPanel.rows.length;

  return true;
}

// export function toAggregateWijmo(aggregate: AggregateEnum) {
//     switch (aggregate) {
//         case AggregateEnum.Average:
//             return wjc.Aggregate.Avg;
//         case AggregateEnum.Count:
//             return wjc.Aggregate.Cnt;
//         case AggregateEnum.Max:
//             return wjc.Aggregate.Max;
//         case AggregateEnum.Min:
//             return wjc.Aggregate.Min;
//         case AggregateEnum.Std:
//             return wjc.Aggregate.Std;
//         case AggregateEnum.StdPop:
//             return wjc.Aggregate.StdPop;
//         case AggregateEnum.Sum:
//             return wjc.Aggregate.Sum;
//         case AggregateEnum.Var:
//             return wjc.Aggregate.Var;
//         case AggregateEnum.VarPop:
//             return wjc.Aggregate.VarPop;
//         default:
//             return wjc.Aggregate.None;
//     }
// }

class CharacterRange {
  public first: number;
  public length: number;

  constructor(first: number, length: number) {
    this.first = first;
    this.length = length;
  }

  public equals(obj: any) {
    if (this.first == obj.first && this.length == obj.length) return true;

    return false;
  }
}
