import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
export default class Sidebar implements OnInit, OnChanges, OnDestroy {
    open: boolean;
    openChange: EventEmitter<boolean>;
    pullRight: boolean;
    closeOnClickOutside: boolean;
    showOverlay: boolean;
    sidebarClassName: string;
    overlayClassName: string;
    onOpen: EventEmitter<any>;
    onClose: EventEmitter<any>;
    private _elSidebar;
    private _sidebarClass;
    private _overlayClass;
    private _onClickOutsideAttached;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    private _initCloseOnClickOutside();
    private _destroyCloseOnClickOutside();
    private _onClickOutside(e);
}
