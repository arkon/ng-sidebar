# ng-sidebar

[![NPM](https://nodei.co/npm/ng-sidebar.png?compact=true)](https://nodei.co/npm/ng-sidebar)

**[Demo](https://echeung.me/ng-sidebar)**

*Formally called [ng2-sidebar](https://github.com/arkon/ng2-sidebar)*

An Angular 2+ sidebar component.


## Installation

```shell
npm install --save ng-sidebar
```

### SystemJS configuration

If you're using SystemJS, be sure to add the appropriate settings to your SystemJS config:

```js
var map = {
  // ...
  'ng-sidebar': 'node_modules/ng-sidebar',
  // ...
};

var packages = {
  // ...
  'ng-sidebar': {
    main: 'lib/index',
    defaultExtension: 'js'
  },
  // ...
};
```

## Changelog

See the [releases page](https://github.com/arkon/ng-sidebar/releases) in the GitHub repo.


## Usage

Add `SidebarModule` to your app module:

```typescript
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SidebarModule],
  bootstrap: [AppComponent],
})
class AppModule {}
```

If you're using it in a feature module, you may need to add it as an import in that module as well.

In your app component, simply use add a `<ng-sidebar-container>` wrapper, then place your `<ng-sidebar>`(s) and content within it:

```typescript
@Component({
  selector: 'app',
  template: `
    <!-- Container for sidebar(s) + page content -->
    <ng-sidebar-container>

      <!-- A sidebar -->
      <ng-sidebar [(opened)]="_opened">
        <p>Sidebar contents</p>
      </ng-sidebar>

      <!-- Page content -->
      <button (click)="_toggleSidebar()">Toggle sidebar</button>

    </ng-sidebar-container>
  `
})
class AppComponent {
  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
}
```

A directive is also provided to easily close the sidebar by clicking something inside it:

```html
<ng-sidebar>
  <a closeSidebar>Closes the sidebar</a>
</ng-sidebar>
```

You can also use the `open()` and `close()` functions:

```html
<ng-sidebar #sidebar>
  <button (click)="sidebar.close()">Close sidebar</button>
</ng-sidebar>

<button (click)="sidebar.open()">Open sidebar</button>
```


## Styling

Various class names are attached to the sidebar and container for easier styling.

### Sidebar

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar` | Always on the sidebar element. |
| `ng-sidebar--opened` | When `opened` is `true`. |
| `ng-sidebar--closed` | When `opened` is `false`. |
| `ng-sidebar--left` | When `position` is `'left'` (or the `'start'`/`'end'` aliases are equivalent to `'left'`). |
| `ng-sidebar--right` | When `position` is `'right'` (or the `'start'`/`'end'` aliases are equivalent to `'right'`). |
| `ng-sidebar--top` | When `position` is `'top'`. |
| `ng-sidebar--bottom` | When `position` is `'bottom'`. |
| `ng-sidebar--over` | When `mode` is `'over'`. |
| `ng-sidebar--push` | When `mode` is `'push'`. |
| `ng-sidebar--dock` | When `mode` is `'dock'`. |
| `ng-sidebar--inert` | Ignores pointer clicks. Class is applied when the sidebar is closed. |
| `ng-sidebar--animate` | When `animate` is `true`. |

### Backdrop

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar__backdrop` | Class of the backdrop `div`. Note that the `div` is only in the DOM when the backdrop is shown. |

### Page content

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar__content` | Class of the wrapper `div` for the page content. |



## Options

### `<ng-sidebar-container>`

### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| backdropClass | string | | Additional class name on the overlay element. |


### `<ng-sidebar>`

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| opened | boolean | `false` | Controls the opened state of the sidebar. This should be two-way bound. |
| mode | `'over' | 'push' | 'dock'` | `'over'` | Display the sidebar over the content when open, beside it when open, or slightly open. |
| dockedSize | string | `'0px'` | When `mode` is set to `'dock'`, this value indicates how much of the sidebar is still visible when "closed". |
| position | `'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'` | `'start'` | What side the sidebar should be docked to. `'start'` and `'end'` are aliases that respect the page's language (e.g. `start` is the same as `left` for English, but would be `right` for Hebrew. |
| animate | boolean | `true` | Animate the opening/closing of the sidebar. |
| sidebarClass | string | | Additional class name on the sidebar element. |
| ariaLabel | string | | Value for the sidebar's `aria-label` attribute. |
| trapFocus | boolean | `true` | Keeps focus within the sidebar when open. |
| autoFocus | boolean | `true` | Automatically focus the first focusable element in the sidebar when opened. |
| showBackdrop | boolean | `false` | If a translucent black backdrop overlay should appear over the page contents when the sidebar is open. |
| closeOnClickOutside | boolean | `false` | Whether clicking outside of the open sidebar will close it. |
| keyClose | boolean | `false` | Close the sidebar when a keyboard button is pressed. |
| keyCode | number | `27` | The [key code](http://keycode.info/) for `keyClose`. |

#### Outputs

| Property name | Callback arguments | Description |
| ------------- | ------------------ | ----------- |
| openedChange | `opened: boolean` | Emitted when `opened` is modified. This allows for you to do "two-way binding" (i.e. `[(opened)]`). |
| onOpenStart | | Emitted when the sidebar is opening. |
| onOpened | | Emitted when the sidebar is opened. |
| onCloseStart | | Emitted when the sidebar is closing. |
| onClosed | | Emitted when the sidebar is closed. |
| onModeChange | `mode: string` | Emitted when `mode` is changed. |
| onPositionChange | `position: string` | Emitted when `position` is changed. |
