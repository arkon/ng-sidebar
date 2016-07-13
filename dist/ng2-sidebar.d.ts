import { ElementRef, OnDestroy, OnInit, Renderer } from '@angular/core';
export default class Sidebar implements OnInit, OnDestroy {
    private _el;
    private _renderer;
    constructor(_el: ElementRef, _renderer: Renderer);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
