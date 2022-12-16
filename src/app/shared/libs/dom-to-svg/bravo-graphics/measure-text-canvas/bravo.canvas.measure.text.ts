import { TextStyle } from './bravo.canvas.text.style';

export interface ITextMetrics {
  text: string; // text that was measured
  style: TextStyle; // style that was measured
  width: number; // measured width of the text
  height: number; // measured height of the text
  lines: Array<string>; // an array of the lines of text broken by new lines and wrapping if specified in style
  lineWidths: Array<number>; // an array of the line widths for each line matched to `lines`
  lineHeight: number; // measured line height for this style
  maxLineWidth: number; // maximum line width for all measured lines
  fontProperties: any; // font properties object from TextMetrics.measureFont
}

const METRICS_STRING = '|Éq';
const BASELINE_SYMBOL = 'M';
const BASELINE_MULTIPLIER = 1.4;

// todo: DI
const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
let fontsCache: any = {};

// Based on TextMetrics in Pixi.js's Canvas Engine
export class BravoTextMetrics implements ITextMetrics {

  constructor(
    public text: string,
    public style: TextStyle,
    public width: number,
    public height: number,
    public lines: Array<any>,
    public lineWidths: Array<any>,
    public lineHeight: number,
    public maxLineWidth: number,
    public fontProperties: any
  ) { }

  static measureText(
    text: string,
    styleObj: TextStyle,
    shouldWordWrap: boolean,
    canvas: HTMLCanvasElement
  ): BravoTextMetrics {
    const { style } = styleObj;
    const wordWrap = !!shouldWordWrap || !!style.wordWrap;
    const font = styleObj.toFontString();
    const fontProperties = BravoTextMetrics.measureFont(styleObj);
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const breakWords = style.breakWords;

    context.font = font;

    const outputText = wordWrap ? BravoTextMetrics.wordWrap(text, style, canvas) : text;
    const lines = outputText.split(/(?:\r\n|\r|\n)/);


    const lineWidths = new Array(lines.length);
    let maxLineWidth = 0;
    let subTextLine = 0;

    for (let i = 0; i < lines.length; i++) {

      if (!wordWrap && breakWords) {
        console.log(123);
        let _zTextLine = lines[i].trim();
        let _textWrap = BravoTextMetrics.wordWrap(_zTextLine, style, canvas);
        let _textWrapLines = _textWrap.split(/(?:\r\n|\r|\n)/);
        if (_textWrapLines.length > 1)
          subTextLine += _textWrapLines.length - 1;
      }

      const lineWidth =
        context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;
      lineWidths[i] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    let width = maxLineWidth + style.strokeThickness;

    if (style.dropShadow)
      width += style.dropShadowDistance;

    const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    let height =
      Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) +
      (lines.length - 1 + subTextLine) * (lineHeight + style.leading);

    if (style.dropShadow) {
      height += style.dropShadowDistance;
    }

    return new BravoTextMetrics(
      text,
      style,
      width,
      height,
      lines,
      lineWidths,
      lineHeight + style.leading,
      maxLineWidth,
      fontProperties
    );
  }

  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   */
  static wordWrap(text: string, style: any, canvas: HTMLCanvasElement): string {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    let width = 0;
    let line = '';
    let lines = '';

    const cache = {};
    const { letterSpacing, whiteSpace } = style;

    // How to handle whitespaces
    const collapseSpaces = BravoTextMetrics.collapseSpaces(whiteSpace);
    const collapseNewlines = BravoTextMetrics.collapseNewlines(whiteSpace);

    // whether or not spaces may be added to the beginning of lines
    let canPrependSpaces = !collapseSpaces;

    // There is letterSpacing after every char except the last one
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
    // so for convenience the above needs to be compared to width + 1 extra letterSpace
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
    // ________________________________________________
    // And then the final space is simply no appended to each line
    const wordWrapWidth = style.wordWrapWidth + letterSpacing;

    // break text into words, spaces and newline chars
    const tokens = BravoTextMetrics.tokenize(text);

    for (let i = 0; i < tokens.length; i++) {
      // get the word, space or newlineChar
      let token = tokens[i];

      // if word is a new line
      if (BravoTextMetrics.isNewline(token)) {
        // keep the new line
        if (!collapseNewlines) {
          lines += BravoTextMetrics.addLine(line);
          canPrependSpaces = !collapseSpaces;
          line = '';
          width = 0;
          continue;
        }

        // if we should collapse new lines
        // we simply convert it into a space
        token = ' ';
      }

      // if we should collapse repeated whitespaces
      if (collapseSpaces) {
        // check both this and the last tokens for spaces
        const currIsBreakingSpace = BravoTextMetrics.isBreakingSpace(token);
        const lastIsBreakingSpace = BravoTextMetrics.isBreakingSpace(line[line.length - 1]);

        if (currIsBreakingSpace && lastIsBreakingSpace) {
          continue;
        }
      }

      // get word width from cache if possible
      const tokenWidth = BravoTextMetrics.getFromCache(token, letterSpacing, cache, context);

      // word is longer than desired bounds
      if ((tokenWidth > wordWrapWidth) || (style.breakWords && tokenWidth > style.width)) {
        // if we are not already at the beginning of a line
        if (line !== '') {
          // start newlines for overflow words
          lines += BravoTextMetrics.addLine(line);
          line = '';
          width = 0;
        }

        // break large word over multiple lines
        if (BravoTextMetrics.canBreakWords(token, style.breakWords)) {
          // break word into characters
          const characters = token.split('');

          let _spaceIdx = -1;

          // loop the characters
          for (let j = 0; j < characters.length; j++) {
            let char = characters[j];

            let k = 1;
            // we are not at the end of the token

            while (characters[j + k]) {
              const nextChar = characters[j + k];
              const lastChar = char[char.length - 1];

              // should not split chars
              if (!BravoTextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                // combine chars & move forward one
                char += nextChar;
              } else {
                break;
              }

              k++;
            }

            j += char.length - 1;

            if (char == " ")
              _spaceIdx = j;

            const characterWidth = BravoTextMetrics.getFromCache(char, letterSpacing, cache, context);

            if (characterWidth > wordWrapWidth || characterWidth > style.width)
              break;

            if ((characterWidth + width > wordWrapWidth) || (characterWidth + width > style.width)) {
              let _nSpaceLastOf = line.lastIndexOf(' ');

              lines += BravoTextMetrics.addLine(line.substring(0, _nSpaceLastOf));
              canPrependSpaces = false;
              line = '';

              if (_spaceIdx !== -1 && characterWidth < width) {
                j = _spaceIdx;
                _spaceIdx = -1;
              }

              width = 0;

              continue;
            }

            line += char;
            width += characterWidth;
          }
        }

        // run word out of the bounds
        else {
          // if there are words in this line already
          // finish that line and start a new one
          if (line.length > 0) {
            lines += BravoTextMetrics.addLine(line);
            line = '';
            width = 0;
          }

          const isLastToken = i === tokens.length - 1;

          // give it its own line if it's not the end
          lines += BravoTextMetrics.addLine(token, !isLastToken);
          canPrependSpaces = false;
          line = '';
          width = 0;
        }
      }

      // word could fit
      else {
        // word won't fit because of existing words
        // start a new line
        if (tokenWidth + width > wordWrapWidth) {
          // if its a space we don't want it
          canPrependSpaces = false;

          // add a new line
          lines += BravoTextMetrics.addLine(line);

          // start a new line
          line = '';
          width = 0;
        }

        // don't add spaces to the beginning of lines
        if (line.length > 0 || !BravoTextMetrics.isBreakingSpace(token) || canPrependSpaces) {
          // add the word to the current line
          line += token;

          // update width counter
          width += tokenWidth;
        }
      }
    }

    lines += BravoTextMetrics.addLine(line, false);
    return lines;
  }

