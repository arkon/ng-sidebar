import { Directive } from '@angular/core';

import { Sidebar } from './sidebar.component';

@Directive({
  selector: '[closeSidebar]',
  host: {
    '(click)': '_onClick()'
  }
})
export class CloseSidebar {
  constructor(private _sidebar: Sidebar) {}

  /** @internal */
  _onClick(): void {
    this._sidebar.close();
  }
}
