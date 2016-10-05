import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[closeSidebar]' })
export class CloseSidebar {
  @Output() clicked: EventEmitter<null> = new EventEmitter<null>();

  @HostListener('click')
  _onClick() {
    this.clicked.emit(null);
  }
}
