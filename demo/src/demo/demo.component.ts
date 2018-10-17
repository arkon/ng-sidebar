import { Component } from '@angular/core';

@Component({
  selector: 'demo',
  template: `
    <ng-sidebar-container
        (onBackdropClicked)="_onBackdropClicked()">
      <ng-sidebar
        [(opened)]="_opened"
        [mode]="_MODES[_modeNum]"
        [keyClose]="_keyClose"
        [position]="_POSITIONS[_positionNum]"
        [dock]="_dock"
        [dockedSize]="'50px'"
        [autoCollapseHeight]="_autoCollapseHeight"
        [autoCollapseWidth]="_autoCollapseWidth"
        [closeOnClickOutside]="_closeOnClickOutside"
        [closeOnClickBackdrop]="_closeOnClickBackdrop"
        [openOnHover]="_openOnHover"
        [delayBeforeOpen]="_delayBeforeOpen"
        [delayBeforeClose]="_delayBeforeClose"
        [enableSliding]="_enableSliding"
        [thresholdToClose]="_thresholdToClose"
        [showBackdrop]="_showBackdrop"
        [animate]="_animate"
        [trapFocus]="_trapFocus"
        [autoFocus]="_autoFocus"
        [sidebarClass]="'demo-sidebar'"
        [ariaLabel]="'My sidebar'"
        (onOpenStart)="_onOpenStart()"
        (onOpened)="_onOpened()"
        (onCloseStart)="_onCloseStart()"
        (onClosed)="_onClosed()"
        (onTransitionEnd)="_onTransitionEnd()">
        <p>Sidebar contents</p>

        <button class="demo-control" (click)="_toggleOpened()">Close sidebar</button>
        <p><a closeSidebar>This will close the sidebar too</a></p>
        <hr>

        <ul class="sidebar-menu">
          <li><a href="#">option 1</a></li>
          <li><a href="#">option 2</a></li>
          <li><a href="#">option 3</a></li>
          <li><a href="#">option 4</a></li>
          <li><a href="#">option 5</a></li>
          <li><a href="#">option 6</a></li>
          <li><a href="#">option 7</a></li>
          <li><a href="#">option 8</a></li>
          <li><a href="#">option 9</a></li>
          <li><a href="#">option 10</a></li>
          <li><a href="#">option 11</a></li>
          <li><a href="#">option 12</a></li>
          <li><a href="#">option 13</a></li>
          <li><a href="#">option 14</a></li>
          <li><a href="#">option 15</a></li>
          <li><a href="#">option 16</a></li>
          <li><a href="#">option 17</a></li>
          <li><a href="#">option 18</a></li>
          <li><a href="#">option 19</a></li>
        </ul>

      </ng-sidebar>

      <div ng-sidebar-content>
        <header class="demo-header">
          <button (click)="_toggleOpened()" class="demo-header__toggle">Toggle sidebar</button>
          <span>ng-sidebar</span>
        </header>

        <section class="demo-contents">
          <h1>Options</h1>

          <h2>Sidebar</h2>

          <div>
            <button class="demo-control" (click)="_toggleOpened()">opened ({{_opened}})</button>
            <button class="demo-control" (click)="_toggleMode()">mode ({{_MODES[_modeNum]}})</button>
            <button class="demo-control" (click)="_togglePosition()">position ({{_POSITIONS[_positionNum]}})</button>
            <button class="demo-control" (click)="_toggleDock()">dock ({{_dock}})</button>
          </div>

          <div>
            <button class="demo-control" (click)="_toggleAutoCollapseHeight()">Auto collapse at 500px height ({{_autoCollapseHeight ? 'true' : 'false'}})</button>
            <button class="demo-control" (click)="_toggleAutoCollapseWidth()">Auto collapse at 500px width ({{_autoCollapseWidth ? 'true' : 'false'}})</button>
          </div>

          <div>
            <button class="demo-control" (click)="_toggleCloseOnClickOutside()">closeOnClickOutside ({{_closeOnClickOutside}})</button>
            <button class="demo-control" (click)="_toggleCloseOnClickBackdrop()">closeOnClickBackdrop ({{_closeOnClickBackdrop}})</button>
            <button class="demo-control" (click)="_toggleShowBackdrop()">showBackdrop ({{_showBackdrop}})</button>
            <button class="demo-control" (click)="_toggleAnimate()">animate ({{_animate}})</button>
          </div>

          <div>
            <button class="demo-control" (click)="_toggleTrapFocus()">trapFocus ({{_trapFocus}})</button>
            <button class="demo-control" (click)="_toggleAutoFocus()">autoFocus ({{_autoFocus}})</button>
            <button class="demo-control" (click)="_toggleKeyClose()">keyClose ({{_keyClose}})</button>
          </div>

          <div>
            <button class="demo-control" (click)="_toggleOpenOnHover()">openOnHover ({{_openOnHover}})</button>
            <span class="demo-input-group">
              <label for="delayOpen">Delay before open: </label>
              <input id="delayOpen" name="delayOpen" class="demo-input-control" type="number" [value]="_delayBeforeOpen" (change)="_setDelayBeforeOpen($event)">
              <span class="info">Set to {{ _delayBeforeOpen }}</span>
            </span>
            <span class="demo-input-group">
              <label for="delayClose">Delay before close: </label>
              <input id="delayClose" name="delayClose" class="demo-input-control" type="number" [value]="_delayBeforeClose" (change)="_setDelayBeforeClose($event)">
              <span class="info">Set to {{ _delayBeforeClose }}</span>
            </span>
          </div>

          <div>
            <button class="demo-control" (click)="_toggleEnableSliding()">enableSliding wuth Touch ({{_enableSliding}})</button>
            <span class="demo-input-group">
              <label for="thresholdToClose">Threshold to close: </label>
              <input id="thresholdToClose" name="thresholdToClose" class="demo-input-control" type="number" [value]="_thresholdToClose" (change)="_setThresholdToClose($event)">
              <span class="info">Set to {{ _thresholdToClose }}</span>
            </span>
          </div>

          <h1>Documentation</h1>

          <p><a href="https://github.com/arkon/ng-sidebar#readme">See the README on GitHub for more options and info.</a></p>


          <h1>Download</h1>

          <p>Download from <a href="https://www.npmjs.com/package/ng-sidebar">NPM</a>.</p>
          <p>Source code available on <a href="https://github.com/arkon/ng-sidebar">GitHub</a>.</p>
          <p>Source code for this demo is also on <a href="https://github.com/arkon/ng-sidebar/tree/master/demo">GitHub</a>.</p>


          <h1>Some filler content</h1>

          <p>Lie on your belly and purr when you are asleep attack feet spit up on light gray carpet instead of adjacent linoleum but scream at teh bath. Throwup on your pillow steal the warm chair right after you get up for cat slap dog in face. Scratch leg; meow for can opener to feed me. Jump off balcony, onto stranger's head sleep on dog bed, force dog to sleep on floor so jump around on couch, meow constantly until given food, . Use lap as chair hide head under blanket so no one can see sleep on keyboard, for lick plastic bags intently sniff hand burrow under covers. Lick butt and make a weird face. Purr for no reason kitty loves pigs but intrigued by the shower, but scratch the furniture. Lay on arms while you're using the keyboard hate dog get video posted to internet for chasing red dot. If it smells like fish eat as much as you wish chase ball of string and favor packaging over toy. Hide head under blanket so no one can see. Kitty power! purr while eating yet lick the other cats behind the couch. Walk on car leaving trail of paw prints on hood and windshield you call this cat food? ears back wide eyed poop on grasses. Scratch the furniture flop over russian blue or eat grass, throw it back up for hide at bottom of staircase to trip human. Tuxedo cats always looking dapper scratch leg; meow for can opener to feed me. Under the bed need to chase tail claws in your leg, and loves cheeseburgers and intently stare at the same spot chase dog then run away. Nap all day lick sellotape pooping rainbow while flying in a toasted bread costume in space ignore the squirrels, you'll never catch them anyway but destroy couch. Lick yarn hanging out of own butt knock dish off table head butt cant eat out of my own dish lick plastic bags pee in the shoe. Hopped up on catnip chirp at birds kitty power! sleep nap. Climb leg damn that dog . Flee in terror at cucumber discovered on floor. Stare at ceiling light sun bathe. Dream about hunting birds when in doubt, wash or intently stare at the same spot, yet shove bum in owner's face like camera lens. Cat slap dog in face. Need to chase tail meowwww.</p>

          <p>Brown cats with pink ears stares at human while pushing stuff off a table i like big cats and i can not lie or chase laser scamper have secret plans, but fall asleep on the washing machine. Stare at ceiling destroy couch as revenge russian blue for leave fur on owners clothes slap owner's face at 5am until human fills food dish for claws in your leg stare at wall turn and meow stare at wall some more meow again continue staring . Steal the warm chair right after you get up use lap as chair howl uncontrollably for no reason for kitty scratches couch bad kitty so poop in the plant pot, wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again. Paw at beetle and eat it before it gets away chase dog then run away. Sleep on dog bed, force dog to sleep on floor i am the best refuse to leave cardboard box yet lounge in doorway but Gate keepers of hell. My left donut is missing, as is my right destroy the blinds refuse to leave cardboard box. Ears back wide eyed shake treat bag. Lick butt present belly, scratch hand when stroked, eat the fat cats food, why must they do that favor packaging over toy. Scratch leg; meow for can opener to feed me shove bum in owner's face like camera lens. Missing until dinner time meow. Attack the dog then pretend like nothing happened run in circles, and steal the warm chair right after you get up and inspect anything brought into the house, yet poop in litter box, scratch the walls. Sit in window and stare ooo, a bird! yum hide when guests come over rub face on everything, so knock dish off table head butt cant eat out of my own dish pee in the shoe sit in box. Pelt around the house and up and down stairs chasing phantoms bleghbleghvomit my furball really tie the room together yet all of a sudden cat goes crazy, and get video posted to internet for chasing red dot. Inspect anything brought into the house scratch leg; meow for can opener to feed me but bathe private parts with tongue then lick owner's face kitty power! . Hola te quiero use lap as chair. Intently sniff hand eat a plant, kill a hand or lick the other cats but climb a tree, wait for a fireman jump to fireman then scratch his face yet meowing non stop for food. Thug cat immediately regret falling into bathtub so sit on human kitty scratches couch bad kitty. Please stop looking at your phone and pet me. Lounge in doorway destroy couch, and if it fits, i sits wake up human for food at 4am. Instantly break out into full speed gallop across the house for no reason chew on cable leave fur on owners clothes yet chase mice, so gnaw the corn cob so throwup on your pillow. Intrigued by the shower scratch the furniture but shove bum in owner's face like camera lens so wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again yet sit on the laptop. Love to play with owner's hair tie thug cat drink water out of the faucet. I am the best kick up litter yet hide from vacuum cleaner and behind the couch, attack feet gnaw the corn cob. Howl uncontrollably for no reason human give me attention meow for hola te quiero.</p>

          <p>Sit on human gnaw the corn cob but lounge in doorway yet ears back wide eyed. Hide when guests come over rub face on everything, fall asleep on the washing machine you call this cat food? for wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again for spread kitty litter all over house. If it fits, i sits eat grass, throw it back up stick butt in face. Peer out window, chatter at birds, lure them to mouth. Put toy mouse in food bowl run out of litter box at full speed inspect anything brought into the house, for eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap chase laser. Human give me attention meow spit up on light gray carpet instead of adjacent linoleum for hunt by meowing loudly at 5am next to human slave food dispenser thinking longingly about tuna brine. Asdflkjaertvlkjasntvkjn (sits on keyboard) stare at the wall, play with food and get confused by dust flop over need to chase tail damn that dog so mew get video posted to internet for chasing red dot. Groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked! cats go for world domination for stare at ceiling, or purr while eating yet kitty loves pigs.</p>

          <p>Text from <a href="http://www.catipsum.com/">Cat Ipsum</a>.</p>
        </section>
      </div>
    </ng-sidebar-container>
  `
})
export class DemoComponent {
  private _opened: boolean = false;
  private _modeNum: number = 0;
  private _positionNum: number = 0;
  private _dock: boolean = true; // false
  private _closeOnClickOutside: boolean = true; // false
  private _closeOnClickBackdrop: boolean = true; // false
  private _showBackdrop: boolean = true; // false
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = true;
  private _keyClose: boolean = true; // false
  private _autoCollapseHeight: number = null;
  private _autoCollapseWidth: number = null;
  private _openOnHover: boolean = true;
  private _delayBeforeOpen: number = 200;
  private _delayBeforeClose: number = 300;
  private _enableSliding: boolean = false;
  private _thresholdToClose: number = 30;

  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  private _toggleOpened(): void {
    this._opened = !this._opened;
  }

