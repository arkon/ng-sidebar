import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import Sidebar, { SIDEBAR_POSITION } from './sidebar.component';
import CloseSidebar from './close.directive';

export { SIDEBAR_POSITION };

@NgModule({
  declarations: [Sidebar, CloseSidebar],
  imports: [BrowserModule],
  exports: [Sidebar, CloseSidebar]
})
export class SidebarModule {}
