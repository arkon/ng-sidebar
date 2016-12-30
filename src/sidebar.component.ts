import {
  AfterContentInit,
  AnimationTransitionEvent,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { SidebarService } from './sidebar.service';

@Component({
  selector: 'ng-sidebar',
  template: `
    <aside #sidebar
      [@visibleSidebarState]="_visibleSidebarState"
      (@visibleSidebarState.start)="_animationStarted($event)"
      (@visibleSidebarState.done)="_animationDone($event)"
      role="complementary"
      [attr.aria-hidden]="!open"
      [attr.aria-label]="ariaLabel"
      class="ng-sidebar ng-sidebar--{{position}}"
      [class.ng-sidebar--push]="mode === 'push'"
      [class.ng-sidebar--style]="defaultStyles"
      [ngClass]="sidebarClass">
      <ng-content></ng-content>
    </aside>
  `,
  styles: [`
    .ng-sidebar {
      overflow: auto;
      pointer-events: none;
      position: fixed;
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

      .ng-sidebar--style {
        background: #fff;
        box-shadow: 0 0 2.5em rgba(85, 85, 85, 0.5);
      }

        .ng-sidebar--push.ng-sidebar--style {
          box-shadow: none;
        }
  `],
  animations: [
    trigger('visibleSidebarState', [
      state('expanded', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('expanded--animate', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('collapsed--left', style({ transform: 'translateX(-110%)' })),
      state('collapsed--right', style({ transform: 'translateX(110%)' })),
      state('collapsed--top', style({ transform: 'translateY(-110%)' })),
      state('collapsed--bottom', style({ transform: 'translateY(110%)' })),
      transition('expanded--animate <=> *', animate('0.3s cubic-bezier(0, 0, 0.3, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Sidebar implements AfterContentInit, OnChanges, OnDestroy {
  // `openedChange` allows for 2-way data binding
  @Input() opened: boolean = false;
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() mode: 'over' | 'push' = 'over';
  @Input() position: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end' = 'start';
  @Input() closeOnClickOutside: boolean = false;
  @Input() showBackdrop: boolean = false;
  @Input() animate: boolean = true;

  @Input() sidebarClass: string;
  @Input() defaultStyles: boolean = false;

  @Input() ariaLabel: string;
  @Input() trapFocus: boolean = true;
  @Input() autoFocus: boolean = true;

  @Input() keyClose: boolean = false;
  @Input() keyCode: number = 27;  // Default to ESCAPE key

  @Output() onOpenStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onOpened: EventEmitter<null> = new EventEmitter<null>();
  @Output() onCloseStart: EventEmitter<null> = new EventEmitter<null>();
  @Output() onClosed: EventEmitter<null> = new EventEmitter<null>();
  @Output() onModeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onPositionChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onAnimationStarted: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();
  @Output() onAnimationDone: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();

  /** @internal */
  _opened: boolean;

  /** @internal */
  _visibleSidebarState: string;

  @ViewChild('sidebar')
  private _elSidebar: ElementRef;

  private _onClickOutsideAttached: boolean = false;
  private _onKeyDownAttached: boolean = false;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  private _openSub: Subscription;
  private _closeSub: Subscription;

  constructor(
    @Inject(DOCUMENT) private _document /*: HTMLDocument */,
    private _sidebarService: SidebarService) {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this._trapFocus = this._trapFocus.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  ngAfterContentInit() {
    this._openSub = this._sidebarService.onOpen(this.open);
    this._closeSub = this._sidebarService.onClose(this.close);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['opened']) {
      if (this.opened) {
        this.open();
      } else {
        this.close();
      }

      this._toggleVisibleSidebarState();
    }

    if (changes['closeOnClickOutside'] || changes['keyClose']) {
      this._initCloseListeners();
    }

    if (changes['position']) {
      // Handle 'start' and 'end' aliases
      if (this.position === 'start') {
        this.position = this._isLTR ? 'left' : 'right';
      } else if (this.position === 'end') {
        this.position = this._isLTR ? 'right' : 'left';
      }

      this._toggleVisibleSidebarState();

      // Emit change in timeout to allow for position change to be rendered first
      setTimeout(() => {
        this.onPositionChange.emit(changes['position'].currentValue);
      });
    }

    if (changes['mode']) {
      this.onModeChange.emit(changes['mode'].currentValue);
    }
  }

  ngOnDestroy() {
    this._destroyCloseListeners();

    this._openSub.unsubscribe();
    this._closeSub.unsubscribe();
  }


  // Helpers
  // ==============================================================================================

  /** @internal */
  get _height(): number {
    if (this._elSidebar.nativeElement) {
      return this._elSidebar.nativeElement.offsetHeight;
    }

    return 0;
  }

  /** @internal */
  get _width(): number {
    if (this._elSidebar.nativeElement) {
      return this._elSidebar.nativeElement.offsetWidth;
    }

    return 0;
  }

  private get _isLTR(): boolean {
    let dir: string = 'ltr';

    if (window.getComputedStyle) {
      dir = window.getComputedStyle(this._document.body, null).getPropertyValue('direction');
    } else {
      dir = this._document.body.currentStyle.direction;
    }

    return dir === 'ltr';
  }


  // Animation callbacks
  // ==============================================================================================

  /** @internal */
  _animationStarted(e: AnimationTransitionEvent): void {
    this.onAnimationStarted.emit(e);

    if (this.opened) {
      this.onOpenStart.emit(null);
    } else {
      this.onCloseStart.emit(null);
    }
  }

  /** @internal */
  _animationDone(e: AnimationTransitionEvent): void {
    this.onAnimationDone.emit(e);

    if (this.opened) {
      this.onOpened.emit(null);
    } else {
      this.onClosed.emit(null);
    }

    this._opened = this.opened;
  }


  // Sidebar toggling
  // ==============================================================================================

  open(): void {
    if (!this.opened) {
      this.opened = true;
      this.openedChange.emit(true);

      this._setFocused(true);
      this._initCloseListeners();
    }
  }

  close(): void {
    if (this.opened) {
      this.opened = false;
      this.openedChange.emit(false);

      this._setFocused(false);
      this._destroyCloseListeners();
    }
  }

  private _toggleVisibleSidebarState(): void {
    this._visibleSidebarState = this.opened ?
      (this.animate ? 'expanded--animate' : 'expanded') :
      `collapsed--${this.position}`;
  }


  // Focus on open/close
  // ==============================================================================================

  private get _shouldTrapFocus(): boolean {
    return this._opened && this.trapFocus && this.mode === 'over';
  }

  private _setFocusToFirstItem(): void {
    if (this._focusableElements && this._focusableElements.length) {
      this._focusableElements[0].focus();
    }
  }

  private _trapFocus(e: FocusEvent): void {
    if (this._shouldTrapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
      this._setFocusToFirstItem();
    }
  }

  // Handles the ability to focus sidebar elements when it's open/closed
  private _setFocused(open: boolean): void {
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;

    if (open) {
      this._focusedBeforeOpen = this._document.activeElement as HTMLElement;

      // Restore focusability, with previous tabindex attributes
      for (let el of this._focusableElements) {
        const prevTabIndex = el.getAttribute('__tabindex__');
        if (prevTabIndex) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute('__tabindex__');
        } else {
          el.removeAttribute('tabindex');
        }
      }

      if (this.autoFocus) {
        this._setFocusToFirstItem();
      }

      this._document.body.addEventListener('focus', this._trapFocus, true);
    } else {
      // Manually make all focusable elements unfocusable, saving existing tabindex attributes
      for (let el of this._focusableElements) {
        const existingTabIndex = el.getAttribute('tabindex');
        if (existingTabIndex) {
          el.setAttribute('__tabindex__', existingTabIndex);
        }

        el.setAttribute('tabindex', '-1');
      }

      this._document.body.removeEventListener('focus', this._trapFocus, true);

      // Set focus back to element before the sidebar was opened
      if (this.autoFocus && this.mode === 'over' && this._focusedBeforeOpen) {
        this._focusedBeforeOpen.focus();
      }
    }
  }


  // Event handlers
  // ==============================================================================================

  private _initCloseListeners(): void {
    if (this.opened && (this.closeOnClickOutside || this.keyClose)) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (this.closeOnClickOutside && !this._onClickOutsideAttached) {
          this._document.body.addEventListener('click', this._onClickOutside);
          this._onClickOutsideAttached = true;
        }

        if (this.keyClose && !this._onKeyDownAttached) {
          this._document.body.addEventListener('keydown', this._onKeyDown);
          this._onKeyDownAttached = true;
        }
      });
    }
  }

  private _destroyCloseListeners(): void {
    if (this._onClickOutsideAttached) {
      this._document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }

    if (this._onKeyDownAttached) {
      this._document.body.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDownAttached = false;
    }
  }

  private _onClickOutside(e: MouseEvent): void {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this.close();
    }
  }

  private _onKeyDown(e: KeyboardEvent | Event): void {
    e = e || window.event;

    if ((e as KeyboardEvent).keyCode === this.keyCode) {
      this.close();
    }
  }
}
