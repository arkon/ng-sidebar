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
        this.pullRight = false;
        this.onOpen = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
    }
    Sidebar.prototype.ngOnInit = function () {
    };
    Sidebar.prototype.ngOnChanges = function (changes) {
        if (changes['open'] !== undefined) {
            if (changes['open']) {
                this.onOpen.emit(null);
            }
            else {
                this.onClose.emit(null);
            }
        }
    };
    Sidebar.prototype.ngOnDestroy = function () {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "open", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Sidebar.prototype, "pullRight", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Sidebar.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Sidebar.prototype, "onClose", void 0);
    Sidebar = __decorate([
        core_1.Component({
            selector: 'ng2-sidebar',
            styles: ["\n    .ng2-sidebar {\n      background: #fff;\n      bottom: 0;\n      left: 0;\n      max-width: 250px;\n      overflow: auto;\n      padding: 2em 1em;\n      pointer-events: none;\n      position: fixed;\n      top: 0;\n      transform: translateX(-100%);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n      width: 100%;\n      will-change: transform;\n    }\n\n      .ng2-sidebar--pull-right {\n        left: auto;\n        right: 0;\n        transform: translateX(100%);\n      }\n\n      .ng2-sidebar.ng2-sidebar--open {\n        pointer-events: auto;\n        transform: none;\n        will-change: initial;\n      }\n  "],
            template: "\n    <div [ngClass]=\"{ 'ng2-sidebar': true, 'ng2-sidebar--open': open, 'ng2-sidebar--pull-right': pullRight }\">\n      <ng-content></ng-content>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Sidebar);
    return Sidebar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
