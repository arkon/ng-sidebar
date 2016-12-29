import { Directive } from '@angular/core';

import { SidebarService } from './sidebar.service';

@Directive({
  selector: '[closeSidebar]',
  host: {
    '(click)': '_onClick()'
  }
})
export class CloseSidebar {
  constructor(private _sidebarService: SidebarService) {}

  /** @internal */
  _onClick(): void {
    this._sidebarService.close();
  }
}
