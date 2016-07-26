import { AfterContentInit, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
export default class Sidebar implements OnInit, OnChanges, OnDestroy, AfterContentInit {
    open: boolean;
    openChange: EventEmitter<boolean>;
    pullRight: boolean;
    closeOnClickOutside: boolean;
    showOverlay: boolean;
    defaultStyles: boolean;
    sidebarClass: string;
    overlayClass: string;
    ariaLabel: string;
    onOpen: EventEmitter<void>;
    onClose: EventEmitter<void>;
    private _elSidebar;
    private _closeDirectives;
    private _onClickOutsideAttached;
    private _focusableElementsString;
    private _focusableElements;
    private _focusedBeforeOpen;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    private _open();
    private _close();
    private _manualClose();
    private _getFocusableElements();
    private _setFocusToFirstItem();
    private _trapFocus(e);
    private _initCloseOnClickOutside();
    private _destroyCloseOnClickOutside();
    private _onClickOutside(e);
}
