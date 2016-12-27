import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from './sidebar.component';
import { SidebarContainer } from './sidebar-container.component';
import { CloseSidebar } from './close.directive';

@NgModule({
  declarations: [Sidebar, SidebarContainer, CloseSidebar],
  imports: [CommonModule],
  exports: [Sidebar, SidebarContainer, CloseSidebar]
})
export class SidebarModule {}
