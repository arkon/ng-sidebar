"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var sidebar_component_1 = require('./sidebar.component');
exports.SIDEBAR_POSITION = sidebar_component_1.SIDEBAR_POSITION;
var close_directive_1 = require('./close.directive');
var SidebarModule = (function () {
    function SidebarModule() {
    }
    SidebarModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [sidebar_component_1.Sidebar, close_directive_1.CloseSidebar],
                    imports: [common_1.CommonModule],
                    exports: [sidebar_component_1.Sidebar, close_directive_1.CloseSidebar]
                },] },
    ];
    SidebarModule.ctorParameters = [];
    return SidebarModule;
}());
exports.SidebarModule = SidebarModule;
