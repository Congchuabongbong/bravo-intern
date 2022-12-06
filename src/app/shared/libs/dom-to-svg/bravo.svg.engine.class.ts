// import { Observable } from 'rxjs';
// import * as wjc from '@grapecity/wijmo';
// import * as wjChart from '@grapecity/wijmo.chart';
// import { StyleTextImageAlign } from '../enums';

// export class BravoSvgEngine extends wjChart._SvgRenderEngine {

//   constructor(element: HTMLElement) {
//     super(element);
//   }

//   public calculatePositionRect(pnWidth: number, pnHeight: number, pzAlign: string, pnPercent: number) {
//     let _nX1 = 0, _nX2 = 0, _nY1 = 0, _nY2 = 0;
//     let _rectParent = this.element.getBoundingClientRect();

//     if (_rectParent.width < pnWidth)
//       pnWidth = _rectParent.width;

//     if (_rectParent.height < pnHeight)
//       pnHeight = _rectParent.height;
//     switch (StyleTextImageAlign[pzAlign]) {
//       case StyleTextImageAlign.LeftTop:
//         _nX2 = pnWidth;
//         _nY2 = pnHeight;
//         break;
//       case StyleTextImageAlign.LeftCenter:
//         _nX2 = pnWidth.round(1);
//         _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
//         _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
//         break;
//       case StyleTextImageAlign.LeftBottom:
//         _nX2 = pnWidth.round(1);
//         _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
//         _nY2 = _rectParent.height.round(1);
//         break;
//       case StyleTextImageAlign.CenterTop:
//         _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
//         _nX2 = _nX1 + pnWidth.round(1);
//         _nY2 = pnHeight.round(1);
//         break;
//       case StyleTextImageAlign.CenterCenter:
//         _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
//         _nX2 = _nX1 + pnWidth.round(1);
//         _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
//         _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
//         break;
//       case StyleTextImageAlign.CenterBottom:
//         _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
//         _nX2 = _nX1 + pnWidth.round(1);
//         _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
//         _nY2 = _rectParent.height.round(1);
//         break;
//       case StyleTextImageAlign.RightCenter:
//         _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
//         _nX2 = _nX1 + pnWidth.round(1);
//         _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
//         _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
//         break;
//       case StyleTextImageAlign.RightBottom:
//         _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
//         _nX2 = _nX1 + pnWidth.round(1);
//         _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
//         _nY2 = _rectParent.height.round(1);
//         break;
//       // case StyleTextImageAlign.GeneralTop:
//       // case StyleTextImageAlign.GenralCenter:
//       // case StyleTextImageAlign.GeneralBottom:

//       default:
//         _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
//         _nX2 = _nX1 + pnWidth;
//         _nY2 = pnHeight;
//     }

//     return { x1: _nX1.round(1), x2: _nX2.round(1), y1: _nY1.round(1), y2: _nY2.round(1) };
//   }

//   public static getPostionFillText(pElement: Element, pzAlign: string) {
//     let _attribute = {};
//     let _rectSvg = pElement.getBoundingClientRect();
//     let _pnBoxW = _rectSvg.width,
//       _pnBoxH = _rectSvg.height;

