import { Component, AnimationTransitionEvent } from '@angular/core';

@Component({
  selector: 'demo',
  template: `
    <ng-sidebar-container>
      <ng-sidebar
        [(open)]="_open"
        [mode]="_mode"
        [keyClose]="_keyClose"
        [defaultStyles]="true"
        [position]="_POSITIONS[_positionNum]"
        [closeOnClickOutside]="_closeOnClickOutside"
        [showBackdrop]="_showBackdrop"
        [animate]="_animate"
        [trapFocus]="_trapFocus"
        [autoFocus]="_autoFocus"
        [sidebarClass]="'demo-sidebar'"
        [ariaLabel]="'My sidebar'"
        (onOpen)="_onOpen()"
        (onClose)="_onClose()"
        (onAnimationStarted)="_onAnimationStarted($event)"
        (onAnimationDone)="_onAnimationDone($event)">
        <p>Sidebar contents</p>

        <button class="demo-control" (click)="_toggleSidebar()">Close sidebar</button>
        <p><a closeSidebar>This will close the sidebar too</a></p>
      </ng-sidebar>

      <header class="demo-header">
        <button (click)="_toggleSidebar()" class="demo-header__toggle">Toggle sidebar</button>
        <span>ng-sidebar</span>
      </header>

      <section class="demo-contents">
        <h1>Controls</h1>

        <button class="demo-control" (click)="_toggleSidebar()">Toggle open ({{_open}})</button>
        <button class="demo-control" (click)="_toggleMode()">Toggle mode ({{_mode}})</button>
        <button class="demo-control" (click)="_togglePosition()">Toggle position ({{_POSITIONS[_positionNum]}})</button>
        <button class="demo-control" (click)="_toggleCloseOnClickOutside()">Toggle closeOnClickOutside ({{_closeOnClickOutside}})</button>
        <button class="demo-control" (click)="_toggleShowBackdrop()">Toggle showBackdrop ({{_showBackdrop}})</button>
        <button class="demo-control" (click)="_toggleAnimate()">Toggle animate ({{_animate}})</button>
        <button class="demo-control" (click)="_toggleTrapFocus()">Toggle trapFocus ({{_trapFocus}})</button>
        <button class="demo-control" (click)="_toggleAutoFocus()">Toggle autoFocus ({{_autoFocus}})</button>
        <button class="demo-control" (click)="_toggleKeyClose()">Toggle keyClose ({{_keyClose}})</button>


        <h1>Download</h1>

        <p>Download from <a href="https://www.npmjs.com/package/ng-sidebar">NPM</a>.</p>
        <p>Source code available on <a href="https://github.com/arkon/ng-sidebar">GitHub</a>.</p>


        <h1>Some filler content</h1>

        <p>Lie on your belly and purr when you are asleep attack feet spit up on light gray carpet instead of adjacent linoleum but scream at teh bath. Throwup on your pillow steal the warm chair right after you get up for cat slap dog in face. Scratch leg; meow for can opener to feed me. Jump off balcony, onto stranger's head sleep on dog bed, force dog to sleep on floor so jump around on couch, meow constantly until given food, . Use lap as chair hide head under blanket so no one can see sleep on keyboard, for lick plastic bags intently sniff hand burrow under covers. Lick butt and make a weird face. Purr for no reason kitty loves pigs but intrigued by the shower, but scratch the furniture. Lay on arms while you're using the keyboard hate dog get video posted to internet for chasing red dot. If it smells like fish eat as much as you wish chase ball of string and favor packaging over toy. Hide head under blanket so no one can see. Kitty power! purr while eating yet lick the other cats behind the couch. Walk on car leaving trail of paw prints on hood and windshield you call this cat food? ears back wide eyed poop on grasses. Scratch the furniture flop over russian blue or eat grass, throw it back up for hide at bottom of staircase to trip human. Tuxedo cats always looking dapper scratch leg; meow for can opener to feed me. Under the bed need to chase tail claws in your leg, and loves cheeseburgers and intently stare at the same spot chase dog then run away. Nap all day lick sellotape pooping rainbow while flying in a toasted bread costume in space ignore the squirrels, you'll never catch them anyway but destroy couch. Lick yarn hanging out of own butt knock dish off table head butt cant eat out of my own dish lick plastic bags pee in the shoe. Hopped up on catnip chirp at birds kitty power! sleep nap. Climb leg damn that dog . Flee in terror at cucumber discovered on floor. Stare at ceiling light sun bathe. Dream about hunting birds when in doubt, wash or intently stare at the same spot, yet shove bum in owner's face like camera lens. Cat slap dog in face. Need to chase tail meowwww.</p>

        <p>Brown cats with pink ears stares at human while pushing stuff off a table i like big cats and i can not lie or chase laser scamper have secret plans, but fall asleep on the washing machine. Stare at ceiling destroy couch as revenge russian blue for leave fur on owners clothes slap owner's face at 5am until human fills food dish for claws in your leg stare at wall turn and meow stare at wall some more meow again continue staring . Steal the warm chair right after you get up use lap as chair howl uncontrollably for no reason for kitty scratches couch bad kitty so poop in the plant pot, wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again. Paw at beetle and eat it before it gets away chase dog then run away. Sleep on dog bed, force dog to sleep on floor i am the best refuse to leave cardboard box yet lounge in doorway but Gate keepers of hell. My left donut is missing, as is my right destroy the blinds refuse to leave cardboard box. Ears back wide eyed shake treat bag. Lick butt present belly, scratch hand when stroked, eat the fat cats food, why must they do that favor packaging over toy. Scratch leg; meow for can opener to feed me shove bum in owner's face like camera lens. Missing until dinner time meow. Attack the dog then pretend like nothing happened run in circles, and steal the warm chair right after you get up and inspect anything brought into the house, yet poop in litter box, scratch the walls. Sit in window and stare ooo, a bird! yum hide when guests come over rub face on everything, so knock dish off table head butt cant eat out of my own dish pee in the shoe sit in box. Pelt around the house and up and down stairs chasing phantoms bleghbleghvomit my furball really tie the room together yet all of a sudden cat goes crazy, and get video posted to internet for chasing red dot. Inspect anything brought into the house scratch leg; meow for can opener to feed me but bathe private parts with tongue then lick owner's face kitty power! . Hola te quiero use lap as chair. Intently sniff hand eat a plant, kill a hand or lick the other cats but climb a tree, wait for a fireman jump to fireman then scratch his face yet meowing non stop for food. Thug cat immediately regret falling into bathtub so sit on human kitty scratches couch bad kitty. Please stop looking at your phone and pet me. Lounge in doorway destroy couch, and if it fits, i sits wake up human for food at 4am. Instantly break out into full speed gallop across the house for no reason chew on cable leave fur on owners clothes yet chase mice, so gnaw the corn cob so throwup on your pillow. Intrigued by the shower scratch the furniture but shove bum in owner's face like camera lens so wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again yet sit on the laptop. Love to play with owner's hair tie thug cat drink water out of the faucet. I am the best kick up litter yet hide from vacuum cleaner and behind the couch, attack feet gnaw the corn cob. Howl uncontrollably for no reason human give me attention meow for hola te quiero.</p>

        <p>Sit on human gnaw the corn cob but lounge in doorway yet ears back wide eyed. Hide when guests come over rub face on everything, fall asleep on the washing machine you call this cat food? for wake up wander around the house making large amounts of noise jump on top of your human's bed and fall asleep again for spread kitty litter all over house. If it fits, i sits eat grass, throw it back up stick butt in face. Peer out window, chatter at birds, lure them to mouth. Put toy mouse in food bowl run out of litter box at full speed inspect anything brought into the house, for eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap chase laser. Human give me attention meow spit up on light gray carpet instead of adjacent linoleum for hunt by meowing loudly at 5am next to human slave food dispenser thinking longingly about tuna brine. Asdflkjaertvlkjasntvkjn (sits on keyboard) stare at the wall, play with food and get confused by dust flop over need to chase tail damn that dog so mew get video posted to internet for chasing red dot. Groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked! cats go for world domination for stare at ceiling, or purr while eating yet kitty loves pigs.</p>

        <p>Text from <a href="http://www.catipsum.com/">Cat Ipsum</a>.</p>
      </section>
    </ng-sidebar-container>
  `
})
export class DemoComponent {
  private _open: boolean = false;
  private _mode: string = 'over';
  private _positionNum: number = 0;
  private _closeOnClickOutside: boolean = false;
  private _showBackdrop: boolean = false;
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = true;
  private _keyClose: boolean = false;

  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  private _toggleSidebar(): void {
    this._open = !this._open;
  }

  private _toggleMode(): void {
    this._mode = this._mode === 'over' ? 'push' : 'over';
  }

  private _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  private _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
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

  private _onOpen(): void {
    console.info('Sidebar opened');
  }

  private _onClose(): void {
    console.info('Sidebar closed');
  }

  private _onAnimationStarted(e: AnimationTransitionEvent): void {
    console.info('Animation started', e);
  }

  private _onAnimationDone(e: AnimationTransitionEvent): void {
    console.info('Animation done', e);
  }
}
