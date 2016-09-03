"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
        this.defaultStyles = false;
        this.onOpen = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        this._onClickOutsideAttached = false;
        this._focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
            'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
        this._trapFocus = this._trapFocus.bind(this);
        this._onClickOutside = this._onClickOutside.bind(this);
    }
    Sidebar.prototype.ngOnInit = function () {
        this._setvisibleSidebarState();
        this._setFocused(this.open);
        this._initCloseOnClickOutside();
    };
    Sidebar.prototype.ngOnDestroy = function () {
        this._destroyCloseOnClickOutside();
        this._closeDirectives.forEach(function (dir) {
            dir.clicked.unsubscribe();
        });
    };
    Sidebar.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._closeDirectives.forEach(function (dir) {
            dir.clicked.subscribe(function () { return _this._manualClose(); });
        });
    };
    Sidebar.prototype.ngOnChanges = function (changes) {
        if (changes['open']) {
            if (this.open) {
                this._open();
            }
            else {
                this._close();
            }
            this._setvisibleSidebarState();
        }
        if (changes['closeOnClickOutside']) {
            this._initCloseOnClickOutside();
        }
        if (changes['position']) {
            this._setvisibleSidebarState();
        }
    };
    Sidebar.prototype._setvisibleSidebarState = function () {
        this._visibleSidebarState = this.open ? 'expanded' : "collapsed--" + this.position;
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
    Sidebar.prototype._getFocusableElements = function () {
        this._focusableElements = Array.from(this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString));
    };
    Sidebar.prototype._setFocusToFirstItem = function () {
        if (this._focusableElements && this._focusableElements.length) {
            this._focusableElements[0].focus();
        }
    };
    Sidebar.prototype._trapFocus = function (e) {
        if (this.open && !this._elSidebar.nativeElement.contains(e.target)) {
            this._setFocusToFirstItem();
        }
    };
    Sidebar.prototype._setFocused = function (open) {
        this._getFocusableElements();
        if (open) {
            this._focusedBeforeOpen = this._document.activeElement;
            for (var _i = 0, _a = this._focusableElements; _i < _a.length; _i++) {
                var el = _a[_i];
                var prevTabIndex = el.getAttribute('__tabindex__');
                if (prevTabIndex !== null) {
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
                if (existingTabIndex !== null) {
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
            }, 0);
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "open", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Sidebar.prototype, "openChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Sidebar.prototype, "position", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "closeOnClickOutside", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "showOverlay", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "defaultStyles", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Sidebar.prototype, "sidebarClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Sidebar.prototype, "overlayClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Sidebar.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Sidebar.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Sidebar.prototype, "onClose", void 0);
    __decorate([
        core_1.ViewChild('sidebar'), 
        __metadata('design:type', core_1.ElementRef)
    ], Sidebar.prototype, "_elSidebar", void 0);
    __decorate([
        core_1.ContentChildren(close_directive_1.default, { descendants: true }), 
        __metadata('design:type', core_1.QueryList)
    ], Sidebar.prototype, "_closeDirectives", void 0);
    Sidebar = __decorate([
        core_1.Component({
            selector: 'ng2-sidebar',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "\n    <aside #sidebar\n      [@visibleSidebarState]=\"_visibleSidebarState\"\n      role=\"complementary\"\n      [attr.aria-hidden]=\"!open\"\n      [attr.aria-label]=\"ariaLabel\"\n      class=\"ng2-sidebar ng2-sidebar--{{position}}\"\n      [class.ng2-sidebar--style]=\"defaultStyles\"\n      [ngClass]=\"sidebarClass\">\n      <ng-content></ng-content>\n    </aside>\n\n    <div *ngIf=\"showOverlay\"\n      aria-hidden=\"true\"\n      class=\"ng2-sidebar__overlay\"\n      [class.ng2-sidebar__overlay--style]=\"open && defaultStyles\"\n      [ngClass]=\"overlayClass\"></div>\n  ",
            styles: ["\n    .ng2-sidebar {\n      overflow: auto;\n      pointer-events: none;\n      position: fixed;\n      z-index: 99999999;\n    }\n\n      .ng2-sidebar--left {\n        bottom: 0;\n        left: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--right {\n        bottom: 0;\n        right: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--top {\n        left: 0;\n        right: 0;\n        top: 0;\n      }\n\n      .ng2-sidebar--bottom {\n        bottom: 0;\n        left: 0;\n        right: 0;\n      }\n\n      .ng2-sidebar--style {\n        background: #fff;\n        box-shadow: 0 0 2.5em rgba(85, 85, 85, 0.5);\n      }\n\n    .ng2-sidebar__overlay {\n      height: 100%;\n      left: 0;\n      pointer-events: none;\n      position: fixed;\n      top: 0;\n      width: 100%;\n      z-index: 99999998;\n    }\n\n      .ng2-sidebar__overlay--style {\n        background: #000;\n        opacity: 0.75;\n      }\n  "],
            animations: [
                core_1.trigger('visibleSidebarState', [
                    core_1.state('expanded', core_1.style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
                    core_1.state('collapsed--left', core_1.style({ transform: 'translateX(-110%)' })),
                    core_1.state('collapsed--right', core_1.style({ transform: 'translateX(110%)' })),
                    core_1.state('collapsed--top', core_1.style({ transform: 'translateY(-110%)' })),
                    core_1.state('collapsed--bottom', core_1.style({ transform: 'translateY(110%)' })),
                    core_1.transition('* => *', core_1.animate('0.3s cubic-bezier(0, 0, 0.3, 1)'))
                ])
            ]
        }),
        __param(0, core_1.Inject(platform_browser_1.DOCUMENT)), 
        __metadata('design:paramtypes', [HTMLDocument])
    ], Sidebar);
    return Sidebar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
