"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DemoComponent = (function () {
    function DemoComponent() {
        this._opened = true;
        this._modeNum = 0;
        this._positionNum = 0;
        this._dock = true;
        this._closeOnClickOutside = true;
        this._closeOnClickBackdrop = true;
        this._showBackdrop = true;
        this._animate = true;
        this._trapFocus = true;
        this._autoFocus = true;
        this._keyClose = true;
        this._autoCollapseHeight = null;
        this._autoCollapseWidth = null;
        this._MODES = ['over', 'push', 'slide'];
        this._POSITIONS = ['left', 'right', 'top', 'bottom'];
    }
    DemoComponent.prototype._toggleOpened = function () {
        this._opened = !this._opened;
    };
    DemoComponent.prototype._toggleMode = function () {
        this._modeNum++;
        if (this._modeNum === this._MODES.length) {
            this._modeNum = 0;
        }
    };
    DemoComponent.prototype._toggleAutoCollapseHeight = function () {
        this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
    };
    DemoComponent.prototype._toggleAutoCollapseWidth = function () {
        this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
    };
    DemoComponent.prototype._togglePosition = function () {
        this._positionNum++;
        if (this._positionNum === this._POSITIONS.length) {
            this._positionNum = 0;
        }
    };
    DemoComponent.prototype._toggleDock = function () {
        this._dock = !this._dock;
    };
    DemoComponent.prototype._toggleCloseOnClickOutside = function () {
        this._closeOnClickOutside = !this._closeOnClickOutside;
    };
    DemoComponent.prototype._toggleCloseOnClickBackdrop = function () {
        this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
    };
    DemoComponent.prototype._toggleShowBackdrop = function () {
        this._showBackdrop = !this._showBackdrop;
    };
    DemoComponent.prototype._toggleAnimate = function () {
        this._animate = !this._animate;
    };
    DemoComponent.prototype._toggleTrapFocus = function () {
        this._trapFocus = !this._trapFocus;
    };
    DemoComponent.prototype._toggleAutoFocus = function () {
        this._autoFocus = !this._autoFocus;
    };
    DemoComponent.prototype._toggleKeyClose = function () {
        this._keyClose = !this._keyClose;
    };
    DemoComponent.prototype._onOpenStart = function () {
        console.info('Sidebar opening');
    };
    DemoComponent.prototype._onOpened = function () {
        console.info('Sidebar opened');
    };
    DemoComponent.prototype._onCloseStart = function () {
        console.info('Sidebar closing');
    };
    DemoComponent.prototype._onClosed = function () {
        console.info('Sidebar closed');
    };
    DemoComponent.prototype._onTransitionEnd = function () {
        console.info('Transition ended');
    };
    DemoComponent.prototype._onBackdropClicked = function () {
        console.info('Backdrop clicked');
    };
    DemoComponent = __decorate([
        core_1.Component({
            selector: 'demo',
            template: "\n    <ng-sidebar-container\n        (onBackdropClicked)=\"_onBackdropClicked()\">\n      <ng-sidebar\n        [(opened)]=\"_opened\"\n        [mode]=\"_MODES[_modeNum]\"\n        [keyClose]=\"_keyClose\"\n        [position]=\"_POSITIONS[_positionNum]\"\n        [dock]=\"_dock\"\n        [dockedSize]=\"'50px'\"\n        [autoCollapseHeight]=\"_autoCollapseHeight\"\n        [autoCollapseWidth]=\"_autoCollapseWidth\"\n        [closeOnClickOutside]=\"_closeOnClickOutside\"\n        [closeOnClickBackdrop]=\"_closeOnClickBackdrop\"\n        [showBackdrop]=\"_showBackdrop\"\n        [animate]=\"_animate\"\n        [trapFocus]=\"_trapFocus\"\n        [autoFocus]=\"_autoFocus\"\n        [sidebarClass]=\"'demo-sidebar'\"\n        [ariaLabel]=\"'My sidebar'\"\n        (onOpenStart)=\"_onOpenStart()\"\n        (onOpened)=\"_onOpened()\"\n        (onCloseStart)=\"_onCloseStart()\"\n        (onClosed)=\"_onClosed()\"\n        (onTransitionEnd)=\"_onTransitionEnd()\">\n        <p>Sidebar contents</p>\n\n        <button class=\"demo-control\" (click)=\"_toggleOpened()\">Close sidebar</button>\n        <p><a closeSidebar>This will close the sidebar too</a></p>\n        <hr>\n\n        <ul class=\"sidebar-menu\">\n          <li><a href=\"#\">option 1</a></li>\n          <li><a href=\"#\">option 2</a></li>\n          <li><a href=\"#\">option 3</a></li>\n          <li><a href=\"#\">option 4</a></li>\n          <li><a href=\"#\">option 5</a></li>\n          <li><a href=\"#\">option 6</a></li>\n          <li><a href=\"#\">option 7</a></li>\n          <li><a href=\"#\">option 8</a></li>\n          <li><a href=\"#\">option 9</a></li>\n          <li><a href=\"#\">option 10</a></li>\n          <li><a href=\"#\">option 11</a></li>\n          <li><a href=\"#\">option 12</a></li>\n          <li><a href=\"#\">option 13</a></li>\n          <li><a href=\"#\">option 14</a></li>\n          <li><a href=\"#\">option 15</a></li>\n          <li><a href=\"#\">option 16</a></li>\n          <li><a href=\"#\">option 17</a></li>\n          <li><a href=\"#\">option 18</a></li>\n          <li><a href=\"#\">option 19</a></li>\n        </ul>\n\n      </ng-sidebar>\n\n      <div ng-sidebar-content>\n        <header class=\"demo-header\">\n          <button (click)=\"_toggleOpened()\" class=\"demo-header__toggle\">Toggle sidebar</button>\n          <span>ng-sidebar</span>\n        </header>\n\n        <section class=\"demo-contents\">\n          <h1>Options</h1>\n\n          <h2>Sidebar</h2>\n\n          <div>\n            <button class=\"demo-control\" (click)=\"_toggleOpened()\">opened ({{_opened}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleMode()\">mode ({{_MODES[_modeNum]}})</button>\n            <button class=\"demo-control\" (click)=\"_togglePosition()\">position ({{_POSITIONS[_positionNum]}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleDock()\">dock ({{_dock}})</button>\n          </div>\n\n          <div>\n            <button class=\"demo-control\" (click)=\"_toggleAutoCollapseHeight()\">Auto collapse at 500px height ({{_autoCollapseHeight ? 'true' : 'false'}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleAutoCollapseWidth()\">Auto collapse at 500px width ({{_autoCollapseWidth ? 'true' : 'false'}})</button>\n          </div>\n\n          <div>\n            <button class=\"demo-control\" (click)=\"_toggleCloseOnClickOutside()\">closeOnClickOutside ({{_closeOnClickOutside}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleCloseOnClickBackdrop()\">closeOnClickBackdrop ({{_closeOnClickBackdrop}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleShowBackdrop()\">showBackdrop ({{_showBackdrop}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleAnimate()\">animate ({{_animate}})</button>\n          </div>\n\n          <div>\n            <button class=\"demo-control\" (click)=\"_toggleTrapFocus()\">trapFocus ({{_trapFocus}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleAutoFocus()\">autoFocus ({{_autoFocus}})</button>\n            <button class=\"demo-control\" (click)=\"_toggleKeyClose()\">keyClose ({{_keyClose}})</button>\n          </div>\n\n\n          <h1>Documentation</h1>\n\n          <p><a href=\"https://github.com/arkon/ng-sidebar#readme\">See the README on GitHub for more options and info.</a></p>\n\n\n          <h1>Download</h1>\n\n          <p>Download from <a href=\"https://www.npmjs.com/package/ng-sidebar\">NPM</a>.</p>\n          <p>Source code available on <a href=\"https://github.com/arkon/ng-sidebar\">GitHub</a>.</p>\n          <p>Source code for this demo is also on <a href=\"https://github.com/arkon/ng-sidebar/tree/master/demo\">GitHub</a>.</p>\n\n\n          <h1>Some filler content</h1>\n\n          <p>Lie on your belly and purr when you are asleep attack feet spit up on light gray carpet instead of adjacent linoleum but scream at teh bath. Throwup on your pillow steal the warm chair right after you get up for cat slap dog in face. Scratch leg; meow for can opener to feed me. Jump off balcony, onto stranger's head sleep on dog bed, force dog to sleep on floor so jump around on couch, meow constantly until given food, . Use lap as chair hide head under blanket so no one can see sleep on keyboard, for lick plastic bags intently sniff hand burrow under covers. Lick butt and make a weird face. Purr for no reason kitty loves pigs but intrigued by the shower, but scratch the furniture. Lay on arms while you're using the keyboard hate dog get video posted to internet for chasing red dot. If it smells like fish eat as much as you wish chase ball of string and favor packaging over toy. Hide head under blanket so no one can see. Kitty power! purr while eating yet lick the other cats behind the couch. Walk on car leaving trail of paw prints on hood and windshield you call this cat food? ears back wide eyed poop on grasses. Scratch the furniture flop over russian blue or eat grass, throw it back up for hide at bottom of staircase to trip human. Tuxedo cats always looking dapper scratch leg; meow for can opener to feed me. Under the bed need to chase tail claws in your leg, and loves cheeseburgers and intently stare at the same spot chase dog then run away. Nap all day lick sellotape pooping rainbow while flying in a toasted bread costume in space ignore the squirrels, you'll never catch them anyway but destroy couch. Lick yarn hanging out of own butt knock dish off table head butt cant eat out of my own dish lick plastic bags pee in the shoe. Hopped up on catnip chirp at birds kitty power! sleep nap. Climb leg damn that dog . Flee in terror at cucumber discovered on floor. Stare at ceiling light sun bathe. Dream about hunting birds when in doubt, wash or intently stare at the same spot, yet shove bum in owner's face like camera lens. Cat slap dog in face. Need to chase tail meowwww.</p>\n\n          <p>Brown cats with pink ears stares at human while pushing stuff off a table i like big cats and i can not lie or chase laser scamper have secret plans, but fall asleep on the washing machine. Stare at ceiling destroy couch as revenge russian blue for leave fur on owners clothes slap owner's face at 5am until human fills food dish for claws in your leg stare at wall turn and meow stare at wall some more meow again continue staring . Steal the warm chair right after you get up use lap as chair howl uncontrollably for no reason for kitty scratches couch bad kitty so poop in the plant pot, wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again. Paw at beetle and eat it before it gets away chase dog then run away. Sleep on dog bed, force dog to sleep on floor i am the best refuse to leave cardboard box yet lounge in doorway but Gate keepers of hell. My left donut is missing, as is my right destroy the blinds refuse to leave cardboard box. Ears back wide eyed shake treat bag. Lick butt present belly, scratch hand when stroked, eat the fat cats food, why must they do that favor packaging over toy. Scratch leg; meow for can opener to feed me shove bum in owner's face like camera lens. Missing until dinner time meow. Attack the dog then pretend like nothing happened run in circles, and steal the warm chair right after you get up and inspect anything brought into the house, yet poop in litter box, scratch the walls. Sit in window and stare ooo, a bird! yum hide when guests come over rub face on everything, so knock dish off table head butt cant eat out of my own dish pee in the shoe sit in box. Pelt around the house and up and down stairs chasing phantoms bleghbleghvomit my furball really tie the room together yet all of a sudden cat goes crazy, and get video posted to internet for chasing red dot. Inspect anything brought into the house scratch leg; meow for can opener to feed me but bathe private parts with tongue then lick owner's face kitty power! . Hola te quiero use lap as chair. Intently sniff hand eat a plant, kill a hand or lick the other cats but climb a tree, wait for a fireman jump to fireman then scratch his face yet meowing non stop for food. Thug cat immediately regret falling into bathtub so sit on human kitty scratches couch bad kitty. Please stop looking at your phone and pet me. Lounge in doorway destroy couch, and if it fits, i sits wake up human for food at 4am. Instantly break out into full speed gallop across the house for no reason chew on cable leave fur on owners clothes yet chase mice, so gnaw the corn cob so throwup on your pillow. Intrigued by the shower scratch the furniture but shove bum in owner's face like camera lens so wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again yet sit on the laptop. Love to play with owner's hair tie thug cat drink water out of the faucet. I am the best kick up litter yet hide from vacuum cleaner and behind the couch, attack feet gnaw the corn cob. Howl uncontrollably for no reason human give me attention meow for hola te quiero.</p>\n\n          <p>Sit on human gnaw the corn cob but lounge in doorway yet ears back wide eyed. Hide when guests come over rub face on everything, fall asleep on the washing machine you call this cat food? for wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again for spread kitty litter all over house. If it fits, i sits eat grass, throw it back up stick butt in face. Peer out window, chatter at birds, lure them to mouth. Put toy mouse in food bowl run out of litter box at full speed inspect anything brought into the house, for eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap chase laser. Human give me attention meow spit up on light gray carpet instead of adjacent linoleum for hunt by meowing loudly at 5am next to human slave food dispenser thinking longingly about tuna brine. Asdflkjaertvlkjasntvkjn (sits on keyboard) stare at the wall, play with food and get confused by dust flop over need to chase tail damn that dog so mew get video posted to internet for chasing red dot. Groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked! cats go for world domination for stare at ceiling, or purr while eating yet kitty loves pigs.</p>\n\n          <p>Text from <a href=\"http://www.catipsum.com/\">Cat Ipsum</a>.</p>\n        </section>\n      </div>\n    </ng-sidebar-container>\n  "
        })
    ], DemoComponent);
    return DemoComponent;
}());
exports.DemoComponent = DemoComponent;
//# sourceMappingURL=demo.component.js.map