//     switch (StyleTextImageAlign[pzAlign]) {
//       case StyleTextImageAlign.LeftTop:
//         _attribute['x'] = '0';
//         _attribute['y'] = '0';
//         _attribute['text-anchor'] = 'start';
//         _attribute['dominant-baseline'] = 'text-before-edge';
//         break;
//       case StyleTextImageAlign.LeftCenter:
//         _attribute['x'] = '0';
//         _attribute['y'] = (_pnBoxH / 2).toFixed(1);
//         _attribute['text-anchor'] = 'start';
//         _attribute['dominant-baseline'] = 'central';
//         break;
//       case StyleTextImageAlign.LeftBottom:
//         _attribute['x'] = '0';
//         _attribute['y'] = _pnBoxH.toFixed();
//         _attribute['text-anchor'] = 'start';
//         _attribute['dominant-baseline'] = 'text-after-edge';
//         break;
//       case StyleTextImageAlign.CenterTop:
//         _attribute['x'] = (_pnBoxW / 2).toFixed(1);
//         _attribute['y'] = '0';
//         _attribute['text-anchor'] = 'middle';
//         _attribute['dominant-baseline'] = 'text-before-edge';
//         break;
//       case StyleTextImageAlign.CenterCenter:
//         _attribute['x'] = (_pnBoxW / 2).toFixed(1);
//         _attribute['y'] = (_pnBoxH / 2).toFixed(1);
//         _attribute['text-anchor'] = 'middle';
//         _attribute['dominant-baseline'] = 'central';
//         break;
//       case StyleTextImageAlign.CenterBottom:
//         _attribute['x'] = (_pnBoxW / 2).toFixed(1);
//         _attribute['y'] = _pnBoxH.toFixed();
//         _attribute['text-anchor'] = 'middle';
//         _attribute['dominant-baseline'] = 'text-after-edge';
//         break;
//       case StyleTextImageAlign.RightCenter:
//         _attribute['x'] = _pnBoxW.toFixed();
//         _attribute['y'] = (_pnBoxH / 2).toFixed(1);
//         _attribute['text-anchor'] = 'end';
//         _attribute['dominant-baseline'] = 'central';
//         break;
//       case StyleTextImageAlign.RightBottom:
//         _attribute['x'] = _pnBoxW.toFixed();
//         _attribute['y'] = _pnBoxH.toFixed();
//         _attribute['text-anchor'] = 'end';
//         _attribute['dominant-baseline'] = 'text-after-edge';
//         break;
//       // case StyleTextImageAlign.GeneralTop:
//       // case StyleTextImageAlign.GenralCenter:
//       // case StyleTextImageAlign.GeneralBottom:

//       default:
//         _attribute['x'] = _pnBoxW.toFixed();
//         _attribute['y'] = '0';
//         _attribute['text-anchor'] = 'end';
//         _attribute['dominant-baseline'] = 'text-before-edge';
//     }

//     return _attribute;
//   }

//   public applyAttribute(pElement: Element, pAtrribute: any) {
//     for (const key in pAtrribute) {
//       pElement.setAttribute(key, pAtrribute[key]);
//     }
//   }
// }

// export class BravoSvgEngineHelper {
//   public static doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
//   public static svgNS = 'http://www.w3.org/2000/svg';
//   public static xmlns = 'http://www.w3.org/2000/xmlns/';

//   /*public static generateFont(pzFont: string) {
//       let _zFontValue = pzFont;
//       let _zStyleFont = _zFontValue.split(',');
//       let _fontObj = {};

//       if (_zStyleFont.length < 2)
//           _fontObj['font-family'] = _zFontValue.replace(new RegExp(/[,]/, 'g'), " ");
//       else if (_zStyleFont[2] !== null) {
//           let _zFontStyle = _zFontValue.substring(_zFontValue.indexOf('style='));
//           if (_zFontStyle.includes('Regular') || String.isNullOrEmpty(_zFontStyle[2])) {
//               _fontObj['font-style'] = 'normal ';
//           }
//           else {
//               if (_zFontStyle.includes('Italic'))
//                   _fontObj['font-style'] = 'italic ';

//               if (_zFontStyle.includes('Bold'))
//                   _fontObj['font-weight'] = 'bold ';

//               _fontObj['font-size'] = _zStyleFont[1];
//               _fontObj['font-family'] = _zStyleFont[0];
//           }

//           return _fontObj;
//       }
//   }*/

//   public static saveImageToDataUrl(pzFormat: 'png' | 'jpeg' | 'svg', element, option?: { width: number, height: number; }): Observable<any> {
//     if (!String.isNullOrEmpty(pzFormat)) {
//       return new Observable((observer) => {
//         BravoSvgEngineHelper.exportToImage(pzFormat, element, option, (dataURI) => {
//           observer.next(dataURI);
//           observer.complete();
//         });
//       });
//     }
//     return null;
//   }

//   //clone from class ExportHelper in wijmo.chart
//   public static exportToImage(extension, element, options: { width: number, height: number; }, processDataURI) {
//     let image = new Image(),
//       ele = element,
//       dataUrl;

//     dataUrl = BravoSvgEngineHelper.getDataUri(ele);
//     if (extension === 'svg') {
//       processDataURI.call(null, dataUrl);
//     } else {
//       image.onload = () => {
//         let canvas = document.createElement('canvas'),
//           node: any = ele.parentNode || ele,
//           rect = options || wjc.getElementRect(node),
//           uri;

