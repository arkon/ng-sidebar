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
var core_1 = require('@angular/core');
var Sidebar = (function () {
    function Sidebar() {
        this.open = false;
        this.openChange = new core_1.EventEmitter();
        this.pullRight = false;
        this.closeOnClickOutside = false;
        this.showOverlay = false;
        this.onOpen = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        this._onClickOutsideAttached = false;
        this._onClickOutside = this._onClickOutside.bind(this);
    }
    Sidebar.prototype.ngOnInit = function () {
        this._initCloseOnClickOutside();
    };
    Sidebar.prototype.ngOnDestroy = function () {
        this._destroyCloseOnClickOutside();
    };
    Sidebar.prototype.ngOnChanges = function (changes) {
        if (changes['open']) {
            if (this.open) {
                this.onOpen.emit(null);
                this._initCloseOnClickOutside();
            }
            else {
                this.onClose.emit(null);
                this._destroyCloseOnClickOutside();
            }
        }
        if (changes['closeOnClickOutside']) {
            this._initCloseOnClickOutside();
        }
    };
    Sidebar.prototype._initCloseOnClickOutside = function () {
        var _this = this;
        if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
            setTimeout(function () {
                document.body.addEventListener('click', _this._onClickOutside);
                _this._onClickOutsideAttached = true;
            }, 0);
        }
    };
    Sidebar.prototype._destroyCloseOnClickOutside = function () {
        if (this._onClickOutsideAttached) {
            document.body.removeEventListener('click', this._onClickOutside);
            this._onClickOutsideAttached = false;
        }
    };
    Sidebar.prototype._onClickOutside = function (e) {
        if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
            this.open = false;
            this.openChange.emit(false);
            this.onClose.emit(null);
            this._destroyCloseOnClickOutside();
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
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "pullRight", void 0);
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
        __metadata('design:type', String)
    ], Sidebar.prototype, "sidebarClassName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Sidebar.prototype, "overlayClassName", void 0);
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
    Sidebar = __decorate([
        core_1.Component({
            selector: 'ng2-sidebar',
            styles: ["\n    .ng2-sidebar {\n      background: #fff;\n      bottom: 0;\n      box-shadow: 0 0 2.5em rgba(84,85,85,0.5);\n      left: 0;\n      max-width: 250px;\n      overflow: auto;\n      padding: 2em 1em;\n      pointer-events: none;\n      position: fixed;\n      top: 0;\n      transform: translateX(-110%);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n      width: 100%;\n      will-change: transform;\n      z-index: 99999999;\n    }\n\n      .ng2-sidebar--pull-right {\n        left: auto;\n        right: 0;\n        transform: translateX(110%);\n      }\n\n      .ng2-sidebar.ng2-sidebar--open {\n        pointer-events: auto;\n        transform: none;\n        will-change: initial;\n      }\n\n    .ng2-sidebar__overlay {\n      background: #000;\n      height: 100%;\n      left: 0;\n      opacity: 0.75;\n      position: fixed;\n      top: 0;\n      width: 100%;\n      z-index: 99999998;\n    }\n  "],
            template: "\n    <aside #sidebar\n      class=\"ng2-sidebar\"\n      [class.ng2-sidebar--open]=\"open\"\n      [class.ng2-sidebar--pull-right]=\"pullRight\"\n      [ngClass]=\"sidebarClassName\">\n      <ng-content></ng-content>\n    </aside>\n\n    <div *ngIf=\"showOverlay && open\"\n      class=\"ng2-sidebar__overlay\"\n      [ngClass]=\"overlayClassName\"></div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Sidebar);
    return Sidebar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
