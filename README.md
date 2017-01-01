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
      <ng-sidebar [(open)]="_opened">
        <p>Sidebar contents</p>
      </ng-sidebar>

      <!-- Page content -->
      <button (click)="_toggleSidebar()">Toggle sidebar</button>

    </ng-sidebar-container>
  `
})
export class AppComponent {
  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
}
```

A directive is also provided to easily close the sidebar by clicking something inside it:

```html
<ng-sidebar [(open)]="_opened">
  <a closeSidebar>Closes the sidebar</a>
</ng-sidebar>
```


### `<ng-sidebar-container>` options

### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| backdropClass | string | | Additional class name on the overlay element. |


### `<ng-sidebar>` options

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| opened | boolean | `false` | If the sidebar should be open. This should be two-way bound. |
| mode | `'over' | 'push'` | `'over'` | Whether to display the sidebar over the content or beside it. |
| position | `'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'` | `'start'` | What side the sidebar should be docked to. `'start'` and `'end'` are aliases that respect the page's language (e.g. `start` is the same as `left` for English, but would be `right` for Hebrew. |
| closeOnClickOutside | boolean | `false` | Whether clicking outside of the open sidebar will close it. |
| showBackdrop | boolean | `false` | If a translucent black backdrop overlay should appear over the page contents when the sidebar is open. |
| animate | boolean | `true` | Whether the sidebar should animate when opening/closing. |
| trapFocus | boolean | `true` | Keeps focus within the sidebar if it's open. |
| autoFocus | boolean | `true` | Automatically focuses the first focusable element in the sidebar when opened. |
| sidebarClass | string | | Additional class name on the sidebar element. |
| ariaLabel | string | | String used for the sidebar's `aria-label` attribute. |
| keyClose | boolean | `false` | Close the sidebar when a keyboard button is pressed. |
| keyCode | number | `27` | The [KeyCode](http://keycode.info/) for `keyClose`. |

#### Outputs

| Property name | Callback arguments | Description |
| ------------- | ------------------ | ----------- |
| onOpenStart | | Emitted when the sidebar is opening. |
| onOpened | | Emitted when the sidebar is opened. |
| onCloseStart | | Emitted when the sidebar is closing. |
| onClosed | | Emitted when the sidebar is closed. |
| onPositionChange | `position: string` | Emitted when `position` is changed. |
| onModeChange | `mode: string` | Emitted when `mode` is changed. |
