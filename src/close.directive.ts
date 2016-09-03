import { Directive, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[closeSidebar]',
  host: {
    '(click)': '_onClick()'
  }
})
export default class CloseSidebar {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  _onClick() {
    this.clicked.emit(null);
  }
}
