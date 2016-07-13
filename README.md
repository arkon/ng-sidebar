# ng2-sidebar

[![NPM](https://nodei.co/npm/ng2-sidebar.png?compact=true)](https://nodei.co/npm/ng2-sidebar)

**[Demo](http://echeung.me/ng2-sidebar)**

An Angular 2 sidebar component.


## Installation

```shell
npm install --save ng2-sidebar
```


## Usage

Import the component and add it to the list of directives on your component:

```typescript
import Sidebar from 'ng2-sidebar';

@Component({
  selector: 'example',
  directives: [Sidebar],
  template: `
    <ng2-sidebar [(open)]="_open">
      <p>Sidebar contents</p>
    </ng2-sidebar>

    <button (click)="_toggleSidebar()">Toggle sidebar</button>
  `
})
export class MyComponent {
  private _open: boolean = false;

  private _toggleSidebar() {
    this._open = !this._open;
  }
}
```

### Options

#### `[(open)]="boolean_value"`
Boolean input value that controls the visibility of the sidebar. This should be two-way bound in case
the value changes when the sidebar is closed by clicking outside of it when `closeOnClickOutside` is
enabled.

#### `[pullRight]="boolean_value"`
Boolean input value

#### `[closeOnClickOutside]="boolean_value"`
Boolean input value that controls whether clicking outside of the open sidebar will close it.

#### `[sidebarClassName]="'string_value'"`
A string used as an additional class name on the sidebar element.

#### `(onOpen)="func_call()"`
An output event, emitted when the sidebar is opened.

#### `(onClose)="func_call()"`
An output event, emitted when the sidebar is closed.