  static addLine(line: string, newLine: boolean = true): string {
    line = BravoTextMetrics.trimRight(line);
    line = newLine ? `${line}\n` : line;
    return line;
  }

  static getFromCache(
    key: string,
    letterSpacing: number,
    cache: any,
    context: CanvasRenderingContext2D
  ): number {
    let width = cache[key];

    if (width === undefined) {
      const spacing = key.length * letterSpacing;
      width = context.measureText(key).width + spacing;
      cache[key] = width;
    }
    return width;
  }

  // Determines whether we should collapse breaking spaces
  static collapseSpaces(whiteSpace: string): boolean {
    return whiteSpace === 'normal' || whiteSpace === 'pre-line';
  }

  // Determines whether we should collapse newLine chars
  static collapseNewlines(whiteSpace: string): boolean {
    return whiteSpace === 'normal';
  }

  // trims breaking whitespaces from string
  static trimRight(text: string): string {
    if (typeof text !== 'string') {
      return '';
    }
    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      if (!BravoTextMetrics.isBreakingSpace(char)) {
        break;
      }
      text = text.slice(0, -1);
    }
    return text;
  }

  // Determines if char is a newline.
  static isNewline(char: string): boolean {
    if (typeof char !== 'string') {
      return false;
    }
    return NEW_LINES.indexOf(char.charCodeAt(0)) >= 0;
  }

  // Determines if char is a breaking whitespace.
  static isBreakingSpace(char: string): boolean {
    if (typeof char !== 'string') {
      return false;
    }
    return BREAKING_SPACES.indexOf(char.charCodeAt(0)) >= 0;
  }

  // Splits a string into words, breaking-spaces and newLine characters
  static tokenize(text: string): Array<any> {
    const tokens: Array<any> = [];
    let token: string = '';

    if (typeof text !== 'string') {
      return tokens;
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/* BravoTextMetrics.isBreakingSpace(char) || */ BravoTextMetrics.isNewline(char)) {
        if (token !== '') {
          tokens.push(token);
          token = '';
        }
        tokens.push(char);
        continue;
      }
      token += char;
    }
    if (token !== '') {
      tokens.push(token);
    }
    return tokens;
  }

  static canBreakWords(token: string, breakWords: boolean): boolean {
    return breakWords;
  }

  static canBreakChars(
    char: string, // cur chat
    nextChar: string, // next char
    token: string, // token/word the characters are from
    index: number, // index in the token of the char
    breakWords: boolean // style attr break words
  ): boolean {
    return true;
  }

  // Calculates the ascent, descent and fontSize of a given font-style
  static measureFont(styleObj: TextStyle) {
    // as this method is used for preparing assets, don't recalculate things if we don't need to
    let _font = styleObj.toFontString();
    if (fontsCache[_font]) {
      return fontsCache[_font];
    }
    const properties: any = {};
    context.font = _font;

    const metricsString = METRICS_STRING + BASELINE_SYMBOL;
    const width = Math.ceil(context.measureText(metricsString).width);
    let baseline = Math.ceil(context.measureText(BASELINE_SYMBOL).width);
    const height = 2 * baseline;

    baseline = (baseline * BASELINE_MULTIPLIER) | 0;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = '#f00';
    context.fillRect(0, 0, width, height);

    context.font = _font;

    context.textBaseline = 'alphabetic';
    context.fillStyle = '#000';
    context.fillText(metricsString, 0, baseline);

    const imagedata = context.getImageData(0, 0, width, height).data;
    const pixels = imagedata.length;
    const line = width * 4;

    let i = 0;
    let idx = 0;
    let stop = false;

    // ascent. scan from top to bottom until we find a non red pixel
    for (i = 0; i < baseline; ++i) {
      for (let j = 0; j < line; j += 4) {
        if (imagedata[idx + j] !== 255) {
          stop = true;
          break;
        }
      }
      if (!stop) {
        idx += line;
      } else {
        break;
      }
    }

    properties.ascent = baseline - i;

    idx = pixels - line;
    stop = false;

    // descent. scan from bottom to top until we find a non red pixel
    for (i = height; i > baseline; --i) {
      for (let j = 0; j < line; j += 4) {
        if (imagedata[idx + j] !== 255) {
          stop = true;
          break;
        }
      }

      if (!stop) {
        idx -= line;
      } else {
        break;
      }
    }
    properties.descent = i - baseline;

    // const _ratioDpi = (devicePixelRatio % 1) === 0 ? 1 : devicePixelRatio % 1;
    // properties.fontSize = properties.ascent + properties.descent + Math.abs(_ratioDpi);

    let _baseSymbol = document.createElement('DIV');
    _baseSymbol.id = '__textMeasure';
    _baseSymbol.classList.add('BRAVO_MEASURE');
    _baseSymbol.innerHTML = BASELINE_SYMBOL;
    _baseSymbol.style.position = 'absolute';
    _baseSymbol.style.top = '-500px';
    _baseSymbol.style.left = '0';
    _baseSymbol.style.fontFamily = styleObj.style.fontFamily;
    _baseSymbol.style.fontWeight = styleObj.style.fontWeight;
    _baseSymbol.style.fontSize = styleObj.style.fontSize;
    document.body.appendChild(_baseSymbol);

    properties.fontSize = parseFloat(getComputedStyle(_baseSymbol).height);

    fontsCache[_font] = properties;

    document.body.removeChild(_baseSymbol);

    return properties;
  }
}

const NEW_LINES = [
  0x000a, // line feed
  0x000d, // carriage return
];

const BREAKING_SPACES = [
  0x0009, // character tabulation
  0x0020, // space
  0x2000, // en quad
  0x2001, // em quad
  0x2002, // en space
  0x2003, // em space
  0x2004, // three-per-em space
  0x2005, // four-per-em space
  0x2006, // six-per-em space
  0x2008, // punctuation space
  0x2009, // thin space
  0x200a, // hair space
  0x205f, // medium mathematical space
  0x3000, // ideographic space
];
