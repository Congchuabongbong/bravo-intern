import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HandleStringService {
  constructor() {}
  public handleSpecialCharacter(value: string): string {
    let convert = value;
    if (convert != null) {
      convert = convert.toLowerCase();
      convert = convert.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      convert = convert.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      convert = convert.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      convert = convert.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      convert = convert.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      convert = convert.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      convert = convert.replace(/đ/g, 'd');
      convert = convert.replace(
        /\[|\]|\(|\)|'|"|`|\\|%|!|#|\$|&|=|~|\^|<|>|\?|\/|\{|\}|\*|\||@|-|:|;/g,
        ''
      );
      convert = convert.replace(/,|\.| |_|\+/g, '-');
    }
    return convert;
  }
}
