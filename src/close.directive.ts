import { Directive, HostListener } from '@angular/core';

import { SidebarService } from './sidebar.service';

@Directive({ selector: '[closeSidebar]' })
export class CloseSidebar {
  constructor(private _sidebarService: SidebarService) {}

  /** @internal */
  @HostListener('click')
  _onClick(): void {
    this._sidebarService.close();
  }
}
