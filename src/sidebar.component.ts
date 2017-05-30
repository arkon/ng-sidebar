import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SidebarService } from './sidebar.service';
import { isBrowser, upperCaseFirst, isLTR, isIOS } from './utils';

@Component({
  selector: 'ng-sidebar',
  template: `
    <aside #sidebar
      role="complementary"
      [attr.aria-hidden]="!opened"
      [attr.aria-label]="ariaLabel"
      class="ng-sidebar ng-sidebar--{{opened ? 'opened' : 'closed'}} ng-sidebar--{{position}} ng-sidebar--{{mode}}"
      [class.ng-sidebar--inert]="!opened && mode !== 'dock'"
      [class.ng-sidebar--animate]="animate"
      [ngClass]="sidebarClass"
      [ngStyle]="_getStyle()">
      <ng-content></ng-content>
    </aside>
  `,
  styles: [`
    .ng-sidebar {
      background-color: #fff;
      overflow: auto;
      pointer-events: auto;
      position: fixed;
      touch-action: auto;
      will-change: initial;
      z-index: 99999999;
    }

      .ng-sidebar--left {
        bottom: 0;
        left: 0;
        top: 0;
      }

      .ng-sidebar--right {
        bottom: 0;
        right: 0;
        top: 0;
      }

      .ng-sidebar--top {
        left: 0;
        right: 0;
        top: 0;
      }

      .ng-sidebar--bottom {
        bottom: 0;
        left: 0;
        right: 0;
      }

    .ng-sidebar--inert {
      pointer-events: none;
      touch-action: none;
      will-change: transform;
    }

    .ng-sidebar--animate.ng-sidebar {
      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements OnInit, OnChanges, OnDestroy {
  // `openedChange` allows for "2-way" data binding
  @Input() opened: boolean = false;
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() mode: 'over' | 'push' | 'slide' | 'dock' = 'over';
  @Input() dockedSize: string = '0px';
  @Input() position: 'start' | 'end' | 'left' | 'right' | 'top' | 'bottom' = 'start';
  @Input() animate: boolean = true;

  @Input() autoCollapseHeight: number;
  @Input() autoCollapseWidth: number;

  @Input() sidebarClass: string;

  @Input() ariaLabel: string;
  @Input() trapFocus: boolean = false;
  @Input() autoFocus: boolean = true;

  @Input() showBackdrop: boolean = false;
  @Input() closeOnClickBackdrop: boolean = false;
  @Input() closeOnClickOutside: boolean = false;

  @Input() keyClose: boolean = false;
  @Input() keyCode: number = 27;  // Default to ESC key

  @Output() onOpenStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onOpened: EventEmitter<null> = new EventEmitter<null>();
  @Output() onCloseStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onClosed: EventEmitter<null> = new EventEmitter<null>();
  @Output() onModeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onPositionChange: EventEmitter<string> = new EventEmitter<string>();

  /** @internal */
  @Output() _onRerender: EventEmitter<null> = new EventEmitter<null>();

  /** @internal */
  @ViewChild('sidebar')
  _elSidebar: ElementRef;

  private _openSub: Subscription;
  private _closeSub: Subscription;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  private _wasCollapsed: boolean;

  private _clickEvent: string = 'click';
  private _onClickOutsideAttached: boolean = false;
  private _onKeyDownAttached: boolean = false;
  private _onResizeAttached: boolean = false;

  constructor(
    private _sidebarService: SidebarService) {
    if (isIOS() && 'ontouchstart' in window) {
      this._clickEvent = 'touchstart';
    }

    this._normalizePosition();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onFocusTrap = this._onFocusTrap.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    this._onResize = this._onResize.bind(this);

    this._openSub = this._sidebarService.onOpen(this.open);
    this._closeSub = this._sidebarService.onClose(this.close);
  }

  ngOnInit() {
    if (!isBrowser()) { return; }

    this._sidebarService.register(this);

    // Prevents an initial transition hiccup in IE (issue #59)
    if (this.animate) {
      this.animate = false;
      setTimeout(() => {
        this.animate = true;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isBrowser()) { return; }

    if (changes['opened']) {
      if (changes['opened'].currentValue) {
        this.open();
      } else {
        this.close();
      }
    }

    if (changes['closeOnClickOutside'] || changes['keyClose']) {
      this._initCloseListeners();
    }

    if (changes['position']) {
      // Handle "start" and "end" aliases
      this._normalizePosition();

      // Emit change in timeout to allow for position change to be rendered first
      setTimeout(() => {
        this.onPositionChange.emit(changes['position'].currentValue);
      });
    }

    if (changes['mode']) {
      setTimeout(() => {
        this.onModeChange.emit(changes['mode'].currentValue);
      });
    }

    if (changes['autoCollapseHeight'] || changes['autoCollapseWidth']) {
      this._initCollapseListeners();
    }
  }

  ngOnDestroy(): void {
    if (!isBrowser()) { return; }

    this._destroyCloseListeners();
    this._destroyCollapseListeners();

    if (this._openSub) {
      this._openSub.unsubscribe();
    }
    if (this._closeSub) {
      this._closeSub.unsubscribe();
    }
  }


  // Sidebar toggling
  // ==============================================================================================

  /**
   * Opens the sidebar and emits the appropriate events.
   */
  open(): void {
    if (!isBrowser()) { return; }

    this.opened = true;
    this.openedChange.emit(true);

    this.onOpenStart.emit();

    setTimeout(() => {
      if (this.animate) {
        this._elSidebar.nativeElement.addEventListener('transitionend', this._onTransitionEnd);
      } else {
        this._setFocused();
        this._initCloseListeners();

        if (this.opened) {
          this.onOpened.emit();
        }
      }
    });
  }

  /**
   * Closes the sidebar and emits the appropriate events.
   */
  close(): void {
    if (!isBrowser()) { return; }

    this.opened = false;
    this.openedChange.emit(false);

    this.onCloseStart.emit();

    setTimeout(() => {
      if (this.animate) {
        this._elSidebar.nativeElement.addEventListener('transitionend', this._onTransitionEnd);
      } else {
        this._setFocused();
        this._destroyCloseListeners();

        if (!this.opened) {
          this.onClosed.emit();
        }
      }
    });
  }

  /**
   * Manually trigger a re-render of the container. Useful if the sidebar contents might change.
   */
  triggerRerender(): void {
    if (!isBrowser()) { return; }

    this._onRerender.emit();
  }

  /**
   * @internal
   *
   * Computes the transform styles for the sidebar template.
   *
   * @return {CSSStyleDeclaration} The transform styles, with the WebKit-prefixed version as well.
   */
  _getStyle(): CSSStyleDeclaration {
    let transformStyle: string = 'none';
    let marginStyle = {};

    const isSlideMode: boolean = this.mode === 'slide';

    if (!this.opened || isSlideMode) {
      transformStyle = `translate${(this.position === 'left' || this.position === 'right') ? 'X' : 'Y'}`;

      const isLeftOrTop: boolean = this.position === 'left' || this.position === 'top';
      const isDockMode: boolean = this.mode === 'dock';

      const translateAmt: string = `${isLeftOrTop ? '-' : ''}100%`;

      if (isDockMode && parseFloat(this.dockedSize) > 0) {
        const marginPos = `margin${upperCaseFirst(this.position)}`;

        marginStyle[marginPos] = this.dockedSize;
      }

      transformStyle += `(${translateAmt})`;
    }

    return Object.assign(marginStyle, {
      webkitTransform: transformStyle,
      transform: transformStyle
    }) as CSSStyleDeclaration;
  }

  /**
   * @internal
   *
   * Handles the `transitionend` event on the sidebar to emit the onOpened/onClosed events after the transform
   * transition is completed.
   */
  _onTransitionEnd(e: TransitionEvent): void {
    if (e.target === this._elSidebar.nativeElement && e.propertyName.endsWith('transform')) {
      this._setFocused();

      if (this.opened) {
        this._initCloseListeners();
        this.onOpened.emit();
      } else {
        this._destroyCloseListeners();
        this.onClosed.emit();
      }

      this._elSidebar.nativeElement.removeEventListener('transitionend', this._onTransitionEnd);
    }
  }


  // Focus on open/close
  // ==============================================================================================

  /**
   * @internal
   *
   * Returns whether focus should be trapped within the sidebar.
   *
   * @return {boolean} Trap focus inside sidebar.
   */
  private get _shouldTrapFocus(): boolean {
    return this.opened && this.trapFocus && this._isModeOver;
  }

  /**
   * @internal
   *
   * Sets focus to the first focusable element inside the sidebar.
   */
  private _focusFirstItem(): void {
    if (this._focusableElements && this._focusableElements.length > 0) {
      this._focusableElements[0].focus();
    }
  }

  /**
   * @internal
   *
   * Loops focus back to the start of the sidebar if set to do so.
   */
  private _onFocusTrap(e: FocusEvent): void {
    if (this._shouldTrapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
      this._focusFirstItem();
    }
  }

  /**
   * @internal
   *
   * Handles the ability to focus sidebar elements when it's open/closed to ensure that the sidebar is inert when
   * appropriate.
   */
  private _setFocused(): void {
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;

    if (this.opened) {
      this._focusedBeforeOpen = document.activeElement as HTMLElement;

      // Restore focusability, with previous tabindex attributes
      for (const el of this._focusableElements) {
        const prevTabIndex = el.getAttribute('__tabindex__');
        if (prevTabIndex !== null) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute('__tabindex__');
        } else {
          el.removeAttribute('tabindex');
        }
      }

      if (this.autoFocus) {
        this._focusFirstItem();
      }

      document.addEventListener('focus', this._onFocusTrap, true);
    } else {
      // Manually make all focusable elements unfocusable, saving existing tabindex attributes
      for (const el of this._focusableElements) {
        const existingTabIndex = el.getAttribute('tabindex');
        el.setAttribute('tabindex', '-1');

        if (existingTabIndex !== null) {
          el.setAttribute('__tabindex__', existingTabIndex);
        }
      }

      document.removeEventListener('focus', this._onFocusTrap, true);

      // Set focus back to element before the sidebar was opened
      if (this._focusedBeforeOpen && this.autoFocus && this._isModeOver) {
        this._focusedBeforeOpen.focus();
        this._focusedBeforeOpen = null;
      }
    }
  }


  // Close event handlers
  // ==============================================================================================

  /**
   * @internal
   *
   * Initializes event handlers for the closeOnClickOutside and keyClose options.
   */
  private _initCloseListeners(): void {
    if (this.opened && (this.closeOnClickOutside || this.keyClose)) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (this.closeOnClickOutside && !this._onClickOutsideAttached) {
          document.addEventListener(this._clickEvent, this._onClickOutside);
          this._onClickOutsideAttached = true;
        }

        if (this.keyClose && !this._onKeyDownAttached) {
          document.addEventListener('keydown', this._onKeyDown);
          this._onKeyDownAttached = true;
        }
      });
    }
  }

  /**
   * @internal
   *
   * Destroys the event handlers from _initCloseListeners.
   */
  private _destroyCloseListeners(): void {
    if (this._onClickOutsideAttached) {
      document.removeEventListener(this._clickEvent, this._onClickOutside);
      this._onClickOutsideAttached = false;
    }

    if (this._onKeyDownAttached) {
      document.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDownAttached = false;
    }
  }

  /**
   * @internal
   *
   * Handles `click` events on anything while the sidebar is open for the closeOnClickOutside option.
   * Programatically closes the sidebar if a click occurs outside the sidebar.
   *
   * @param e {MouseEvent} Mouse click event.
   */
  private _onClickOutside(e: MouseEvent): void {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this.close();
    }
  }

  /**
   * @internal
   *
   * Handles the `keydown` event for the keyClose option.
   *
   * @param e {KeyboardEvent} Normalized keydown event.
   */
  private _onKeyDown(e: KeyboardEvent | Event): void {
    e = e || window.event;

    if ((e as KeyboardEvent).keyCode === this.keyCode) {
      this.close();
    }
  }


  // Auto collapse handlers
  // ==============================================================================================

  /** @internal */
  private _initCollapseListeners(): void {
    if (this.autoCollapseHeight || this.autoCollapseWidth) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (!this._onResizeAttached) {
          window.addEventListener('resize', this._onResize);
          this._onResizeAttached = true;
        }
      });
    }
  }

  /** @internal */
  private _destroyCollapseListeners(): void {
    if (this._onResizeAttached) {
      window.removeEventListener('resize', this._onResize);
      this._onResizeAttached = false;
    }
  }

  /** @internal */
  private _onResize(): void {
    const winHeight: number = window.innerHeight;
    const winWidth: number = window.innerWidth;

    if (this.autoCollapseHeight) {
      if (winHeight <= this.autoCollapseHeight && this.opened) {
        this._wasCollapsed = true;
        this.close();
      } else if (winHeight > this.autoCollapseHeight && this._wasCollapsed) {
        this.open();
        this._wasCollapsed = false;
      }
    }

    if (this.autoCollapseWidth) {
      if (winWidth <= this.autoCollapseWidth && this.opened) {
        this._wasCollapsed = true;
        this.close();
      } else if (winWidth > this.autoCollapseWidth && this._wasCollapsed) {
        this.open();
        this._wasCollapsed = false;
      }
    }
  }


  // Helpers
  // ==============================================================================================

  /**
   * @internal
   *
   * Returns the rendered height of the sidebar (or the docked size).
   * This is used in the sidebar container.
   *
   * @return {number} Height of sidebar.
   */
  get _height(): number {
    if (this._elSidebar.nativeElement) {
      return this._isDocked ?
        parseFloat(this.dockedSize) :
        this._elSidebar.nativeElement.offsetHeight;
    }

    return 0;
  }

  /**
   * @internal
   *
   * Returns the rendered width of the sidebar (or the docked size).
   * This is used in the sidebar container.
   *
   * @return {number} Width of sidebar.
   */
  get _width(): number {
    if (this._elSidebar.nativeElement) {
      return this._isDocked ?
        parseFloat(this.dockedSize) :
        this._elSidebar.nativeElement.offsetWidth;
    }

    return 0;
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is "docked" -- i.e. it is closed but in dock mode.
   *
   * @return {boolean} Sidebar is docked.
   */
  private get _isDocked(): boolean {
    return this.mode === 'dock' && this.dockedSize && !this.opened;
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is set to the default "over" mode.
   *
   * @return {boolean} Sidebar mode is "over".
   */
  private get _isModeOver(): boolean {
    return this.mode === 'over';
  }

  /**
   * @internal
   *
   * "Normalizes" position. For example, "start" would be "left" if the page is LTR.
   */
  private _normalizePosition(): void {
    const ltr: boolean = isLTR();

    if (this.position === 'start') {
      this.position = ltr ? 'left' : 'right';
    } else if (this.position === 'end') {
      this.position = ltr ? 'right' : 'left';
    }
  }
}
