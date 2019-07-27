import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Sidebar } from './sidebar.component';

// Based on https://github.com/angular/material2/tree/master/src/lib/sidenav
@Component({
  selector: 'ng-sidebar-container',
  template: `
    <div *ngIf="showBackdrop"
      aria-hidden="true"
      class="ng-sidebar__backdrop"
      [ngClass]="backdropClass"
      (click)="_onBackdropClicked()"></div>

    <ng-content select="ng-sidebar,[ng-sidebar]"></ng-content>

    <div class="ng-sidebar__content"
      [class.ng-sidebar__content--animate]="animate"
      [ngClass]="contentClass"
      [ngStyle]="_getContentStyle()">
      <ng-content select="[ng-sidebar-content]"></ng-content>
    </div>
  `,
  styles: [`
    :host {
      box-sizing: border-box;
      display: block;
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    .ng-sidebar__backdrop {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #000;
      opacity: 0.75;
      pointer-events: auto;
      z-index: 1;
    }

    .ng-sidebar__content {
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .ng-sidebar__content--animate {
      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarContainer implements AfterContentInit, OnChanges, OnDestroy {
  @Input() animate: boolean = true;

  @Input() allowSidebarBackdropControl: boolean = true;
  @Input() showBackdrop: boolean = false;
  @Output() showBackdropChange = new EventEmitter<boolean>();
  @Output() onBackdropClicked = new EventEmitter<null>();

  @Input() contentClass: string;
  @Input() backdropClass: string;

  private _sidebars: Array<Sidebar> = [];

  private _isBrowser: boolean;

  constructor(
    private _ref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterContentInit(): void {
    if (!this._isBrowser) {
      return;
    }

    this._onToggle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._isBrowser) {
      return;
    }

    if (changes['showBackdrop']) {
      this.showBackdropChange.emit(changes['showBackdrop'].currentValue);
    }
  }

  ngOnDestroy(): void {
    if (!this._isBrowser) {
      return;
    }

    this._unsubscribe();
  }

  /**
   * @internal
   *
   * Adds a sidebar to the container's list of sidebars.
   *
   * @param sidebar {Sidebar} A sidebar within the container to register.
   */
  _addSidebar(sidebar: Sidebar) {
    this._sidebars.push(sidebar);
    this._subscribe(sidebar);
  }

  /**
   * @internal
   *
   * Removes a sidebar from the container's list of sidebars.
   *
   * @param sidebar {Sidebar} The sidebar to remove.
   */
  _removeSidebar(sidebar: Sidebar) {
    const index = this._sidebars.indexOf(sidebar);
    if (index !== -1) {
      this._sidebars.splice(index, 1);
    }
  }

  /**
   * @internal
   *
   * Computes `margin` value to push page contents to accommodate open sidebars as needed.
   *
   * @return {CSSStyleDeclaration} margin styles for the page content.
   */
  _getContentStyle(): CSSStyleDeclaration {
    let left = 0,
      right = 0,
      top = 0,
      bottom = 0;

    let transformStyle: string = '';
    let heightStyle: string = '';
    let widthStyle: string = '';

    for (const sidebar of this._sidebars) {
      // Slide mode: we need to translate the entire container
      if (sidebar._isModeSlide) {
        if (sidebar.opened) {
          const transformDir: string = sidebar._isLeftOrRight ? 'X' : 'Y';
          const transformAmt: string =
            `${sidebar._isLeftOrTop ? '' : '-'}${sidebar._isLeftOrRight ? sidebar._width : sidebar._height}`;

          transformStyle = `translate${transformDir}(${transformAmt}px)`;
        }
      }

      // Create a space for the sidebar
      if ((sidebar._isModePush && sidebar.opened) || sidebar.dock) {
        let paddingAmt: number = 0;

        if (sidebar._isModeSlide && sidebar.opened) {
          if (sidebar._isLeftOrRight) {
            widthStyle = '100%';
          } else {
            heightStyle = '100%';
          }
        } else {
          if (sidebar._isDocked || (sidebar._isModeOver && sidebar.dock)) {
            paddingAmt = sidebar._dockedSize;
          } else {
            paddingAmt = sidebar._isLeftOrRight ? sidebar._width : sidebar._height;
          }
        }

        switch (sidebar.position) {
          case 'left':
            left = Math.max(left, paddingAmt);
            break;

          case 'right':
            right = Math.max(right, paddingAmt);
            break;

          case 'top':
            top = Math.max(top, paddingAmt);
            break;

          case 'bottom':
            bottom = Math.max(bottom, paddingAmt);
            break;
        }
      }
    }

    return {
      padding: `${top}px ${right}px ${bottom}px ${left}px`,
      webkitTransform: transformStyle,
      transform: transformStyle,
      height: heightStyle,
      width: widthStyle
    } as CSSStyleDeclaration;
  }

  /**
   * @internal
   *
   * Closes sidebars when the backdrop is clicked, if they have the
   * `closeOnClickBackdrop` option set.
   */
  _onBackdropClicked(): void {
    let backdropClicked = false;
    for (const sidebar of this._sidebars) {
      if (sidebar.opened && sidebar.showBackdrop && sidebar.closeOnClickBackdrop) {
        sidebar.close();
        backdropClicked = true;
      }
    }

    if (backdropClicked) {
      this.onBackdropClicked.emit();
    }
  }

  /**
   * Subscribes from a sidebar events to react properly.
   */
  private _subscribe(sidebar: Sidebar): void {
    sidebar.onOpenStart.subscribe(() => this._onToggle());
    sidebar.onOpened.subscribe(() => this._markForCheck());

    sidebar.onCloseStart.subscribe(() => this._onToggle());
    sidebar.onClosed.subscribe(() => this._markForCheck());

    sidebar.onModeChange.subscribe(() => this._markForCheck());
    sidebar.onPositionChange.subscribe(() => this._markForCheck());

    sidebar._onRerender.subscribe(() => this._markForCheck());
  }

  /**
   * Unsubscribes from all sidebars.
   */
  private _unsubscribe(): void {
    for (const sidebar of this._sidebars) {
      sidebar.onOpenStart.unsubscribe();
      sidebar.onOpened.unsubscribe();

      sidebar.onCloseStart.unsubscribe();
      sidebar.onClosed.unsubscribe();

      sidebar.onModeChange.unsubscribe();
      sidebar.onPositionChange.unsubscribe();

      sidebar._onRerender.unsubscribe();
    }
  }

  /**
   * Check if we should show the backdrop when a sidebar is toggled.
   */
  private _onToggle(): void {
    if (this._sidebars.length > 0 && this.allowSidebarBackdropControl) {
      // Show backdrop if a single open sidebar has it set
      const hasOpen = this._sidebars.some(sidebar => sidebar.opened && sidebar.showBackdrop);

      this.showBackdrop = hasOpen;
      this.showBackdropChange.emit(hasOpen);
    }

    setTimeout(() => {
      this._markForCheck();
    });
  }

  /**
   * Triggers change detection to recompute styles.
   */
  private _markForCheck(): void {
    this._ref.markForCheck();
  }
}
