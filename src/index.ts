import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar, SIDEBAR_POSITION } from './sidebar.component';
import { CloseSidebar } from './close.directive';

export { SIDEBAR_POSITION };

@NgModule({
  declarations: [Sidebar, CloseSidebar],
  imports: [CommonModule],
  exports: [Sidebar, CloseSidebar]
})
export class SidebarModule {}
