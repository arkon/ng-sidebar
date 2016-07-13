import { Component } from '@angular/core';
import Sidebar from 'ng2-sidebar';

@Component({
  selector: 'demo',
  directives: [Sidebar],
  template: `
    <p>Hello world</p>
  `
})
export class DemoComponent {
}
