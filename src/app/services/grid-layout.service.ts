import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridLayoutData } from '../data-type';

@Injectable({
  providedIn: 'root'
})

export class GridLayoutService {
  private renderer!: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  public setPositionGirdItem(elRef: ElementRef, position: GridLayoutData.IPositionGridItem) {
    this.renderer.setStyle(elRef.nativeElement, 'grid-row', `${position.rowLine.startLine} / ${position.rowLine.endLine}`)
    this.renderer.setStyle(elRef.nativeElement, 'grid-column', `${position.columnLine.startLine} / ${position.columnLine.endLine}`)
  }
}
