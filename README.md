# ng2-sidebar

[![NPM](https://nodei.co/npm/ng2-sidebar.png?compact=true)](https://nodei.co/npm/ng2-sidebar)

**[Demo](https://echeung.me/ng2-sidebar)**

An Angular 2 sidebar component.


## Installation

```shell
npm install --save ng2-sidebar
```

### SystemJS configuration

If you're using SystemJS, be sure to add the appropriate settings to your SystemJS config:

```js
var map = {
  // ...
  'ng2-sidebar': 'node_modules/ng2-sidebar',
  // ...
};

var packages = {
  // ...
  'ng2-sidebar': {
    main: 'lib/index',
    defaultExtension: 'js'
  },
  // ...
};
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

If you're using it in a feature module, you may need to add it as an import in that module as well.

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
@Component({
  selector: 'example',
  template: `
    <ng2-sidebar [(open)]="_open">
      <a closeSidebar>Closes the sidebar</a>
    </ng2-sidebar>
  `
})
// ...
```

### Browser support

Note that this component uses Angular 2's [animation system](https://angular.io/docs/ts/latest/guide/animations.html), which relies on the Web Animations API. Unforunately, there is only [partial support](http://caniuse.com/#feat=web-animation) for this API in Firefox, Chrome, and Opera, so it's recommended to use [the web-animations.js polyfill](https://github.com/web-animations/web-animations-js) for support in other browsers.


### Options

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| open | boolean | `false` | If the sidebar should be open. This should be two-way bound. |
| position | `'left' | 'right' | 'top' | 'bottom'` | `'left'` | What side the sidebar should be docked to. `SIDEBAR_POSITION` can also be used instead of the strings. |
| closeOnClickOutside | boolean | `false` | Whether clicking outside of the open sidebar will close it. |
| showOverlay | boolean | `false` | If a translucent black overlay should appear over the page contents when the sidebar is open. |
| animate | boolean | `true` | Whether the sidebar should animate when opening/closing. |
| defaultStyles | boolean | `false` | Applies some basic default styles to the sidebar. |
| trapFocus | boolean | `true` | Keeps focus within the sidebar if it's open. |
| sidebarClass | string | | Additional class name on the sidebar element. |
| overlayClass | string | | Additional class name on the overlay element. |
| ariaLabel | string | | String used for the sidebar's `aria-label` attribute. |

#### Outputs

| Property name | Callback arguments | Description |
| ------------- | ------------------ | ----------- |
| onOpen | | Emitted when the sidebar is opened. |
| onClose | | Emitted when the sidebar is closed. |
| onAnimationStarted | `e: AnimationTransitionEvent` | Emitted when the animation is started. |
| onAnimationDone | `e: AnimationTransitionEvent` | Emitted when the animation is done. |
