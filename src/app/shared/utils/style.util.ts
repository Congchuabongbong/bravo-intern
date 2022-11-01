import { IStyleOptions } from './../data-type/grid-layout.data.type';
import { ElementRef, Renderer2 } from "@angular/core";
import { NgStyle } from '@angular/common';

export function updateStyle(styleOptions: NgStyle, render: Renderer2, elementRef: ElementRef) {
    Object.entries(styleOptions).forEach(([styleName, styleValue]) => {
        styleValue && render.setStyle(elementRef.nativeElement, styleName, styleValue);
    });
}