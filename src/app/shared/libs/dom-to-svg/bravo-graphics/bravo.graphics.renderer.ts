import * as wjc from '@grapecity/wijmo';
import { Font } from './font';
import { TextStyle } from './measure-text-canvas/bravo.canvas.text.style';
import { BravoTextMetrics } from './measure-text-canvas/bravo.canvas.measure.text';
import { buildHashName } from './bravo.ui.extensions';
// import { sanitizeHtml } from 'src/app/core/bravo.core';

export class BravoGraphicsRenderer {
  /* public static measureString(pzText: string, font: Font, pnWidth?: number) {
        let _canvas = document.createElement('canvas');
        if (pnWidth) _canvas.width = pnWidth;

        let _ctx = _canvas.getContext('2d');
        _ctx.font = String.format("{0} {1}", font.Size, font.FontFamily);

        let _rs = _ctx.measureText(pzText);
        _canvas.remove();

        return _rs;
    } */

  public static measureCache = new Map<string, TextStyle>();

  public static measureString(
    pzText: string,
    font: Font,
    pnWidth?: number,
    pBreakWords: boolean = true
  ): BravoTextMetrics | undefined {
    // if (pzText != 'NM09/19-002')
    //    return { width: 0, height: 0 };

    // let _fontStyle = Stimulsoft.System.Drawing.FontStyle.Regular;
    // if (font.Bold)
    //    _fontStyle = Stimulsoft.System.Drawing.FontStyle.Bold;
    // else if (font.Italic)
    //    _fontStyle = Stimulsoft.System.Drawing.FontStyle.Italic;
    // else if (font.Underline)
    //    _fontStyle = Stimulsoft.System.Drawing.FontStyle.Underline;
    // else if (font.Strikeout)
    //    _fontStyle = Stimulsoft.System.Drawing.FontStyle.Strikeout;

    // let _font = new Stimulsoft.System.Drawing.Font(font.FontFamily, font.nSize, _fontStyle);
    // return Stimulsoft.System.Drawing.Graphics.measureString(pzText, _font, pnWidth, true);

    let _css = font.toCss(),
      _textStyle = {
        fontFamily: '',
        fontWeight: '',
        fontSize: '',
        fontStyle: '',
        wordWrapWidth: 0,
        breakWords: true,
        width: 0,
      },
      _wordWrap = false;

    if (pnWidth) {
      _wordWrap = true;
      _css['width'] = pnWidth;
    }
    // pzText = String.format("{0}", pzText);

    // if (String.includeNewLine(pzText))
    //     _wordWrap = false;

    if (Object.keys(_css).length > 0) {
      let _zStyleName = buildHashName(_css);
      if (!BravoGraphicsRenderer.measureCache.has(_zStyleName)) {
        if (font.FontFamily) {
          _textStyle['fontFamily'] = font.FontFamily;
        }

        if (font.Bold) {
          _textStyle['fontWeight'] = font.fontWeight;
        }

        if (font.Size) {
          _textStyle['fontSize'] = font.Size;
        }

        if (font.Italic) {
          _textStyle['fontStyle'] = font.FontStyle;
        }

        if (_wordWrap) {
          _textStyle['wordWrapWidth'] = pnWidth!;
        }

        _textStyle['breakWords'] = pBreakWords;
        _textStyle['width'] = pnWidth!;

        BravoGraphicsRenderer.measureCache.set(
          _zStyleName,
          new TextStyle(_textStyle)
        );
      }

      return BravoTextMetrics.measureText(
        pzText,
        BravoGraphicsRenderer.measureCache.get(_zStyleName)!,
        _wordWrap,
        document.createElement('canvas')
      );
    }
  }

  // public static measureHtml(pHtml: string, font?: Font, pnWidth?: number, pbSanitize = false) {
  //     let measureDiv: HTMLElement = document.body.querySelector('.BRAVO_MEASURE')
  //     try {
  //         if (measureDiv == null) {
  //             measureDiv = document.createElement("div");

  //             measureDiv.style.visibility = "hidden";
  //             measureDiv.className = 'BRAVO_MEASURE';

  //             document.body.appendChild(measureDiv);
  //         }

  //         if (pbSanitize)
  //             measureDiv.innerHTML = sanitizeHtml(pHtml)
  //         else
  //             measureDiv.innerHTML = pHtml;

  //         let _firstChild = measureDiv.firstElementChild;

  //         if (_firstChild) {
  //             if (wjc.hasClass(_firstChild, 'hidden'))
  //                 wjc.removeClass(_firstChild, 'hidden');

  //             if (wjc.hasClass(_firstChild, 'wj-state-hidden'))
  //                 wjc.removeClass(_firstChild, 'wj-state-hidden');
  //         }

  //         if (font) {
  //             measureDiv.style.fontSize = String.format("{0}pt", font.nSize);
  //             measureDiv.style.fontFamily = font.FontFamily;
  //         }

  //         if (pnWidth)
  //             measureDiv.style.width = pnWidth + 'px';

  //         return new wjc.Size(_firstChild ? _firstChild.scrollWidth : measureDiv.scrollWidth, measureDiv.scrollHeight);
  //     }
  //     finally {
  //         if (measureDiv)
  //             measureDiv.innerHTML = null;
  //     }
  // }

  public static calculateSizeToFit(
    imageSize: wjc.Size,
    boxSize: wjc.Size,
    pSizeMode: SizeModeEnum
  ) {
    if (pSizeMode == SizeModeEnum.Stretch) return boxSize;
    let _widthScale = boxSize.width / imageSize.width;
    let _heightScale = boxSize.height / imageSize.height;
    let _scale =
      pSizeMode == SizeModeEnum.ZoomOut
        ? Math.max(_widthScale, _heightScale)
        : Math.min(_widthScale, _heightScale);

    return new wjc.Size(
      Math.round(imageSize.width * _scale),
      Math.round(imageSize.height * _scale)
    );
  }
}

export enum SizeModeEnum {
  Stretch,
  ZoomIn,
  ZoomOut,
}