//         canvas.width = rect.width;
//         canvas.height = rect.height;
//         let context = canvas.getContext('2d');
//         //fill background
//         // context.fillStyle = 'none';
//         // context.rect(0, 0, rect.width, rect.height);

//         canvas.style.border = 'black thin solid';

//         let left = window.getComputedStyle(node, null).getPropertyValue('padding-left').replace('px', '');
//         let top = window.getComputedStyle(node, null).getPropertyValue('padding-top').replace('px', '');
//         context.drawImage(image, +left || 0, +top || 0);

//         uri = canvas.toDataURL('image/' + extension);
//         processDataURI.call(null, uri);
//         canvas = null;
//       };
//       image.src = dataUrl;
//     }
//   }

//   //clone from class ExportHelper in wijmo.chart
//   public static getDataUri(ele) {
//     var outer = document.createElement('div'),
//       clone = ele.cloneNode(true),
//       rect, width, height, viewBoxWidth, viewBoxHeight, box, css, parent, s, defs;

//     if (ele.tagName == 'svg') {
//       rect = wjc.getElementRect(ele.parentNode || ele);
//       width = rect.width || 0;
//       height = rect.height || 0;
//       viewBoxWidth = ele.viewBox.baseVal && ele.viewBox.baseVal.width !== 0 ? ele.viewBox.baseVal.width : width;
//       viewBoxHeight = ele.viewBox.baseVal && ele.viewBox.baseVal.height !== 0 ? ele.viewBox.baseVal.height : height;
//     } else {
//       box = ele.getBBox();
//       width = box.x + box.width;
//       height = box.y + box.height;
//       clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));
//       viewBoxWidth = width;
//       viewBoxHeight = height;

//       parent = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//       parent.appendChild(clone);
//       clone = parent;
//     }

//     clone.setAttribute('version', '1.1');
//     clone.setAttributeNS(BravoSvgEngineHelper.xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
//     clone.setAttributeNS(BravoSvgEngineHelper.xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
//     clone.setAttribute('width', width);
//     clone.setAttribute('height', height);
//     //clone.setAttribute('width', width * options.scale);
//     //clone.setAttribute('height', height * options.scale);
//     clone.setAttribute('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);

//     //add FlexChart's class to clone element.
//     wjc.addClass(clone, (ele.parentNode && ele.parentNode.getAttribute('class')) || '');
//     outer.appendChild(clone);

//     css = BravoSvgEngineHelper.getStyles(ele);
//     s = document.createElement('style');
//     s.setAttribute('type', 'text/css');
//     s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
//     defs = document.createElement('defs');
//     defs.appendChild(s);
//     clone.insertBefore(defs, clone.firstChild);

//     // encode then decode to handle `btoa` on Unicode; see MDN for `btoa`.
//     return 'data:image/svg+xml;base64,' + window.btoa((<any>window).unescape(encodeURIComponent(BravoSvgEngineHelper.doctype + outer.innerHTML)));
//   }

//   //clone from class ExportHelper in wijmo.chart
//   public static getStyles(ele) {
//     var css = '',
//       styleSheets = document.styleSheets;

//     if (styleSheets == null || styleSheets.length === 0) {
//       return null;
//     }

//     [].forEach.call(styleSheets, (sheet => {
//       //TODO: href, or other external resources
//       var cssRules;
//       try {
//         if (sheet.cssRules == null || sheet.cssRules.length === 0) {
//           return true;
//         }
//       }
//       //Note that SecurityError exception is specific to Firefox.
//       catch (e) {
//         if (e.name == 'SecurityError') {
//           console.log("SecurityError. Can't read: " + sheet.href);
//           return true;
//         }
//       }
//       cssRules = sheet.cssRules;

//       [].forEach.call(cssRules, (rule => {
//         var style = rule.style,
//           match;

//         if (style == null) {
//           return true;
//         }

//         try {
//           match = ele.querySelector(rule.selectorText);
//         } catch (e) {
//           console.warn('Invalid CSS selector "' + rule.selectorText + '"', e);
//         }

//         if (match) {
//           //var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
//           //css += selector + " { " + rule.style.cssText + " }\n";
//           css += rule.selectorText + " { " + style.cssText + " }\n";
//         } else if (rule.cssText.match(/^@font-face/)) {
//           css += rule.cssText + '\n';
//         }
//       }));
//     }));
//     return css;
//   }
// }
