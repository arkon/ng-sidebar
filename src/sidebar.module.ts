import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from './sidebar.component';
import { CloseSidebar } from './close.directive';

@NgModule({
  declarations: [Sidebar, CloseSidebar],
  imports: [CommonModule],
  exports: [Sidebar, CloseSidebar]
})
export class SidebarModule {}
