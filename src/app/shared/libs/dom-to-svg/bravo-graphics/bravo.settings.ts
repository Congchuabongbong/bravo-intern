import { EventEmitter } from '@angular/core';
import * as wjc from "@grapecity/wijmo";
// import { BravoLangEnum, BravoClientSettings } from "src/app/core/core";

export class BravoSettings {
    public readonly onFontSizeChanged = new EventEmitter();
    public readonly onLanguageChanged = new EventEmitter();

    private static _current: BravoSettings;

    public static get current(): BravoSettings {
        if (!this._current)
            this._current = new BravoSettings();
        return this._current;
    }

    private constructor() {
        // if (devicePixelRatio > 1.5)
        //     BravoClientSettings.fontSize = BravoSettings.fontSizes[1];

        this.refresh();
    }

    // public get language(): BravoLangEnum {
    //     return BravoClientSettings.currentLang;
    // }

    // public set language(value: BravoLangEnum) {
    //     if (BravoClientSettings.currentLang == value)
    //         return;

    //     BravoClientSettings.currentLang = value;
    //     this.raiseOnLanguageChanged(value);
    // }

    private _zDefaultFontName: string = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    public get zDefaultFontName(): string {
        return this._zDefaultFontName;
    }

    private _nFontSize: number = 9.75;

    public get nFontSize(): number {
        return this._nFontSize;
    }

    public set nFontSize(value: number) {
        if (this._nFontSize == value)
            return;

            this._nFontSize = value;
        this.raiseOnFontSizeChanged(value);
        this.refresh();
    }

    public static readonly BaseDpi: wjc.Point = new wjc.Point(96, 96);

    private static _currentDpi: wjc.Point;

    public static get currentDpi(): wjc.Point {
        if (!this._currentDpi)
            this._currentDpi = new wjc.Point(this.BaseDpi.x * devicePixelRatio, this.BaseDpi.y * devicePixelRatio);

        return this._currentDpi;
    }

    private static _fontSizes: Array<number>;

    public static get fontSizes(): Array<number> {
        if (this._fontSizes == null) {
            this._fontSizes = new Array();
            this._fontSizes.push(8.25);
            this._fontSizes.push(9);
            this._fontSizes.push(9.75);
            this._fontSizes.push(11);
            this._fontSizes.push(12);
        }

        return this._fontSizes;
    }

    public static get bIsDpiScaling(): Boolean {
        return this.bIsDpiXScaling || this.bIsDpiYScaling;
    }

    public static get bIsDpiXScaling(): Boolean {
        return this.BaseDpi.x != this.currentDpi.x;
    }

    public static get bIsDpiYScaling(): Boolean {
        return this.BaseDpi.y != this.currentDpi.y;
    }

    public static toBaseDpiX(pnWidthPixcels: number, pnDpiX: number) {
        if (pnWidthPixcels <= 0) return pnWidthPixcels;

        return Math.ceil(pnWidthPixcels * (this.BaseDpi.y / pnDpiX));
    }

    public static toBaseDpiY(pnHeightPixels: number, pnDpiY: number) {
        if (pnHeightPixels <= 0) return pnHeightPixels;

        return Math.ceil(pnHeightPixels * (this.BaseDpi.y / pnDpiY));
    }

    public static toCurrentDpiX(pnWidth: number) {
        if (pnWidth <= 0) return pnWidth;

        if (!this.bIsDpiXScaling) return pnWidth;

        return pnWidth * (this.currentDpi.x / this.BaseDpi.x);
    }

    public static toCurrentDpiY(pnHeight: number) {
        if (pnHeight <= 0) return pnHeight;

        if (!BravoSettings.bIsDpiYScaling)
            return pnHeight;

        return pnHeight * (BravoSettings.currentDpi.y / BravoSettings.BaseDpi.y);
    }

    public static toCurrentDpi(pnWidth: number, pnHeight: number) {
        if (!BravoSettings.bIsDpiScaling)
            return new wjc.Size(pnWidth, pnHeight);

        return new wjc.Size(this.toCurrentDpiX(pnWidth), this.toCurrentDpiY(pnHeight));
    }

    // public static toCurrentDpiXWithBorder(pnWidth: number) {
        // return pnWidth;

    //     if (pnWidth <= 0) return pnWidth;

    //     if (!this.bIsDpiXScaling) return pnWidth;

    //     return (pnWidth * (this.BaseDpi.x / this.currentDpi.x)).round(2);
    // }

    // public raiseOnLanguageChanged(e?: BravoLangEnum) {
    //     this.onLanguageChanged.emit(e);
    // }

    public raiseOnFontSizeChanged(e?: number) {
        this.onFontSizeChanged.emit(e);
    }

    private refresh() {
        const _css = {
            fontSize: this.nFontSize + 'pt',
            fontFamily: this.zDefaultFontName
        }

        wjc.setCss(document.body, _css);
    }
}
