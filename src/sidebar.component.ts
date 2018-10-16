import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { SidebarContainer } from './sidebar-container.component';
import { isLTR, isIOS, isBrowser } from './utils';

@Component({
  selector: 'ng-sidebar',
  template: `
    <aside #sidebar
      role="complementary"
      [attr.aria-hidden]="!opened"
      [attr.aria-label]="ariaLabel"
      class="ng-sidebar ng-sidebar--{{opened ? 'opened' : 'closed'}} ng-sidebar--{{position}} ng-sidebar--{{mode}}"
      [class.ng-sidebar--docked]="_isDocked"
      [class.ng-sidebar--inert]="_isInert"
      [class.ng-sidebar--animate]="animate"
      [ngClass]="sidebarClass"
      [ngStyle]="_getStyle()">
      <ng-content></ng-content>
    </aside>
  `,
  styles: [`
    .ng-sidebar {
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      pointer-events: auto;
      position: absolute;
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

    .ng-sidebar--animate {
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

  @Input() mode: 'over' | 'push' | 'slide' = 'over';
  @Input() dock: boolean = false;
  @Input() dockedSize: string = '0px';
  @Input() position: 'start' | 'end' | 'left' | 'right' | 'top' | 'bottom' = 'start';
  @Input() animate: boolean = true;

  @Input() openOnHover: boolean = false;
  @Input() delayBeforeOpen: number = 0;
  @Input() delayBeforeClose: number = 0;

  @Input() enableSliding: boolean = false;
  @Input() thresholdToClose: number = 5;

  @Input() autoCollapseHeight: number;
  @Input() autoCollapseWidth: number;
  @Input() autoCollapseOnInit: boolean = true;

  @Input() sidebarClass: string;

  @Input() ariaLabel: string;
  @Input() trapFocus: boolean = false;
  @Input() autoFocus: boolean = true;

  @Input() showBackdrop: boolean = false;
  @Input() closeOnClickBackdrop: boolean = false;
  @Input() closeOnClickOutside: boolean = false;

  @Input() keyClose: boolean = false;
  @Input() keyCode: number = 27; // Default to ESC key

  @Output() onOpenStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onOpened: EventEmitter<null> = new EventEmitter<null>();
  @Output() onCloseStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onClosed: EventEmitter<null> = new EventEmitter<null>();
  @Output() onTransitionEnd: EventEmitter<null> = new EventEmitter<null>();
  @Output() onModeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onPositionChange: EventEmitter<string> = new EventEmitter<string>();

  /** @internal */
  @Output() _onRerender: EventEmitter<null> = new EventEmitter<null>();

  /** @internal */
  @ViewChild('sidebar') _elSidebar: ElementRef;

  private _supportsPassive = undefined;
  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  private _tabIndexAttr: string = '__tabindex__';
  private _tabIndexIndicatorAttr: string = '__ngsidebar-tabindex__';

  private _wasCollapsed: boolean;

  // Delay initial animation (issues #59, #112)
  private _shouldAnimate: boolean;

  private _clickEvent: string = 'click';
  private _onClickOutsideAttached: boolean = false;
  private _onKeyDownAttached: boolean = false;
  private _onResizeAttached: boolean = false;
  private _onHoverAttached: boolean = false;

  private _openedByHover = false;
  private _delayedTimer;

  private _startX: number;
  private _startY: number;
  private _currentX: number;
  private _currentY: number;
  private _touchingSideNav: boolean = false;

  private _isBrowser: boolean;

  constructor(@Optional() private _container: SidebarContainer, private _ref: ChangeDetectorRef) {
    if (!this._container) {
      throw new Error(
        '<ng-sidebar> must be inside a <ng-sidebar-container>. ' +
        'See https://github.com/arkon/ng-sidebar#usage for more info.'
      );
    }

    this._isBrowser = isBrowser();

    // Handle taps in iOS
    if (this._isBrowser && isIOS() && 'ontouchstart' in window) {
      this._clickEvent = 'touchstart';
    }

    this._normalizePosition();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onFocusTrap = this._onFocusTrap.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._collapse = this._collapse.bind(this);
    this._hoverRise = this._hoverRise.bind(this);
    this._hoverCollapse = this._hoverCollapse.bind(this);
    this._update = this._update.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
  }

  ngOnInit() {
    if (!this._isBrowser) {
      return;
    }

    if (this.animate) {
      this._shouldAnimate = true;
      this.animate = false;
    }

    this._container._addSidebar(this);

    if (this.autoCollapseOnInit) {
      this._collapse();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._isBrowser) {
      return;
    }

    if (changes['animate'] && this._shouldAnimate) {
      this._shouldAnimate = changes['animate'].currentValue;
    }

    if (changes['closeOnClickOutside']) {
      if (changes['closeOnClickOutside'].currentValue) {
        this._initCloseClickListener();
      } else {
        this._destroyCloseClickListener();
      }
    }
    if (changes['keyClose']) {
      if (changes['keyClose'].currentValue) {
        this._initCloseKeyDownListener();
      } else {
        this._destroyCloseKeyDownListener();
      }
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

    if (changes['dock']) {
      this.triggerRerender();
    }

    if (changes['autoCollapseHeight'] || changes['autoCollapseWidth']) {
      this._initCollapseListeners();
    }

    if (changes['openOnHover']) {
      this.openOnHover = changes['openOnHover'].currentValue;
      if (this.openOnHover) {
        this._initHoverListeners();
      } else {
        this._destroyHoverListeners();
      }
    }

    if (changes['delayBeforeOpen']) {
      this.delayBeforeOpen = changes['delayBeforeOpen'].currentValue;
    }

    if (changes['delayBeforeClose']) {
      this.delayBeforeClose = changes['delayBeforeClose'].currentValue;
    }

    if (changes['enableSliding']) {
      this.enableSliding = changes['enableSliding'].currentValue;
      if (this.enableSliding) {
        this._initSlideListeners();
      } else {
        this._destroySlideListeners();
      }
    }

    if (changes['thresholdToClose']) {
      this.thresholdToClose = changes['thresholdToClose'].currentValue;
    }

    if (changes['opened']) {
      if (this._shouldAnimate) {
        this.animate = true;
        this._shouldAnimate = false;
      }

      if (changes['opened'].currentValue) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  ngOnDestroy(): void {
    if (!this._isBrowser) {
      return;
    }

    this._destroyCloseListeners();
    this._destroyCollapseListeners();
    this._destroyHoverListeners();
    this._destroySlideListeners();

    this._container._removeSidebar(this);
  }

  // Sidebar toggling
  // ==============================================================================================

  /**
   * Opens the sidebar and emits the appropriate events.
   */
  open(): void {
    if (!this._isBrowser) {
      return;
    }

    this.opened = true;
    this.openedChange.emit(true);

    this.onOpenStart.emit();

    this._ref.detectChanges();

    setTimeout(() => {
      if (this.animate && !this._isModeSlide) {
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
    if (!this._isBrowser) {
      return;
    }

    this.opened = false;
    this._openedByHover = false;
    this.openedChange.emit(false);

    this.onCloseStart.emit();

    this._ref.detectChanges();

    setTimeout(() => {
      if (this.animate && !this._isModeSlide) {
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
    if (!this._isBrowser) {
      return;
    }

    setTimeout(() => {
      this._onRerender.emit();
    });
  }

  /**
   * @internal
   *
   * Computes the transform styles for the sidebar template.
   *
   * @return {CSSStyleDeclaration} The transform styles, with the WebKit-prefixed version as well.
   */
  _getStyle(): CSSStyleDeclaration {
    let transformStyle: string = '';

    // Hides sidebar off screen when closed
    if (!this.opened) {
      const transformDir: string = 'translate' + (this._isLeftOrRight ? 'X' : 'Y');
      let translateAmt: string = `${this._isLeftOrTop ? '-' : ''}100%`;

      transformStyle = `${transformDir}(${translateAmt})`;

      // Docked mode: partially remains open
      // Note that using `calc(...)` within `transform(...)` doesn't work in IE
      if (this.dock && this._dockedSize > 0 && !(this._isModeSlide && this.opened)) {
        transformStyle += ` ${transformDir}(${this._isLeftOrTop ? '+' : '-'}${this.dockedSize})`;
      }
    }

    return {
      webkitTransform: transformStyle,
      transform: transformStyle
    } as CSSStyleDeclaration;
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

      this.onTransitionEnd.emit();

      this._elSidebar.nativeElement.removeEventListener('transitionend', this._onTransitionEnd);
    }
  }

  // Focus on open/close
  // ==============================================================================================

  /**
   * Returns whether focus should be trapped within the sidebar.
   *
   * @return {boolean} Trap focus inside sidebar.
   */
  private get _shouldTrapFocus(): boolean {
    return this.opened && this.trapFocus && this._isModeOver;
  }

  /**
   * Sets focus to the first focusable element inside the sidebar.
   */
  private _focusFirstItem(): void {
    if (this._focusableElements && this._focusableElements.length > 0) {
      this._focusableElements[0].focus();
    }
  }

  /**
   * Loops focus back to the start of the sidebar if set to do so.
   */
  private _onFocusTrap(e: FocusEvent): void {
    if (this._shouldTrapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
      this._focusFirstItem();
    }
  }

  /**
   * Handles the ability to focus sidebar elements when it's open/closed to ensure that the sidebar is inert when
   * appropriate.
   */
  private _setFocused(): void {
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)
    ) as Array<HTMLElement>;

    if (this.opened) {
      this._focusedBeforeOpen = document.activeElement as HTMLElement;

      // Restore focusability, with previous tabindex attributes
      for (const el of this._focusableElements) {
        const prevTabIndex = el.getAttribute(this._tabIndexAttr);
        const wasTabIndexSet = el.getAttribute(this._tabIndexIndicatorAttr) !== null;
        if (prevTabIndex !== null) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute(this._tabIndexAttr);
        } else if (wasTabIndexSet) {
          el.removeAttribute('tabindex');
          el.removeAttribute(this._tabIndexIndicatorAttr);
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
        el.setAttribute(this._tabIndexIndicatorAttr, '');

        if (existingTabIndex !== null) {
          el.setAttribute(this._tabIndexAttr, existingTabIndex);
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
   * Initializes event handlers for the closeOnClickOutside and keyClose options.
   */
  private _initCloseListeners(): void {
      this._initCloseClickListener();
      this._initCloseKeyDownListener();
  }

  private _initCloseClickListener(): void {
    // In a timeout so that things render first
    setTimeout(() => {
      if (this.opened && this.closeOnClickOutside && !this._onClickOutsideAttached) {
        document.addEventListener(this._clickEvent, this._onClickOutside);
        this._onClickOutsideAttached = true;
      }
    });
  }

  private _initCloseKeyDownListener(): void {
    // In a timeout so that things render first
    setTimeout(() => {
      if (this.opened && this.keyClose && !this._onKeyDownAttached) {
        document.addEventListener('keydown', this._onKeyDown);
        this._onKeyDownAttached = true;
      }
    });
  }

  /**
   * Destroys all event handlers from _initCloseListeners.
   */
  private _destroyCloseListeners(): void {
    this._destroyCloseClickListener();
    this._destroyCloseKeyDownListener();
  }

  private _destroyCloseClickListener(): void {
    if (this._onClickOutsideAttached) {
      document.removeEventListener(this._clickEvent, this._onClickOutside);
      this._onClickOutsideAttached = false;
    }
  }

  private _destroyCloseKeyDownListener(): void {
    if (this._onKeyDownAttached) {
      document.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDownAttached = false;
    }
  }

  /**
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

  // Hover handlers
  // ==============================================================================================

  private _initHoverListeners(): void {
    setTimeout(() => {
      if (!this._onHoverAttached) {
        this._elSidebar.nativeElement.addEventListener('mouseenter', this._hoverRise);
        this._elSidebar.nativeElement.addEventListener('mouseleave', this._hoverCollapse);
        this._onHoverAttached = true;
      }
    });
  }

  private _destroyHoverListeners(): void {
    if (this._onHoverAttached) {
      this._elSidebar.nativeElement.removeEventListener('mouseenter', this._hoverRise);
      this._elSidebar.nativeElement.removeEventListener('mouseleave', this._hoverCollapse);
      this._onHoverAttached = false;
    }
  }

  private _hoverRise(): void {
    if (!this.dock) {
      return;
    }
    if (this._openedByHover && this._delayedTimer) { // cancel closing and clearing timeout of closing
      clearTimeout(this._delayedTimer);
      this._delayedTimer = undefined;
    }
    if (this.opened) {
      return;
    }

    this._openedByHover = true;
    this._delayedTimer = setTimeout(() => {
      this.open();
      this._delayedTimer = undefined;
    }, this.delayBeforeOpen);
  }

  private _hoverCollapse(): void {
    if (!this.dock || !this._openedByHover) {
      return;
    }
    if (this._delayedTimer) { // cancel opening and clearing timeout of opening
      clearTimeout(this._delayedTimer);
      this._delayedTimer = undefined;
    }
    if (!this.opened) {
      return;
    }

    this._delayedTimer = setTimeout(() => {
      this.close();
      this._delayedTimer = undefined;
    }, this.delayBeforeClose);
  }

  // Sliding handlers
  // ==============================================================================================

  // apply passive event listening if it's supported
  private _applyPassive () {
    if (this._supportsPassive !== undefined) {
      return this._supportsPassive ? { passive: true } : false;
    }

    // feature detect
    let isSupported = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function () {
          isSupported = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {
      return false;
    }

    this._supportsPassive = isSupported;
    return this._applyPassive();
  }

  private _initSlideListeners(): void {
    this._elSidebar.nativeElement.addEventListener('touchstart', this._onTouchStart, this._applyPassive());
    this._elSidebar.nativeElement.addEventListener('touchmove', this._onTouchMove, this._applyPassive());
    this._elSidebar.nativeElement.addEventListener('touchend', this._onTouchEnd);
  }

  private _destroySlideListeners(): void {
    this._elSidebar.nativeElement.removeEventListener('touchend', this._onTouchStart);
    this._elSidebar.nativeElement.removeEventListener('touchmove', this._onTouchMove);
    this._elSidebar.nativeElement.removeEventListener('touchstart', this._onTouchStart);
  }

  private _calcOffset(): number {
    const offset = this._isLeftOrRight ? this._currentX - this._startX : this._currentY - this._startY;
    return this._isLeftOrTop ? Math.min(0, offset) : Math.max(0, offset);
  }

  private _update() {
    if (!this._touchingSideNav) {
      return;
    }

    requestAnimationFrame(this._update);

    const offset = this._calcOffset();

    this._elSidebar.nativeElement.style.transform =
      'translate' + (this._isLeftOrRight ? 'X' : 'Y') + `(${offset}px)`;
  }

  private _onTouchStart(evt) {
    if (!this.opened) {
      return;
    }

    this._touchingSideNav = true;

    this._startX = evt.touches[0].pageX;
    this._startY = evt.touches[0].pageY;
    this._currentX = this._startX;
    this._currentY = this._startY;

    requestAnimationFrame(this._update);
  }

  private _onTouchMove(evt) {
    if (!this._touchingSideNav) {
      return;
    }

    this._currentX = evt.touches[0].pageX;
    this._currentY = evt.touches[0].pageY;
  }

  private _onTouchEnd(evt) {
    if (!this._touchingSideNav) {
      return;
    }

    this._touchingSideNav = false;
    this._elSidebar.nativeElement.style.transform = '';

    if (Math.abs(this._calcOffset()) >= this.thresholdToClose) {
      this.close();
    }
  }


  // Auto collapse handlers
  // ==============================================================================================

  private _initCollapseListeners(): void {
    if (this.autoCollapseHeight || this.autoCollapseWidth) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (!this._onResizeAttached) {
          window.addEventListener('resize', this._collapse);
          this._onResizeAttached = true;
        }
      });
    }
  }

  private _destroyCollapseListeners(): void {
    if (this._onResizeAttached) {
      window.removeEventListener('resize', this._collapse);
      this._onResizeAttached = false;
    }
  }

  private _collapse(): void {
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
      return this._isDocked ? this._dockedSize : this._elSidebar.nativeElement.offsetHeight;
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
      return this._isDocked ? this._dockedSize : this._elSidebar.nativeElement.offsetWidth;
    }

    return 0;
  }

  /**
   * @internal
   *
   * Returns the docked size as a number.
   *
   * @return {number} Docked size.
   */
  get _dockedSize(): number {
    return parseFloat(this.dockedSize);
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is over mode.
   *
   * @return {boolean} Sidebar's mode is "over".
   */
  get _isModeOver(): boolean {
    return this.mode === 'over';
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is push mode.
   *
   * @return {boolean} Sidebar's mode is "push".
   */
  get _isModePush(): boolean {
    return this.mode === 'push';
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is slide mode.
   *
   * @return {boolean} Sidebar's mode is "slide".
   */
  get _isModeSlide(): boolean {
    return this.mode === 'slide';
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is "docked" -- i.e. it is closed but in dock mode.
   *
   * @return {boolean} Sidebar is docked.
   */
  get _isDocked(): boolean {
    return this.dock && this.dockedSize && !this.opened;
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is positioned at the left or top.
   *
   * @return {boolean} Sidebar is positioned at the left or top.
   */
  get _isLeftOrTop(): boolean {
    return this.position === 'left' || this.position === 'top';
  }

  /**
   * @internal
   *
   * Returns whether the sidebar is positioned at the left or right.
   *
   * @return {boolean} Sidebar is positioned at the left or right.
   */
  get _isLeftOrRight(): boolean {
    return this.position === 'left' || this.position === 'right';
  }


  /**
   * @internal
   *
   * Returns whether the sidebar is inert -- i.e. the contents cannot be focused.
   *
   * @return {boolean} Sidebar is inert.
   */
  get _isInert(): boolean {
    return !this.opened && !this.dock;
  }

  /**
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
