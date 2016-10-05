"use strict";
var core_1 = require('@angular/core');
var CloseSidebar = (function () {
    function CloseSidebar() {
        this.clicked = new core_1.EventEmitter();
    }
    CloseSidebar.prototype._onClick = function () {
        this.clicked.emit(null);
    };
    CloseSidebar.decorators = [
        { type: core_1.Directive, args: [{ selector: '[closeSidebar]' },] },
    ];
    CloseSidebar.ctorParameters = [];
    CloseSidebar.propDecorators = {
        'clicked': [{ type: core_1.Output },],
        '_onClick': [{ type: core_1.HostListener, args: ['click',] },],
    };
    return CloseSidebar;
}());
exports.CloseSidebar = CloseSidebar;
