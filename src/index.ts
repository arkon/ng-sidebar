import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import Sidebar, { SIDEBAR_POSITION } from './sidebar.component';
import CloseSidebar from './close.directive';

export { Sidebar, SIDEBAR_POSITION, CloseSidebar };

const SIDEBAR_DIRECTIVES = [Sidebar, CloseSidebar];

@NgModule({
  declarations: [SIDEBAR_DIRECTIVES],
  imports: [BrowserModule],
  exports: [SIDEBAR_DIRECTIVES]
})
export class SidebarModule {}
