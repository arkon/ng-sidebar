import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SidebarModule } from 'ng2-sidebar';

import { DemoComponent } from './demo/demo.component';

enableProdMode();

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, SidebarModule],
  bootstrap: [DemoComponent],
})
class DemoAppModule {}

platformBrowserDynamic().bootstrapModule(DemoAppModule);
