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
var platform_browser_1 = require('@angular/platform-browser');
var sidebar_1 = require('./sidebar');
exports.Sidebar = sidebar_1.default;
exports.SIDEBAR_POSITION = sidebar_1.SIDEBAR_POSITION;
var close_1 = require('./close');
exports.CloseSidebar = close_1.default;
exports.SIDEBAR_DIRECTIVES = [sidebar_1.default, close_1.default];
var SidebarModule = (function () {
    function SidebarModule() {
    }
    SidebarModule = __decorate([
        core_1.NgModule({
            declarations: [exports.SIDEBAR_DIRECTIVES],
            imports: [platform_browser_1.BrowserModule],
            exports: [exports.SIDEBAR_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], SidebarModule);
    return SidebarModule;
}());
exports.SidebarModule = SidebarModule;
