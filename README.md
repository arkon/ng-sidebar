# ng2-sidebar

[![NPM](https://nodei.co/npm/ng2-sidebar.png?compact=true)](https://nodei.co/npm/ng2-sidebar)

**[Demo](http://echeung.me/ng2-sidebar)**

An Angular 2 sidebar component.


## Installation

```shell
npm install --save ng2-sidebar
```


## Usage

Add `SidebarModule` to your app module:

```typescript
import { SidebarModule } from 'ng2-sidebar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SidebarModule],
  bootstrap: [AppComponent],
})
class AppModule {}
```

In your component, simply use the directive in your template:

```typescript
@Component({
  selector: 'app',
  template: `
    <ng2-sidebar [(open)]="_open">
      <p>Sidebar contents</p>
    </ng2-sidebar>

    <button (click)="_toggleSidebar()">Toggle sidebar</button>
  `
})
export class AppComponent {
  private _open: boolean = false;

  private _toggleSidebar() {
    this._open = !this._open;
  }
}
```

A directive is also provided to easily close the sidebar by clicking something inside it:

```typescript
// If you didn't use the module, explicitely include the directives:
// import { Sidebar, CloseSidebar } from 'ng2-sidebar';
// or:
// import { SIDEBAR_DIRECTIVES } from 'ng2-sidebar';

@Component({
  selector: 'example',
  directives: [Sidebar, CloseSidebar],
  template: `
    <ng2-sidebar [(open)]="_open">
      <a closeSidebar>Closes the sidebar</a>
    </ng2-sidebar>
  `
})
// ...
```


### Options

#### `[(open)]="boolean_value"`
Boolean input value that controls the visibility of the sidebar. This should be two-way bound in case
the value changes when the sidebar is closed by clicking outside of it when `closeOnClickOutside` is
enabled.

Default: `false`.

#### `[position]="'left' | 'right' | 'top' | 'bottom'"`
String indicating what side of the viewport the sidebar should be docked to. You can also import the
`SIDEBAR_POSITION` instead of hardcoding the strings yourself.

Default: `'left'`.

#### `[closeOnClickOutside]="boolean_value"`
Boolean input value that controls whether clicking outside of the open sidebar will close it.

Default: `false`.

#### `[showOverlay]="boolean_value"`
Boolean input value that controls if a translucent black overlay should appear over the page
contents when the sidebar is open.

Default: `false`.

#### `[defaultStyles]="boolean_value"`
Applies some default styles to the sidebar.

Default: `false`.

#### `[sidebarClass]="'string_value'"`
A string used as an additional class name on the sidebar element.

#### `[overlayClass]="'string_value'"`
A string used as an additional class name on the overlay element.

#### `[ariaLabel]="'string_value'"`
A string used as the `aria-label` attribute on the sidebar.

#### `(onOpen)="func_call()"`
An output event, emitted when the sidebar is opened.

#### `(onClose)="func_call()"`
An output event, emitted when the sidebar is closed.
