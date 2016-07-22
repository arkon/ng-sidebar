import { Directive } from '@angular/core';

@Directive({
  selector: '[closeSidebar]',
  host: {
    '(click)': '_onClick($event)'
  }
})
export default class CloseSidebar {
  private _onClick(e: Event) {

  }
}
