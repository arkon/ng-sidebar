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
    function Sidebar(_el, _renderer) {
        this._el = _el;
        this._renderer = _renderer;
    }
    Sidebar.prototype.ngOnInit = function () {
    };
    Sidebar.prototype.ngOnDestroy = function () {
    };
    Sidebar = __decorate([
        core_1.Component({
            selector: 'ng2-sidebar',
            template: "\n    <div>\n      Hello world\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], Sidebar);
    return Sidebar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
