import { BravoSettings } from './bravo.settings';
import { pxToPt } from './bravo.ui.extensions';

export class Font {
  private _fontFamily: any = 'Segoe UI';

  public get FontFamily(): any {
    return this._fontFamily;
  }

  private _nSize: number = 9.75;

  public get nSize() {
    return this._nSize;
  }

  public get Size(): string {
    return `${this._nSize}pt`;
  }

  private _fontWeight!: string;

  public get fontWeight(): string {
    return this._fontWeight;
  }

  private _fontStyle!: string;

  public get FontStyle(): string {
    return this._fontStyle;
  }

  private _textDecoration!: string;

  public get textDecoration(): string {
    return this._textDecoration;
  }

  public get Bold(): boolean {
    return this.fontWeight == 'bold';
  }

  public get Italic(): boolean {
    return this.FontStyle == 'italic';
  }

  public get Underline(): boolean {
    return this.textDecoration == 'underline';
  }

  public get Strikeout(): boolean {
    return this.textDecoration == 'line-through';
  }

  private _style: any;

  public get Style() {
    return this._style;
  }

  constructor(family: string, size: any, style: any = FontStyle.Regular) {
    this._fontFamily = family;
    this._nSize = this._getFontSize(size)!;

    if (style in FontStyle) {
      this._style = style;

      if (style & FontStyle.Bold) this._fontWeight = 'bold';
      if (style & FontStyle.Italic) this._fontStyle = 'italic';

      if (style & FontStyle.Underline) this._textDecoration = 'underline';
      else if (style & FontStyle.Strikeout)
        this._textDecoration = 'line-through';
    }
  }

  public toCss() {
    let _css = {
      'font-family': '',
      'font-size': '',
      'font-weight': '',
      'font-style': '',
      'text-decoration': '',
      width: 0,
    };

    _css['font-family'] = this.FontFamily;
    // _css['font-size'] = String.format("{0}", this.Size);
    _css['font-weight'] = 'normal';

    if (this.Bold) _css['font-weight'] = 'bold';

    if (this.Italic) _css['font-style'] = 'italic';

    if (this.Underline) _css['text-decoration'] = 'underline';

    if (this.Strikeout) _css['text-decoration'] = 'line-through';

    return _css;
  }

  public static getFontStyle(css: any) {
    if (!css) FontStyle.Regular;

    let _fontWeight = css['font-weight'];
    if (_fontWeight == 'bold' || _fontWeight == 'bolder' || +_fontWeight > 500)
      return FontStyle.Bold;

    if (css['font-style'] == 'italic') return FontStyle.Italic;

    let _textDecoration = css['text-decoration'];
    if (_textDecoration == 'underline') return FontStyle.Underline;

    if (_textDecoration == 'line-through') return FontStyle.Strikeout;

    return FontStyle.Regular;
  }

  private _getFontSize(size: any): number | undefined {
    if (Number(size)) return size;

    if (typeof size === 'string') {
      let _rgx = new RegExp('([0-9]*.?[0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)');
      let _groups = size.match(_rgx);
      if (_groups == null || _groups.length != 3)
        return BravoSettings.current.nFontSize;

      let _nSize = Number(_groups[1]);
      switch (_groups[2]) {
        case 'px':
          return pxToPt(_nSize);

        case 'pt':
          return _nSize;

        default:
          throw new Error('Not support convert' + _groups[2]);
      }
    }
  }

  public static parseFont(pzFont: string, defaultFont?: Font) {
    let _zStyleValue = pzFont;
    let _zStyleFont = _zStyleValue.split(',');
    let _zFontName: string = defaultFont
      ? defaultFont.FontFamily
      : BravoSettings.current.zDefaultFontName,
      _fontSize: any = defaultFont
        ? defaultFont.nSize
        : BravoSettings.current.nFontSize,
      _fontStyle: FontStyle = FontStyle.Regular;

    if (_zStyleFont.length >= 3) {
      if (_zStyleFont[0]) _zFontName = _zStyleFont[0];

      if (_zStyleFont[1]) _fontSize = _zStyleFont[1];

      if (_zStyleFont[2]) {
        let _zFontStyle = _zStyleValue.substring(
          _zStyleValue.indexOf('style=')
        );
        if (_zFontStyle.includes('Italic')) _fontStyle = FontStyle.Italic;

        if (_zFontStyle.includes('Bold')) _fontStyle = FontStyle.Bold;
        else if (_zFontStyle.includes('Regular'))
          _fontStyle = FontStyle.Regular;
        else if (_zFontStyle.includes('Underline'))
          _fontStyle = FontStyle.Underline;
        else if (_zFontStyle.includes('Strikeout'))
          _fontStyle = FontStyle.Strikeout;
      }
    } else if (_zStyleFont.length == 2) {
      if (_zStyleFont[0]) _zFontName = _zStyleFont[0];

      if (_zStyleFont[1]) _fontSize = _zStyleFont[1];
    }

    return new Font(_zFontName, _fontSize, _fontStyle);
  }
}

//TODO: by me
export enum FontStyle {
  Regular = 0,
  Bold = 1,
  Medium = 3,
  Semi_Bold = 5,
  Italic = 2,
  Underline = 4,
  Strikeout = 8,
}
