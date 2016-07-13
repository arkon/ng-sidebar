import { Component } from '@angular/core';
import Sidebar from 'ng2-sidebar';

@Component({
  selector: 'demo',
  directives: [Sidebar],
  template: `
    <ng2-sidebar [open]="_open" [pullRight]="_pullRight">
      <p>Hello world</p>
    </ng2-sidebar>

    <button (click)="_toggleSidebar()">Toggle open</button>
    <button (click)="_togglePullRight()">Toggle pullRight</button>

    <p>Lie on your belly and purr when you are asleep attack feet spit up on light gray carpet instead of adjacent linoleum but scream at teh bath. Throwup on your pillow steal the warm chair right after you get up for cat slap dog in face. Scratch leg; meow for can opener to feed me. Jump off balcony, onto stranger's head sleep on dog bed, force dog to sleep on floor so jump around on couch, meow constantly until given food, . Use lap as chair hide head under blanket so no one can see sleep on keyboard, for lick plastic bags intently sniff hand burrow under covers. Lick butt and make a weird face. Purr for no reason kitty loves pigs but intrigued by the shower, but scratch the furniture. Lay on arms while you're using the keyboard hate dog get video posted to internet for chasing red dot. If it smells like fish eat as much as you wish chase ball of string and favor packaging over toy. Hide head under blanket so no one can see. Kitty power! purr while eating yet lick the other cats behind the couch. Walk on car leaving trail of paw prints on hood and windshield you call this cat food? ears back wide eyed poop on grasses. Scratch the furniture flop over russian blue or eat grass, throw it back up for hide at bottom of staircase to trip human. Tuxedo cats always looking dapper scratch leg; meow for can opener to feed me. Under the bed need to chase tail claws in your leg, and loves cheeseburgers and intently stare at the same spot chase dog then run away. Nap all day lick sellotape pooping rainbow while flying in a toasted bread costume in space ignore the squirrels, you'll never catch them anyway but destroy couch. Lick yarn hanging out of own butt knock dish off table head butt cant eat out of my own dish lick plastic bags pee in the shoe. Hopped up on catnip chirp at birds kitty power! sleep nap. Climb leg damn that dog . Flee in terror at cucumber discovered on floor. Stare at ceiling light sun bathe. Dream about hunting birds when in doubt, wash or intently stare at the same spot, yet shove bum in owner's face like camera lens. Cat slap dog in face. Need to chase tail meowwww.</p>
  `
})
export class DemoComponent {
  private _open: boolean = false;
  private _pullRight: boolean = false;

  private _toggleSidebar() {
    this._open = !this._open;
  }

  private _togglePullRight() {
    this._pullRight = !this._pullRight;
  }
}
