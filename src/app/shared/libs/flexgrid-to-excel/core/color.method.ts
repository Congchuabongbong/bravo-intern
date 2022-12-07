export const rgbRegex: RegExp =
  /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/;
export const rgbaRegex: RegExp =
  /^^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/;
export const hexRegex: RegExp = /^#([0-9a-f]{3}){1,2}$/i;
const convertRgbaToHexExcel = (rgba: string) =>
  `${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    ?.slice(1)
    .map((n: any, i: any) =>
      (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
        .toString(16)
        .padStart(2, '0')
        .replace('NaN', '')
    )
    .join('')}`;
const convertRgbToHexExcel = (rgb: string): string | null => {
  let characterColor: RegExpMatchArray | null = rgb.match(/\d+/g);
  let r = characterColor && (+characterColor[0] as number);
  let g = characterColor && (+characterColor[1] as number);
  let b = characterColor && (+characterColor[2] as number);
  r == 0 && r++;
  g == 0 && g++;
  b == 0 && b++;
  if (r && g && b) {
    return `${((1 << 24) | (r-- << 16) | (g-- << 8) | b--)
      .toString(16)
      .slice(1)}`;
  }
  return null;
};
export const convertFormatColorToHex = (format: string): string | null => {
  if (hexRegex.test(format)) {
    return format.replace('#', '');
  }
  if (rgbRegex.test(format)) {
    return convertRgbToHexExcel(format);
  }
  if (rgbaRegex.test(format)) {
    return convertRgbaToHexExcel(format);
  }
  return null;
};
