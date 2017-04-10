import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from './sidebar.component';
import { SidebarContainer } from './sidebar-container.component';
import { SidebarService } from './sidebar.service';
import { CloseSidebar } from './close.directive';

@NgModule({
  declarations: [Sidebar, SidebarContainer, CloseSidebar],
  imports: [CommonModule],
  exports: [Sidebar, SidebarContainer, CloseSidebar],
  providers: [SidebarService]
})
export class SidebarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SidebarModule
    };
  }
}
