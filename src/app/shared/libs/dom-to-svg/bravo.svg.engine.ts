import * as wjChart from '@grapecity/wijmo.chart';
enum StyleTextImageAlign {
  LeftTop,
  LeftCenter,
  LeftBottom,
  CenterTop,
  CenterCenter,
  CenterBottom,
  RightCenter,
  RightBottom
}
export class BravoSvgEngine extends wjChart._SvgRenderEngine {

  constructor(element: HTMLElement) {
    super(element);
  }

  // public calculatePositionRect(pnWidth: number, pnHeight: number, pzAlign: string, pnPercent: number) {
  //   let _nX1 = 0, _nX2 = 0, _nY1 = 0, _nY2 = 0;
  //   let _rectParent = this.element.getBoundingClientRect();

  //   if (_rectParent.width < pnWidth)
  //     pnWidth = _rectParent.width;

  //   if (_rectParent.height < pnHeight)
  //     pnHeight = _rectParent.height;
  //   switch (StyleTextImageAlign[pzAlign]) {
  //     case StyleTextImageAlign.LeftTop:
  //       _nX2 = pnWidth;
  //       _nY2 = pnHeight;
  //       break;
  //     case StyleTextImageAlign.LeftCenter:
  //       _nX2 = pnWidth.round(1);
  //       _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
  //       _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
  //       break;
  //     case StyleTextImageAlign.LeftBottom:
  //       _nX2 = pnWidth.round(1);
  //       _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
  //       _nY2 = _rectParent.height.round(1);
  //       break;
  //     case StyleTextImageAlign.CenterTop:
  //       _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
  //       _nX2 = _nX1 + pnWidth.round(1);
  //       _nY2 = pnHeight.round(1);
  //       break;
  //     case StyleTextImageAlign.CenterCenter:
  //       _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
  //       _nX2 = _nX1 + pnWidth.round(1);
  //       _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
  //       _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
  //       break;
  //     case StyleTextImageAlign.CenterBottom:
  //       _nX1 = (_rectParent.width.round(1) / 2) - (pnWidth.round(1) / 2);
  //       _nX2 = _nX1 + pnWidth.round(1);
  //       _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
  //       _nY2 = _rectParent.height.round(1);
  //       break;
  //     case StyleTextImageAlign.RightCenter:
  //       _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
  //       _nX2 = _nX1 + pnWidth.round(1);
  //       _nY1 = (_rectParent.height.round(1) / 2) - (pnHeight.round(1) / 2);
  //       _nY2 = (_rectParent.height.round(1) / 2) + (pnHeight.round(1) / 2);
  //       break;
  //     case StyleTextImageAlign.RightBottom:
  //       _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
  //       _nX2 = _nX1 + pnWidth.round(1);
  //       _nY1 = _rectParent.height.round(1) - pnHeight.round(1);
  //       _nY2 = _rectParent.height.round(1);
  //       break;
  //     // case StyleTextImageAlign.GeneralTop:
  //     // case StyleTextImageAlign.GenralCenter:
  //     // case StyleTextImageAlign.GeneralBottom:

  //     default:
  //       _nX1 = _rectParent.width.round(1) - pnWidth.round(1);
  //       _nX2 = _nX1 + pnWidth;
  //       _nY2 = pnHeight;
  //   }

  //   return { x1: _nX1.round(1), x2: _nX2.round(1), y1: _nY1.round(1), y2: _nY2.round(1) };
  // }
}
