"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var close_directive_1 = require('./close.directive');
exports.SIDEBAR_POSITION = {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom'
};
var Sidebar = (function () {
    function Sidebar(_document) {
        this._document = _document;
        this.open = false;
        this.openChange = new core_1.EventEmitter();
        this.position = exports.SIDEBAR_POSITION.Left;
        this.closeOnClickOutside = false;
        this.showOverlay = false;
        this.animate = true;
        this.defaultStyles = false;
        this.trapFocus = true;
        this.onOpen = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        this.onAnimationStarted = new core_1.EventEmitter();
        this.onAnimationDone = new core_1.EventEmitter();
        this._onClickOutsideAttached = false;
        this._focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
            'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
        this._manualClose = this._manualClose.bind(this);
        this._trapFocus = this._trapFocus.bind(this);
        this._onClickOutside = this._onClickOutside.bind(this);
    }
    Sidebar.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._closeDirectives) {
            this._closeDirectives.forEach(function (dir) {
                dir.clicked.subscribe(_this._manualClose);
            });
        }
    };
    Sidebar.prototype.ngOnChanges = function (changes) {
        if (changes['open']) {
            if (this.open) {
                this._open();
            }
            else {
                this._close();
            }
            this._setVisibleSidebarState();
        }
        if (changes['closeOnClickOutside']) {
            this._initCloseOnClickOutside();
        }
        if (changes['position']) {
            this._setVisibleSidebarState();
        }
    };
    Sidebar.prototype.ngOnDestroy = function () {
        this._destroyCloseOnClickOutside();
        if (this._closeDirectives) {
            this._closeDirectives.forEach(function (dir) {
                dir.clicked.unsubscribe();
            });
        }
    };
    Sidebar.prototype._setVisibleSidebarState = function () {
        this._visibleSidebarState = this.open ?
            this.animate ? 'expanded--animate' : 'expanded' :
            "collapsed--" + this.position;
    };
    Sidebar.prototype._open = function () {
        this._setFocused(true);
        this._initCloseOnClickOutside();
        this.onOpen.emit(null);
    };
    Sidebar.prototype._close = function () {
        this._setFocused(false);
        this._destroyCloseOnClickOutside();
        this.onClose.emit(null);
    };
    Sidebar.prototype._manualClose = function () {
        this.open = false;
        this.openChange.emit(false);
        this._close();
    };
    Sidebar.prototype._setFocusToFirstItem = function () {
        if (this._focusableElements && this._focusableElements.length) {
            this._focusableElements[0].focus();
        }
    };
    Sidebar.prototype._trapFocus = function (e) {
        if (this.open && this.trapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
            this._setFocusToFirstItem();
        }
    };
    Sidebar.prototype._setFocused = function (open) {
        this._focusableElements = Array.from(this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString));
        if (open) {
            this._focusedBeforeOpen = this._document.activeElement;
            for (var _i = 0, _a = this._focusableElements; _i < _a.length; _i++) {
                var el = _a[_i];
                var prevTabIndex = el.getAttribute('__tabindex__');
                if (prevTabIndex) {
                    el.setAttribute('tabindex', prevTabIndex);
                    el.removeAttribute('__tabindex__');
                }
                else {
                    el.removeAttribute('tabindex');
                }
            }
            this._setFocusToFirstItem();
            this._document.body.addEventListener('focus', this._trapFocus, true);
        }
        else {
            for (var _b = 0, _c = this._focusableElements; _b < _c.length; _b++) {
                var el = _c[_b];
                var existingTabIndex = el.getAttribute('tabindex');
                if (existingTabIndex) {
                    el.setAttribute('__tabindex__', existingTabIndex);
                }
                el.setAttribute('tabindex', '-1');
            }
            if (this._focusedBeforeOpen) {
                this._focusedBeforeOpen.focus();
            }
            this._document.body.removeEventListener('focus', this._trapFocus, true);
        }
    };
    Sidebar.prototype._initCloseOnClickOutside = function () {
        var _this = this;
        if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
            setTimeout(function () {
                _this._document.body.addEventListener('click', _this._onClickOutside);
                _this._onClickOutsideAttached = true;
            });
        }
    };
    Sidebar.prototype._destroyCloseOnClickOutside = function () {
        if (this._onClickOutsideAttached) {
            this._document.body.removeEventListener('click', this._onClickOutside);
            this._onClickOutsideAttached = false;
        }
    };
    Sidebar.prototype._onClickOutside = function (e) {
        if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
            this._manualClose();
        }
    };
    Sidebar.prototype._animationStarted = function (e) {
        this.onAnimationStarted.emit(e);
    };
    Sidebar.prototype._animationDone = function (e) {
        this.onAnimationDone.emit(e);
    };
    Sidebar.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ng2-sidebar',
                    encapsulation: core_1.ViewEncapsulation.None,
                    template: "\n    <aside #sidebar\n      [@visibleSidebarState]=\"_visibleSidebarState\"\n      (@visibleSidebarState.start)=\"_animationStarted($event)\"\n      (@visibleSidebarState.done)=\"_animationDone($event)\"\n      role=\"complementary\"\n      [attr.aria-hidden]=\"!open\"\n      [attr.aria-label]=\"ariaLabel\"\n      class=\"ng2-sidebar ng2-sidebar--{{position}}\"\n      [class.ng2-sidebar--style]=\"defaultStyles\"\n      [ngClass]=\"sidebarClass\">\n      <ng-content></ng-content>\n    </aside>\n\n    <div *ngIf=\"showOverlay\"\n      aria-hidden=\"true\"\n      class=\"ng2-sidebar__overlay\"\n      [class.ng2-sidebar__overlay--style]=\"open && defaultStyles\"\n      [ngClass]=\"overlayClass\"></div>\n  ",
                    styles: ["\n    .ng2-sidebar {\n      overflow: auto;\n      pointer-events: none;\n      position: fixed;\n      z-index: 99999999;\n    }\n\n      .ng2-sidebar--left {\n        bottom: 0;\n        left: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--right {\n        bottom: 0;\n        right: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--top {\n        left: 0;\n        right: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--bottom {\n        bottom: 0;\n        left: 0;\n        right: 0;\n      }\n\n      .ng2-sidebar--style {\n        background: #fff;\n        box-shadow: 0 0 2.5em rgba(85, 85, 85, 0.5);\n      }\n\n    .ng2-sidebar__overlay {\n      height: 100%;\n      left: 0;\n      pointer-events: none;\n      position: fixed;\n      top: 0;\n      width: 100%;\n      z-index: 99999998;\n    }\n\n      .ng2-sidebar__overlay--style {\n        background: #000;\n        opacity: 0.75;\n      }\n  "],
                    animations: [
                        core_1.trigger('visibleSidebarState', [
                            core_1.state('expanded', core_1.style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
                            core_1.state('expanded--animate', core_1.style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
                            core_1.state('collapsed--left', core_1.style({ transform: 'translateX(-110%)' })),
                            core_1.state('collapsed--right', core_1.style({ transform: 'translateX(110%)' })),
                            core_1.state('collapsed--top', core_1.style({ transform: 'translateY(-110%)' })),
                            core_1.state('collapsed--bottom', core_1.style({ transform: 'translateY(110%)' })),
                            core_1.transition('expanded--animate <=> *', core_1.animate('0.3s cubic-bezier(0, 0, 0.3, 1)'))
                        ])
                    ]
                },] },
    ];
    Sidebar.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Inject, args: [platform_browser_1.DOCUMENT,] },] },
    ];
    Sidebar.propDecorators = {
        'open': [{ type: core_1.Input },],
        'openChange': [{ type: core_1.Output },],
        'position': [{ type: core_1.Input },],
        'closeOnClickOutside': [{ type: core_1.Input },],
        'showOverlay': [{ type: core_1.Input },],
        'animate': [{ type: core_1.Input },],
        'defaultStyles': [{ type: core_1.Input },],
        'sidebarClass': [{ type: core_1.Input },],
        'overlayClass': [{ type: core_1.Input },],
        'ariaLabel': [{ type: core_1.Input },],
        'trapFocus': [{ type: core_1.Input },],
        'onOpen': [{ type: core_1.Output },],
        'onClose': [{ type: core_1.Output },],
        'onAnimationStarted': [{ type: core_1.Output },],
        'onAnimationDone': [{ type: core_1.Output },],
        '_elSidebar': [{ type: core_1.ViewChild, args: ['sidebar',] },],
        '_closeDirectives': [{ type: core_1.ContentChildren, args: [close_directive_1.CloseSidebar,] },],
    };
    return Sidebar;
}());
exports.Sidebar = Sidebar;
