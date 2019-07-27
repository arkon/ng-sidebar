# ng-sidebar

[![NPM](https://nodei.co/npm/ng-sidebar.png?compact=true)](https://nodei.co/npm/ng-sidebar)

**[Demo](https://echeung.me/ng-sidebar)**

*Formerly called [ng2-sidebar](https://github.com/arkon/ng2-sidebar)*

An Angular sidebar component.


## Installation

```shell
npm install --save ng-sidebar
```

### SystemJS configuration

If you're using SystemJS, be sure to add the appropriate settings to your SystemJS config:

```js
const map = {
  // ...
  'ng-sidebar': 'node_modules/ng-sidebar',
  // ...
};

const packages = {
  // ...
  'ng-sidebar': {
    main: 'lib/index',
    defaultExtension: 'js'
  },
  // ...
};
```


## Changelog

See the [releases page](https://github.com/arkon/ng-sidebar/releases) on GitHub.


## Usage

Add `SidebarModule` to your app module:

```typescript
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SidebarModule.forRoot()],
  bootstrap: [AppComponent],
})
class AppModule {}
```

In your app component, simply use add a `<ng-sidebar-container>` wrapper, then place your `<ng-sidebar>`(s) and content within it.
Your page content should be in some container with a `ng-sidebar-content` attribute.

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
      <div ng-sidebar-content>
        <button (click)="_toggleSidebar()">Toggle sidebar</button>
      </div>

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

If nothing seems to show up, your wrappers' heights may be collapsing. Try adding a height (e.g. `height: 100vh;`) to the wrapper `<ng-sidebar-container>` or other wrapper elements you may have. (See [issue #100](https://github.com/arkon/ng-sidebar/issues/100) for more info.)

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


## Functions

The sidebar has a few public functions:

| Function | Description |
| -------- | ----------- |
| `open()` | Opens the sidebar. |
| `close()` | Closes the sidebar. |
| `triggerRerender()` | Manually trigger a re-render of the container. Useful if the sidebar contents might change. |


## Styling

Various class names are attached to the sidebar and container for easier styling.

If you are using Angular's default emulated view encapsulation, you may have to use the `>>>` selector to target the sidebar's classes. Check out [Angular's documentation](https://angular.io/guide/component-styles#deep) for more details. Note that the `/deep/` selector [will soon be deprecated](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/68qSZM5QMRQ/pT2YCqZSomAJ).

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
| `ng-sidebar--slide` | When `mode` is `'slide'`. |
| `ng-sidebar--docked` | When the sidebar is docked (i.e. it is "closed" and `dock` is `true`). |
| `ng-sidebar--inert` | Ignores pointer clicks. Class is applied when the sidebar is closed. |
| `ng-sidebar--animate` | When `animate` is `true` for a sidebar. |

### Backdrop

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar__backdrop` | Class of the backdrop `div`. Note that the `div` is only in the DOM when the backdrop is shown. |

### Page content

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar__content` | Class of the wrapper `div` for the page content. |
| `ng-sidebar__content--animate` | When `animate` is `true` for the container. |



## Options

### `<ng-sidebar-container>`

### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| contentClass | string | | Additional class name on the `div` wrapping the page contents. |
| backdropClass | string | | Additional class name on the overlay element. |
| showBackdrop | boolean | `false` | Controls the backdrop state of the sidebar container. This should be two-way bound. |
| allowSidebarBackdropControl | boolean | `true` | Determines if the container component respects the sidebar's `showBackdrop` input option. |
| animate | boolean | `true` | Animates the container sliding. |

#### Outputs

| Property name | Callback arguments | Description |
| ------------- | ------------------ | ----------- |
| showBackdropChange | `showBackdrop: boolean` | Emitted when `showBackdrop` is modified. This allows for you to do "two-way binding" (i.e. `[(showBackdrop)]`). |
| onBackdropClicked | | Emitted when a backdrop is clicked. |


### `<ng-sidebar>`

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| opened | boolean | `false` | Controls the opened state of the sidebar. This should be two-way bound. |
| mode | `'over'`, `'push'`, `'slide'` | `'over'` | See the "Modes" section. |
| dock | boolean | `false` | Show the sidebar as docked when closed. |
| dockedSize | string | `'0px'` | When `mode` is set to `'dock'`, this value indicates how much of the sidebar is still visible when "closed". |
| position | `'left'`, `'right'`, `'top'`, `'bottom'`, `'start'`, `'end'` | `'start'` | What side the sidebar should be docked to. `'start'` and `'end'` are aliases that respect the page's language (e.g. `start` is the same as `left` for English, but would be `right` for Hebrew. |
| autoCollapseHeight | number | | Window height in pixels in which to automatically close the sidebar. |
| autoCollapseWidth | number | | Window width in pixels in which to automatically close the sidebar. |
| autoCollapseOnInit | boolean | `true` | Collapse sidebar based on `autoCollapseHeight` and/or `autoCollapseWidth` on initial render as needed. |
| animate | boolean | `true` | Animate the opening/closing of the sidebar. |
| sidebarClass | string | | Additional class name on the sidebar element. |
| ariaLabel | string | | Value for the sidebar's `aria-label` attribute. |
| trapFocus | boolean | `false` | Keeps focus within the sidebar when open. Note that this only works if there's one sidebar open at a time. |
| autoFocus | boolean | `true` | Automatically focus the first focusable element in the sidebar when opened. |
| showBackdrop | boolean | `false` | If a translucent black backdrop overlay should appear over the page contents when the sidebar is opened.  This is ignored if the sidebar's parent container has its `allowSidebarBackdropControl` property set to `true`. |
| closeOnClickBackdrop | boolean | `false` | Whether clicking on the backdrop of the open sidebar will close it. |
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
| onTransitionEnd | | Emitted when the animation for opening or closing ends. |
| onModeChange | `mode: string` | Emitted when `mode` is changed. |
| onPositionChange | `position: string` | Emitted when `position` is changed. |

#### Modes

##### `over`

This is the default mode. The sidebar slides in over the page contents.

##### `push`

The page contents is pushed to make space for the sidebar.

##### `slide`

The entire page slides over to show the sidebar. Note that this only works if you have one sidebar open at a time.