  private _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }

  private _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }

  private _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }

  private _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  private _toggleDock(): void {
    this._dock = !this._dock;
  }

  private _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }

  private _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }

  private _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }

  private _toggleAnimate(): void {
    this._animate = !this._animate;
  }

  private _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }

  private _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }

  private _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }

  private _toggleOpenOnHover(): void {
    this._openOnHover = !this._openOnHover;
  }

  private _setDelayBeforeOpen(event): void {
    const value: number = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this._delayBeforeOpen = value;
    }
  }

  private _setDelayBeforeClose(event): void {
    const value: number = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this._delayBeforeClose = value;
    }
  }

  private _toggleEnableSliding(event): void {
    this._enableSliding = !this._enableSliding;
  }

  private _setThresholdToClose(event): void {
    const value: number = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this._thresholdToClose = value;
    }
  }

  private _onOpenStart(): void {
    console.info('Sidebar opening');
  }

  private _onOpened(): void {
    console.info('Sidebar opened');
  }

  private _onCloseStart(): void {
    console.info('Sidebar closing');
  }

  private _onClosed(): void {
    console.info('Sidebar closed');
  }

  private _onTransitionEnd(): void {
    console.info('Transition ended');
  }

  private _onBackdropClicked(): void {
    console.info('Backdrop clicked');
  }
}
