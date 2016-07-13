import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer
} from '@angular/core';

@Component({
  selector: 'ng2-sidebar',
  template: `
    <div>
      Hello world
    </div>
  `
})
export default class Sidebar implements OnInit, OnDestroy {
  constructor(private _el: ElementRef, private _renderer: Renderer) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
