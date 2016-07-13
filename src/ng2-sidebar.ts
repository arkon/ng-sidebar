import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'ng2-sidebar',
  styles: [`
    .ng2-sidebar {
      background: #fff;
      bottom: 0;
      left: 0;
      max-width: 250px;
      overflow: auto;
      padding: 2em 1em;
      pointer-events: none;
      position: fixed;
      top: 0;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      width: 100%;
      will-change: transform;
    }

      .ng2-sidebar--pull-right {
        left: auto;
        right: 0;
        transform: translateX(100%);
      }

      .ng2-sidebar.ng2-sidebar--open {
        pointer-events: auto;
        transform: none;
        will-change: initial;
      }
  `],
  template: `
    <div [ngClass]="{ 'ng2-sidebar': true, 'ng2-sidebar--open': open, 'ng2-sidebar--pull-right': pullRight }">
      <ng-content></ng-content>
    </div>
  `
})
export default class Sidebar implements OnInit, OnChanges, OnDestroy {
  @Input() open: boolean = false;
  @Input() pullRight: boolean = false;

  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['open'] !== undefined) {
      if (changes['open']) {
        this.onOpen.emit(null);
      } else {
        this.onClose.emit(null);
      }
    }
  }

  ngOnDestroy() {
  }
}
