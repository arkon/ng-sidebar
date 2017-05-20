import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SidebarModule } from 'ng-sidebar';

import { DemoContainerComponent, DemoComponent } from './demo/demo.component';

import './styles/styles.scss';

enableProdMode();

@NgModule({
  declarations: [DemoContainerComponent, DemoComponent],
  imports: [BrowserModule, SidebarModule.forRoot()],
  bootstrap: [DemoContainerComponent],
})
class DemoAppModule {}

platformBrowserDynamic().bootstrapModule(DemoAppModule);
