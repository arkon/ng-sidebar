import { Directive, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[closeSidebar]',
  host: {
    '(click)': '_onClick($event)'
  }
})
export default class CloseSidebar {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  private _onClick(e: Event) {
    this.clicked.emit(null);
  }
}