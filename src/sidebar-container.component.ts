import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import { Sidebar } from './sidebar.component';

// Based on https://github.com/angular/material2/tree/master/src/lib/sidenav
@Component({
  selector: 'ng-sidebar-container',
  template: `
    <ng-content select="ng-sidebar"></ng-content>

    <div *ngIf="_showBackdrop"
      aria-hidden="true"
      class="ng-sidebar__backdrop"
      [ngClass]="backdropClass"></div>

    <div class="ng-sidebar__content" [ngStyle]="_getStyles()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    ng-sidebar-container {
      box-sizing: border-box;
      display: block;
      position: relative;
    }

    .ng-sidebar__backdrop {
      background: #000;
      height: 100%;
      left: 0;
      opacity: 0.75;
      pointer-events: auto;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99999998;
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
export class SidebarContainer implements AfterContentInit, OnDestroy {
  @Input() backdropClass: string;

  /** @internal */
  _showBackdrop: boolean = false;

  /** @internal */
  @ContentChildren(Sidebar)
  _sidebars: QueryList<Sidebar>;

  constructor(private _ref: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._subscribe();

    this._sidebars.changes.subscribe(() => {
      this._unsubscribe();
      this._subscribe();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  /**
   * @internal
   *
   * Computes `margin` value to push page contents to accommodate open sidebars as needed.
   *
   * @return {CSSStyleDeclaration} margin styles for the page content.
   */
  _getStyles(): CSSStyleDeclaration {
    let left = 0,
        right = 0,
        top = 0,
        bottom = 0;

    if (this._sidebars) {
      this._sidebars.forEach((sidebar: Sidebar) => {
        if (sidebar && (sidebar.mode === 'push' && sidebar.opened) || sidebar.mode === 'dock') {
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
    } as CSSStyleDeclaration;
  }

  /**
   * Subscribes from all sidebar events to react properly.
   */
  private _subscribe(): void {
    if (this._sidebars) {
      this._sidebars.forEach((sidebar: Sidebar) => {
        sidebar.onOpenStart.subscribe(() => this._onToggle());
        sidebar.onOpened.subscribe(() => this._markForCheck());

        sidebar.onCloseStart.subscribe(() => this._onToggle());
        sidebar.onClosed.subscribe(() => this._markForCheck());

        sidebar.onModeChange.subscribe(() => this._markForCheck());
        sidebar.onPositionChange.subscribe(() => this._markForCheck());
      });
    }
  }

  /**
   * Unsubscribes from all sidebars.
   */
  private _unsubscribe(): void {
    if (this._sidebars) {
      this._sidebars.forEach((sidebar: Sidebar) => {
        sidebar.onOpenStart.unsubscribe();
        sidebar.onOpened.unsubscribe();

        sidebar.onCloseStart.unsubscribe();
        sidebar.onClosed.unsubscribe();

        sidebar.onModeChange.unsubscribe();
        sidebar.onPositionChange.unsubscribe();
      });
    }
  }

  /**
   * Triggers change detection to recompute styles.
   */
  private _markForCheck(): void {
    this._ref.markForCheck();
  }

  /**
   * Check if we should show the backdrop when a sidebar is toggled.
   */
  private _onToggle(): void {
    if (this._sidebars) {
      let hasOpen = false;

      const _sidebars = this._sidebars.toArray();
      for (let i = 0; i < _sidebars.length; i++) {
        const sidebar: Sidebar = _sidebars[i];

        // Show backdrop if a single open sidebar has it set
        if (sidebar.opened && sidebar.showBackdrop) {
          hasOpen = true;
          break;
        }
      }

      this._showBackdrop = hasOpen;
    }

    this._markForCheck();
  }
}
