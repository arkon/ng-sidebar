"use strict";
var sidebar_1 = require('./sidebar');
exports.Sidebar = sidebar_1.default;
exports.SIDEBAR_POSITION = sidebar_1.SIDEBAR_POSITION;
var close_1 = require('./close');
exports.CloseSidebar = close_1.default;
exports.SIDEBAR_DIRECTIVES = [sidebar_1.default, close_1.default];
