import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import { Sidebar } from './sidebar.component';

// Based on https://github.com/angular/material2/tree/master/src/lib/sidenav
@Component({
  selector: 'ng-sidebar-container',
  template: `
    <ng-content select="ng-sidebar"></ng-content>

    <div class="ng-sidebar__content" [ngStyle]="_getStyles()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    ng-sidebar-container {
      box-sizing: border-box;
      display: block;
    }

    .ng-sidebar__content {
      display: block;
      height: 100%;
      overflow: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SidebarContainer implements AfterContentInit {
  @ContentChildren(Sidebar)
  private _sidebars: QueryList<Sidebar>;

  constructor(private _ref: ChangeDetectorRef) {}

  ngAfterContentInit() {
    if (this._sidebars) {
      this._sidebars.changes.subscribe(() => this._change());

      this._sidebars.forEach((sidebar: Sidebar) => {
        sidebar.onOpen.subscribe(() => this._change());
        sidebar.onClose.subscribe(() => this._change());
        sidebar.onPositionChange.subscribe(() => this._change());
      });
    }
  }

  /** @internal */
  _getStyles() {
    let left = 0,
        right = 0,
        top = 0,
        bottom = 0;

    if (this._sidebars) {
      this._sidebars.forEach((sidebar: Sidebar) => {
        if (sidebar && sidebar._opened && sidebar.mode === 'push') {
          switch (sidebar.position) {
            case 'left':
              left = Math.max(left, sidebar._width);
              break;

            case 'right':
              right = Math.max(right, sidebar._width);
              break;

            case 'top':
              top = Math.max(top, sidebar._height);
              break;

            case 'bottom':
              bottom = Math.max(bottom, sidebar._height);
              break;
          }
        }
      });
    }

    return {
      margin: `${top}px ${right}px ${bottom}px ${left}px`
    };
  }

  private _change() {
    this._ref.markForCheck();
  }
}
